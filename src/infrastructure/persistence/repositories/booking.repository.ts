import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Booking, BookingStatus } from 'src/domain/entities/booking.entity';
import { IBookingRepository } from 'src/domain/repositories/booking.repository.interface';
import { WeekDateCalculator } from 'src/domain/shared/utils/WeekDateCalculator';
import { BookingMapper } from '../mappers/booking.mapper';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(booking: Booking): Promise<Booking> {
    const data = BookingMapper.toPrisma(booking);

    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role === 'RIDER') {
      throw new Error('Only instructors and stables can create bookings');
    }

    const savedBooking = await this.prisma.booking.create({
      data: {
        id: data.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        location: data.location,
        date: data.date,
        start: data.start,
        end: data.end,
        status: data.status,
        discipline: data.discipline,
        maxParticipants: data.maxParticipants,
        requiredLevel: data.requiredLevel,
      },
    });
    console.log('SAVED BOOKING', savedBooking);

    return BookingMapper.toDomain(savedBooking);
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
    });
    return bookings.map(BookingMapper.toDomain);
  }

  async findById(id: number): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });
    return booking ? BookingMapper.toDomain(booking) : null;
  }

  async findByDateRange(
    userId: string,
    start: Date,
    end: Date,
  ): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        subscriptions: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        start: 'asc',
      },
    });

    return bookings.map((booking) => BookingMapper.toDomain(booking));
  }

  async getBookingsCountThisWeek(userId: string): Promise<number> {
    const weekRange = WeekDateCalculator.getCurrentWeekRange();
    const bookings = await this.prisma.booking.count({
      where: {
        userId,
        date: {
          gte: weekRange.getStart(),
          lte: weekRange.getEnd(),
        },
      },
    });
    return bookings;
  }

  async getBookingsThisWeek(userId: string): Promise<Booking[]> {
    const weekRange = WeekDateCalculator.getCurrentWeekRange();
    const bookings = await this.prisma.booking.findMany({
      where: {
        userId,
        date: {
          gte: weekRange.getStart(),
          lte: weekRange.getEnd(),
        },
      },
    });
    return bookings.map((booking) => BookingMapper.toDomain(booking));
  }

  async updateBooking(id: number, data: Booking): Promise<Booking> {
    const booking = await this.findById(id);

    if (!booking) {
      throw new Error('Booking not found');
    }

    const _booking = BookingMapper.toPrisma(data);

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        title: _booking.title,
        description: _booking.description,
        location: _booking.location,
        date: _booking.date,
        start: _booking.start,
        end: _booking.end,
        status: _booking.status,
        discipline: _booking.discipline,
        maxParticipants: _booking.maxParticipants,
        requiredLevel: _booking.requiredLevel,
      },
    });

    return BookingMapper.toDomain(updatedBooking);
  }

  async updateBookingStatus(
    id: number,
    status: BookingStatus,
  ): Promise<Booking> {
    const booking = await this.findById(id);

    if (!booking) {
      throw new Error('Booking not found');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        status,
      },
    });

    return BookingMapper.toDomain(updatedBooking);
  }

  @Cron('*/10 * * * * ')
  async handleChangeBookingStatus() {
    console.log('Running cron job');

    // Correction du calcul des dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1); // Utilisation de getDate() au lieu de getDay()

    console.log('Today:', today);
    console.log('Yesterday:', yesterday);

    const bookings = await this.findAllByDateRange(yesterday, today);

    const currentHour = new Date().getHours();

    for (const booking of bookings) {
      console.log('Processing booking:', booking);

      // Integrer la verif de maxParticipants

      // Vérification de la date et de l'heure du booking
      const bookingDate = new Date(booking.getDate());
      const bookingHour = parseInt(booking.getStart());

      if (
        bookingDate.getTime() < today.getTime() ||
        (bookingDate.getTime() === today.getTime() && bookingHour < currentHour)
      ) {
        await this.updateBookingStatus(
          booking.getId(),
          'COMPLETED' as BookingStatus,
        );
        console.log('Booking marked as completed:', booking.getId());
      }
    }
  }

  private async findAllByDateRange(start: Date, end: Date) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        date: {
          gte: start, // Inversé start et end + suppression des new Date() inutiles
          lte: end,
        },
        status: 'PENDING',
      },
    });

    return bookings.map(BookingMapper.toDomain);
  }
}
