import { Inject, Injectable } from '@nestjs/common';
import { IBookingRepository } from 'src/domain/repositories/booking.repository.interface';
import { UpdateBookingCommand } from './update-booking.command';
import { Booking } from 'src/domain/entities/booking.entity';

@Injectable()
export class UpdateBookingHandler {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(command: UpdateBookingCommand): Promise<string> {
    const booking = await this.bookingRepository.findById(command.id);

    if (!booking) {
      throw new Error('Booking not found');
    }

    const _booking = Booking.updateBooking({
      id: command.id,
      userId: booking.getUserId(),
      title: command.title,
      discipline: command.discipline,
      description: command.description,
      location: command.location,
      date: command.date,
      start: command.start,
      end: command.end,
      status: booking.getStatus(),
      maxParticipants: command.maxParticipants,
      requiredLevel: command.requiredLevel,
      createdAt: booking.getCreatedAt(),
    });

    const updatedBooking = await this.bookingRepository.updateBooking(
      command.id,
      _booking,
    );

    return `Booking named ${updatedBooking.getTitle()} updated with id ${updatedBooking.getId()}`;
  }
}
