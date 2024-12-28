import { Inject, Injectable } from '@nestjs/common';
import { IBookingSubscriptionRepository } from 'src/domain/repositories/booking-subscription.interface';
import { GetUserSubscriptionOnBookingQuery } from './get-user-sub-on-booking.query';

@Injectable()
export class GetUserSubscriptionOnBookingHandler {
  constructor(
    @Inject('IBookingSubscriptionRepository')
    private readonly bookingSubscriptionRepository: IBookingSubscriptionRepository,
  ) {}

  async execute(query: GetUserSubscriptionOnBookingQuery): Promise<boolean> {
    const sub =
      await this.bookingSubscriptionRepository.getUserSubscriptionOnBooking(
        query.userId,
        query.bookingId,
      );

    if (!sub) return false;

    return true;
  }
}
