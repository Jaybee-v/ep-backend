import { Inject, Injectable } from '@nestjs/common';
import { IBookingSubscriptionRepository } from 'src/domain/repositories/booking-subscription.interface';
import { GetSubscriptionsCountThisWeekByUserIdQuery } from './get-subscriptions-count-this-week-by-user-id.query';

@Injectable()
export class GetSubscriptionsCountThisWeekByUserIdHandler {
  constructor(
    @Inject('IBookingSubscriptionRepository')
    private readonly bookingSubscriptionRepository: IBookingSubscriptionRepository,
  ) {}

  async execute(
    query: GetSubscriptionsCountThisWeekByUserIdQuery,
  ): Promise<number> {
    return this.bookingSubscriptionRepository.getSubscriptionsCountThisWeekByUserId(
      query.userId,
    );
  }
}
