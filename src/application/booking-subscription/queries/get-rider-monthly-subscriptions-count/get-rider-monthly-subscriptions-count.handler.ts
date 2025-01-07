import { Inject, Injectable } from '@nestjs/common';
import { IBookingSubscriptionRepository } from 'src/domain/repositories/booking-subscription.interface';
import { GetRiderMonthlySubscriptionsCountQuery } from './get-rider-monthly-subscriptions-count.query';

@Injectable()
export class GetRiderMonthlySubscriptionsCountHandler {
  constructor(
    @Inject('IBookingSubscriptionRepository')
    private readonly bookingSubscriptionRepository: IBookingSubscriptionRepository,
  ) {}

  public async execute(
    query: GetRiderMonthlySubscriptionsCountQuery,
  ): Promise<number> {
    return this.bookingSubscriptionRepository.getRiderMonthlySubscriptionsCount(
      query.userId,
    );
  }
}
