import { Inject, Injectable } from '@nestjs/common';
import { IBookingSubscriptionRepository } from 'src/domain/repositories/booking-subscription.interface';
import { GetRiderTotalSubscriptionsCountQuery } from './get-rider-total-subscriptions-count.query';

@Injectable()
export class GetRiderTotalSubscriptionsCountHandler {
  constructor(
    @Inject('IBookingSubscriptionRepository')
    private readonly bookingSubscriptionRepository: IBookingSubscriptionRepository,
  ) {}

  public async execute(
    query: GetRiderTotalSubscriptionsCountQuery,
  ): Promise<number> {
    return this.bookingSubscriptionRepository.getRiderTotalSubscriptionsCount(
      query.userId,
    );
  }
}
