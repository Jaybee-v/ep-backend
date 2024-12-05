import { Inject, Injectable } from '@nestjs/common';
import { IBookingSubscriptionRepository } from 'src/domain/repositories/booking-subscription.interface';
import { GetBookingSubscriptionsByBookingIdQuery } from './get-by-booking-id.query';
import { BookingSubscription } from 'src/domain/entities/booking-subscription.entity';

@Injectable()
export class GetBookingSubscriptionsByBookingIdHandler {
  constructor(
    @Inject('IBookingSubscriptionRepository')
    private readonly bookingSubscriptionRepository: IBookingSubscriptionRepository,
  ) {}

  async execute(
    query: GetBookingSubscriptionsByBookingIdQuery,
  ): Promise<BookingSubscription[]> {
    return await this.bookingSubscriptionRepository.getSubscriptionByBookingId(
      query.id,
    );
  }
}
