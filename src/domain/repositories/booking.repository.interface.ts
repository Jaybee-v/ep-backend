import { Booking } from '../entities/booking.entity';

export interface IBookingRepository {
  save(booking: Booking): Promise<Booking>;
  findByUserId(userId: string): Promise<Booking[]>;
  findById(id: number): Promise<Booking | null>;
}