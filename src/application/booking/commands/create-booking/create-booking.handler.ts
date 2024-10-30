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
      description: command.description,
      location: command.location,
      date: command.date,
      status: command.status,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    return `Booking named ${savedBooking.getTitle()} created with id ${savedBooking.getId()}`;
  }
}
