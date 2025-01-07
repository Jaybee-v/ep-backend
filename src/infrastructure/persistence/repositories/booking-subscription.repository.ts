import { Injectable } from '@nestjs/common';
import { BookingSubscription } from 'src/domain/entities/booking-subscription.entity';
import { BookingStatus } from 'src/domain/entities/booking.entity';
import { IBookingSubscriptionRepository } from 'src/domain/repositories/booking-subscription.interface';
import { MonthDateCalculator } from 'src/domain/shared/utils/MonthDateCalculator';
import { WeekDateCalculator } from 'src/domain/shared/utils/WeekDateCalculator';
import { BookingSubscriptionMapper } from '../mappers/booking-subscription.mapper';
import { PrismaService } from '../prisma/prisma.service';

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

  async getSubscriptionsCountThisWeekByUserId(userId: string): Promise<number> {
    const weekRange = WeekDateCalculator.getCurrentWeekRange();
    const subscriptions = await this.prisma.bookingSubscription.count({
      where: {
        booking: {
          userId,
          date: {
            gte: weekRange.getStart(),
            lte: weekRange.getEnd(),
          },
        },
      },
    });
    console.log('========');
    console.log(subscriptions);
    console.log('========');
    return subscriptions;
  }

  async getRiderMonthlySubscriptionsCount(userId: string): Promise<number> {
    const monthRange = MonthDateCalculator.getCurrentMonthRange();
    const subscriptions = await this.prisma.bookingSubscription.count({
      where: {
        userId,
        booking: {
          date: { gte: monthRange.getStart(), lte: monthRange.getEnd() },
          status: BookingStatus.COMPLETED,
        },
      },
    });
    return subscriptions;
  }
}
