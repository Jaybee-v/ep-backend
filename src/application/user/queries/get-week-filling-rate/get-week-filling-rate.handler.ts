import { Inject, Injectable } from '@nestjs/common';
import { IBookingSubscriptionRepository } from 'src/domain/repositories/booking-subscription.interface';
import { IBookingRepository } from 'src/domain/repositories/booking.repository.interface';
import { GetWeekFillingRateQuery } from './get-week-filling-rate.query';

@Injectable()
export class GetWeekFillingRateHandler {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
    @Inject('IBookingSubscriptionRepository')
    private readonly bookingSubscriptionRepository: IBookingSubscriptionRepository,
  ) {}

  async execute(query: GetWeekFillingRateQuery): Promise<number> {
    const weekBookings = await this.bookingRepository.getBookingsThisWeek(
      query.userId,
    );

    if (weekBookings.length === 0) {
      return 0;
    }

    let totalConfirmedParticipants = 0;
    let totalMaxParticipants = 0;

    for (let b = 0; b < weekBookings.length; b++) {
      const booking = weekBookings[b];
      const subscriptions =
        await this.bookingSubscriptionRepository.getSubscriptionByBookingId(
          booking.getId(),
        );

      // Ajouter au total
      totalConfirmedParticipants += subscriptions.length;
      totalMaxParticipants += booking.getMaxParticipants();
    }

    // Calculer le taux de remplissage (en pourcentage)
    const fillingRate =
      totalMaxParticipants > 0
        ? (totalConfirmedParticipants / totalMaxParticipants) * 100
        : 0;

    return fillingRate;
  }
}
