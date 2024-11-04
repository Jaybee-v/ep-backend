import { Injectable } from '@nestjs/common';
import { IBookingRepository } from 'src/domain/repositories/booking.repository.interface';
import { PrismaService } from '../prisma/prisma.service';
import { Booking } from 'src/domain/entities/booking.entity';
import { BookingMapper } from '../mappers/booking.mapper';

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

  // async updateBooking(id: number, data: Booking): Promise<Booking> {
  //   const updatedBooking = await this.prisma.booking.update({
  //     where: { id },
  //     data: {
  //       title: data.title,
  //       description: data.description,
  //       location: data.location,
  //       date: data.date,
  //       start: data.start,
  //       end: data.end,
  //       status: data.status,
  //       discipline: data.discipline,
  //       maxParticipants: data.maxParticipants,
  //       requiredLevel: data.requiredLevel,
  //     },
  //   });

  //   return BookingMapper.toDomain(updatedBooking);
  // }
}
