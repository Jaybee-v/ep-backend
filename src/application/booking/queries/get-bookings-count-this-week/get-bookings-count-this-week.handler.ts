import { Inject, Injectable } from '@nestjs/common';
import { IBookingRepository } from 'src/domain/repositories/booking.repository.interface';
import { GetBookingsCountThisWeekQuery } from './get-bookings-count-this-week.query';

@Injectable()
export class GetBookingsCountThisWeekHandler {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(query: GetBookingsCountThisWeekQuery) {
    const { userId } = query;
    return await this.bookingRepository.getBookingsCountThisWeek(userId);
  }
}
