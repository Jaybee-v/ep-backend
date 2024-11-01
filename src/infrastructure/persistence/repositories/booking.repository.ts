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
}
