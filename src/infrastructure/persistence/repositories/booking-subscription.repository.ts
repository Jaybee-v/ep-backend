import { IBookingSubscriptionRepository } from 'src/domain/repositories/booking-subscription.interface';
import { PrismaService } from '../prisma/prisma.service';
import { BookingSubscription } from 'src/domain/entities/booking-subscription.entity';
import { Injectable } from '@nestjs/common';
import { BookingSubscriptionMapper } from '../mappers/booking-subscription.mapper';
import { Booking, BookingStatus } from 'src/domain/entities/booking.entity';

@Injectable()
export class BookingSubscriptionRepository
  implements IBookingSubscriptionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(
    bookingSubscription: BookingSubscription,
  ): Promise<BookingSubscription> {
    const data = BookingSubscriptionMapper.toPrisma(bookingSubscription);

    const savedSubscription = await this.prisma.bookingSubscription.create({
      data: {
        id: data.id,
        bookingId: data.bookingId,
        userId: data.userId,
        status: data.status,
        position: data.position,
      },
    });

    return BookingSubscriptionMapper.toDomain(savedSubscription);
  }

  async getSubscriptionByBookingId(id: number): Promise<BookingSubscription[]> {
    const subscriptions = await this.prisma.bookingSubscription.findMany({
      where: { bookingId: id },
    });

    return subscriptions.map(BookingSubscriptionMapper.toDomain);
  }

  async getUserSubscriptionOnBooking(
    userId: string,
    bookingId: number,
  ): Promise<BookingSubscription | null> {
    const subscription = await this.prisma.bookingSubscription.findFirst({
      where: { userId, bookingId },
    });

    return subscription
      ? BookingSubscriptionMapper.toDomain(subscription)
      : null;
  }

  async getRiderSubscriptions(
    userId: string,
    date: Date,
  ): Promise<BookingSubscription[]> {
    const subscriptions = await this.prisma.bookingSubscription.findMany({
      where: {
        userId,
        booking: {
          date: {
            gte: date,
            lte: new Date(),
          },
          status: {
            in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
          },
        },
      },
    });

    return subscriptions.map(BookingSubscriptionMapper.toDomain);
  }
}
