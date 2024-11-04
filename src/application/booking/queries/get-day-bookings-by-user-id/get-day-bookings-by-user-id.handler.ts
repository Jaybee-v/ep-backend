import { Inject, Injectable } from '@nestjs/common';
import { GetDayBookingsQuery } from './get-day-bookings-by-user-id.query';
import { IBookingRepository } from 'src/domain/repositories/booking.repository.interface';

@Injectable()
export class GetDayBookingsByUserIdHandler {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(query: GetDayBookingsQuery) {
    const { date, userId } = query;

    const startDay = new Date(date);
    startDay.setHours(0, 0, 0, 0);
    const endDay = new Date(date);
    endDay.setHours(23, 59, 59, 999);

    return await this.bookingRepository.findByDateRange(
      userId,
      startDay,
      endDay,
    );
  }
}
