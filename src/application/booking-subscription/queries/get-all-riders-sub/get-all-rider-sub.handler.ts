import { Injectable } from '@nestjs/common';
import { GetRiderSubscriptionsHandler } from '../get-rider-subscriptions/get-rider-subscriptions.handler';
import { GetBookingByIdHandler } from 'src/application/booking/queries/get-booking-by-id/get-booking-by-id.handler';
import { GetAllRidersSubQuery } from './get-all-riders-sub.query';
import { Booking } from 'src/domain/entities/booking.entity';

@Injectable()
export class GetAllRiderSubHandler {
  constructor(
    private readonly getRiderSubscriptionsHandler: GetRiderSubscriptionsHandler,
    private readonly getBookingByIdHandler: GetBookingByIdHandler,
  ) {}

  async execute(
    data: GetAllRidersSubQuery,
  ): Promise<{ pastBookings: Booking[]; upcomingBookings: Booking[] }> {
    const subscriptions = await this.getRiderSubscriptionsHandler.execute({
      userId: data.userId,
      date: data.date,
    });

    if (!subscriptions.length) {
      return { pastBookings: [], upcomingBookings: [] };
    }

    // Extraction des IDs de réservation
    const bookingIds = subscriptions.map((sub) => sub.getBookingId());

    try {
      const bookings: Booking[] = [];

      for (const id of bookingIds) {
        const booking = await this.getBookingByIdHandler.execute({ id });
        console.log('BOOKING', booking);
        bookings.push(booking);
      }

      // Séparation des réservations en une seule itération
      const { completed, pending } = bookings.reduce(
        (acc, booking) => {
          const status = booking.getStatus();
          if (status === 'COMPLETED') {
            acc.completed.push(booking);
          } else if (status === 'PENDING') {
            acc.pending.push(booking);
          }
          return acc;
        },
        { completed: [] as Booking[], pending: [] as Booking[] },
      );

      return {
        pastBookings: completed,
        upcomingBookings: pending,
      };
    } catch (error) {
      // Gestion appropriée des erreurs
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
  }
}
