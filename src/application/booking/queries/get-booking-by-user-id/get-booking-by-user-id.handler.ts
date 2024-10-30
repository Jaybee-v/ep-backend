import { Inject, Injectable } from '@nestjs/common';
import { IBookingRepository } from 'src/domain/repositories/booking.repository.interface';
import { GetBookingByUserIdQuery } from './get-booking-by-user-id.query';
import { Booking } from 'src/domain/entities/booking.entity';

@Injectable()
export class GetBookingByUserIdHandler {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(query: GetBookingByUserIdQuery): Promise<Booking[]> {
    return await this.bookingRepository.findByUserId(query.userId);
  }
}
