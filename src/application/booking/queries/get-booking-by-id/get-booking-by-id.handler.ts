import { Inject, Injectable } from '@nestjs/common';
import { Booking } from 'src/domain/entities/booking.entity';
import { IBookingRepository } from 'src/domain/repositories/booking.repository.interface';
import { GetBookingByIdQuery } from './get-booking-by-id.query';

@Injectable()
export class GetBookingByIdHandler {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(query: GetBookingByIdQuery): Promise<Booking | null> {
    return await this.bookingRepository.findById(query.id);
  }
}
