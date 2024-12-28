import { BookingSubscription } from '../entities/booking-subscription.entity';

export interface IBookingSubscriptionRepository {
  save(bookingSubscription: BookingSubscription): Promise<BookingSubscription>;
  getSubscriptionByBookingId(id: number): Promise<BookingSubscription[]>;
  getUserSubscriptionOnBooking(
    userId: string,
    bookingId: number,
  ): Promise<BookingSubscription | null>;
  getRiderSubscriptions(
    userId: string,
    date: Date,
  ): Promise<BookingSubscription[]>;
}
