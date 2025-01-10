import { BookingSubscription } from '../entities/booking-subscription.entity';

export interface IBookingSubscriptionRepository {
  save(bookingSubscription: BookingSubscription): Promise<BookingSubscription>;
  getSubscriptionByBookingId(id: number): Promise<BookingSubscription[]>;
  getUserSubscriptionOnBooking(
    userId: string,
    bookingId: number,
  ): Promise<BookingSubscription | null>;
  getRiderMonthlySubscriptionsCount(userId: string): Promise<number>;
  getRiderWeeklySubscriptionsCount(userId: string): Promise<number>;
  getRiderTotalSubscriptionsCount(userId: string): Promise<number>;
  getRiderWaitingSubscriptionsCount(userId: string): Promise<number>;
  getSubscriptionsCountThisWeekByUserId(userId: string): Promise<number>;
  getRiderSubscriptions(
    userId: string,
    date: Date,
  ): Promise<BookingSubscription[]>;
}
