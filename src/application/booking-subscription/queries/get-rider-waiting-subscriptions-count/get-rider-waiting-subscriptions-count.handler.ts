import { Inject, Injectable } from '@nestjs/common';
import { IBookingSubscriptionRepository } from 'src/domain/repositories/booking-subscription.interface';
import { GetRiderWaitingSubscriptionsCountQuery } from './get-rider-waiting-subscriptions-count.query';

@Injectable()
export class GetRiderWaitingSubscriptionsCountHandler {
  constructor(
    @Inject('IBookingSubscriptionRepository')
    private readonly bookingSubscriptionRepository: IBookingSubscriptionRepository,
  ) {}

  public async execute(
    query: GetRiderWaitingSubscriptionsCountQuery,
  ): Promise<number> {
    return this.bookingSubscriptionRepository.getRiderWaitingSubscriptionsCount(
      query.userId,
    );
  }
}
