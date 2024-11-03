import { Booking } from 'src/domain/entities/booking.entity';

export class BookingMapper {
  static toDomain(raw: any): Booking {
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
      raw.status,
      raw.maxParticipants,
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
    };
  }
}
