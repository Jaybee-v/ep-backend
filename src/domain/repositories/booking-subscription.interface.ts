import { BookingSubscription } from '../entities/booking-subscription.entity';

export interface IBookingSubscriptionRepository {
  save(bookingSubscription: BookingSubscription): Promise<BookingSubscription>;
  getSubscriptionByBookingId(id: number): Promise<BookingSubscription[]>;
}
