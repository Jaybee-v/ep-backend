import { Inject, Injectable } from '@nestjs/common';
import { GetUserByIdHandler } from 'src/application/user/queries/get-user-by-id/get-user-by-id.handler';
import { IBookingSubscriptionRepository } from 'src/domain/repositories/booking-subscription.interface';
import { GetUserAndSubByBookingIdQuery } from './get-user-and-sub-by-booking-id.query';
import { User } from 'src/domain/entities/user.entity';
import { BookingSubscription } from 'src/domain/entities/booking-subscription.entity';

@Injectable()
export class GetUserAndSubByBookingIdHandler {
  constructor(
    @Inject('IBookingSubscriptionRepository')
    private readonly bookingSubscriptionRepository: IBookingSubscriptionRepository,
    private readonly getUserById: GetUserByIdHandler,
  ) {}

  async execute(
    query: GetUserAndSubByBookingIdQuery,
  ): Promise<{ user: User; subscription: BookingSubscription }[]> {
    const subs =
      await this.bookingSubscriptionRepository.getSubscriptionByBookingId(
        query.id,
      );

    const array: { user: User; subscription: BookingSubscription }[] = [];

    for (const sub of subs) {
      const user = await this.getUserById.execute({ id: sub.getUserId() });
      array.push({ user, subscription: sub });
    }

    return array;
  }
}
