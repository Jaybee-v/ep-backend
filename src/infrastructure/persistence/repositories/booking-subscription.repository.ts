import { IBookingSubscriptionRepository } from 'src/domain/repositories/booking-subscription.interface';
import { PrismaService } from '../prisma/prisma.service';
import { BookingSubscription } from 'src/domain/entities/booking-subscription.entity';

export class BookingSubscriptionRepository
  implements IBookingSubscriptionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  // async save(
  //   bookingSubscription: BookingSubscription,
  // ): Promise<BookingSubscription> {}
}
