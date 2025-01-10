import { Inject, Injectable } from '@nestjs/common';
import { IBookingSubscriptionRepository } from 'src/domain/repositories/booking-subscription.interface';
import { GetRiderWeeklySubscriptionsCountQuery } from './get-rider-weekly-subscriptions-count.query';

@Injectable()
export class GetRiderWeeklySubscriptionsCountHandler {
  constructor(
    @Inject('IBookingSubscriptionRepository')
    private readonly bookingSubscriptionRepository: IBookingSubscriptionRepository,
  ) {}

  public async execute(
    query: GetRiderWeeklySubscriptionsCountQuery,
  ): Promise<number> {
    return this.bookingSubscriptionRepository.getRiderWeeklySubscriptionsCount(
      query.userId,
    );
  }
}
