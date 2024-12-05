import { BookingSubscription as PrismaBookingSubscription } from '@prisma/client';
import { BookingSubscription } from 'src/domain/entities/booking-subscription.entity';

export class BookingSubscriptionMapper {
  static toDomain(raw: any): BookingSubscription {
    const bookingSub = new BookingSubscription(
      raw.id,
      raw.bookingId,
      raw.userId,
      raw.status,
      raw.position,
      raw.createdAt,
      raw.updatedAt,
    );
    return bookingSub;
  }

  static toPrisma(bookingSub: BookingSubscription): PrismaBookingSubscription {
    return {
      id: bookingSub.getId(),
      bookingId: bookingSub.getBookingId(),
      userId: bookingSub.getUserId(),
      status: bookingSub.getStatus(),
      position: bookingSub.getPosition(),
      createdAt: bookingSub.getCreatedAt(),
      updatedAt: bookingSub.getUpdatedAt(),
    };
  }
}
