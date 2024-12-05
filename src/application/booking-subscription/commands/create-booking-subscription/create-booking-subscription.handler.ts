import { Inject, Injectable } from '@nestjs/common';
import { IBookingSubscriptionRepository } from 'src/domain/repositories/booking-subscription.interface';
import { CreateBookingSubscriptionCommand } from './create-booking-subscription.command';
import { BookingSubscription } from 'src/domain/entities/booking-subscription.entity';
import { GetBookingByIdHandler } from 'src/application/booking/queries/get-booking-by-id/get-booking-by-id.handler';
import { GetBookingSubscriptionsByBookingIdHandler } from '../../queries/get-by-booking-id/get-by-booking-id.handler';

@Injectable()
export class CreateBookingSubscriptionHandler {
  constructor(
    @Inject('IBookingSubscriptionRepository')
    private readonly bookingSubscriptionRepository: IBookingSubscriptionRepository,
    private readonly getBookingById: GetBookingByIdHandler,
    private readonly getBookingSubscriptionsByBookingId: GetBookingSubscriptionsByBookingIdHandler,
  ) {}

  async execute(command: CreateBookingSubscriptionCommand): Promise<string> {
    const booking = await this.getBookingById.execute({
      id: command.bookingId,
    });

    const maxParticipants = booking.getMaxParticipants();

    const subscriptions = await this.getBookingSubscriptionsByBookingId.execute(
      { id: command.bookingId },
    );

    const participants = subscriptions.length;

    let position = 0;

    if (participants >= maxParticipants) {
      position = participants - maxParticipants + 1;
    }

    const bookingSubscription = BookingSubscription.create({
      userId: command.userId,
      bookingId: command.bookingId,
      position: position,
    });

    const savedSubscription =
      await this.bookingSubscriptionRepository.save(bookingSubscription);

    if (position > 0) {
      return `You are on the waiting list with position ${position}`;
    }

    return `You are subscribed to the booking`;
  }
}
