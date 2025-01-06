import { Booking } from '../entities/booking.entity';

export interface IBookingRepository {
  save(booking: Booking): Promise<Booking>;
  findByUserId(userId: string): Promise<Booking[]>;
  findById(id: number): Promise<Booking | null>;
  findByDateRange(userId: string, start: Date, end: Date): Promise<Booking[]>;
  getBookingsCountThisWeek(userId: string): Promise<number>;
  getBookingsThisWeek(userId: string): Promise<Booking[]>;
  updateBooking(id: number, data: Booking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;
}
