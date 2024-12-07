import {
  Booking,
  BookingFilling,
  BookingStatus,
} from 'src/domain/entities/booking.entity';
import { Booking as PrismaBooking } from '@prisma/client';

export class BookingMapper {
  static toDomain(raw: PrismaBooking): Booking {
    const booking = new Booking(
      raw.id,
      raw.userId,
      raw.title,
      raw.discipline,
      raw.description,
      raw.location,
      raw.date,
      raw.start,
      raw.end,
      raw.status as unknown as BookingStatus,
      raw.maxParticipants,
      raw.filling as unknown as BookingFilling,
      raw.requiredLevel,
      raw.createdAt,
      raw.updatedAt,
    );
    return booking;
  }

  static toPrisma(booking: Booking): any {
    return {
      userId: booking.getUserId(),
      title: booking.getTitle(),
      description: booking.getDescription(),
      location: booking.getLocation(),
      date: booking.getDate(),
      start: booking.getStart(),
      end: booking.getEnd(),
      status: booking.getStatus(),
      discipline: booking.getDiscipline(),
      maxParticipants: booking.getMaxParticipants(),
      filling: booking.getFilling(),
      requiredLevel: booking.getRequiredLevel(),
    };
  }
}
