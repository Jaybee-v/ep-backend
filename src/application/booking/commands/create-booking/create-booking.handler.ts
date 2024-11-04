import { Inject, Injectable } from '@nestjs/common';
import { IBookingRepository } from 'src/domain/repositories/booking.repository.interface';
import { CreateBookingCommand } from './create-booking.command';
import { Booking } from 'src/domain/entities/booking.entity';

@Injectable()
export class CreateBookingHandler {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(command: CreateBookingCommand): Promise<string> {
    const booking = Booking.create({
      userId: command.userId,
      title: command.title,
      discipline: command.discipline,
      description: command.description,
      location: command.location,
      date: command.date,
      start: command.start,
      end: command.end,
      maxParticipants: command.maxParticipants,
      requiredLevel: command.requiredLevel,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    return `Booking named ${savedBooking.getTitle()} created with id ${savedBooking.getId()}`;
  }
}
