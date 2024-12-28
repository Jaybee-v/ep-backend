import { Inject, Injectable } from '@nestjs/common';
import { IBookingSubscriptionRepository } from 'src/domain/repositories/booking-subscription.interface';
import { GetRiderSubscriptionsQuery } from './get-rider-subscriptions.query';
import { BookingSubscription } from 'src/domain/entities/booking-subscription.entity';

@Injectable()
export class GetRiderSubscriptionsHandler {
  constructor(
    @Inject('IBookingSubscriptionRepository')
    private readonly bookingSubscriptionRepository: IBookingSubscriptionRepository,
  ) {}

  async execute(
    query: GetRiderSubscriptionsQuery,
  ): Promise<BookingSubscription[]> {
    let startDate: Date;

    if (query.date === 'WEEK') {
      startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    }
    if (query.date === 'MONTH') {
      startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    }
    if (query.date === 'YEAR') {
      startDate = new Date(
        new Date().setFullYear(new Date().getFullYear() - 1),
      );
    }

    return await this.bookingSubscriptionRepository.getRiderSubscriptions(
      query.userId,
      startDate,
    );
  }
}
