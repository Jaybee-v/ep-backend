import { Inject, Injectable } from '@nestjs/common';
import { Booking } from 'src/domain/entities/booking.entity';
import { IBookingRepository } from 'src/domain/repositories/booking.repository.interface';
import { GetWeekBookingsQuery } from './get-week-bookings-by-user-id.query';

export interface WeekBookings {
  weekStart: Date;
  days: {
    date: Date;
    bookings: Booking[];
  }[];
}

@Injectable()
export class GetWeekBookingsHandler {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(query: GetWeekBookingsQuery): Promise<WeekBookings> {
    // Obtenir les dates de début et fin de semaine
    const { weekStart, weekEnd } = this.getWeekBoundaries(query.date);

    // Récupérer toutes les réservations de la semaine
    const bookings = await this.bookingRepository.findByDateRange(
      query.userId,
      weekStart,
      weekEnd,
    );

    // Organiser les réservations par jour
    return this.organizeBookingsByDay(bookings, weekStart);
  }

  private getWeekBoundaries(date: Date): { weekStart: Date; weekEnd: Date } {
    const current = new Date(date);
    const currentDay = current.getDay();

    // Obtenir le lundi (début de semaine)
    const weekStart = new Date(current);
    weekStart.setDate(current.getDate() - (currentDay || 7) + 1);
    weekStart.setHours(0, 0, 0, 0);

    // Obtenir le dimanche (fin de semaine)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return { weekStart, weekEnd };
  }

  private organizeBookingsByDay(
    bookings: Booking[],
    weekStart: Date,
  ): WeekBookings {
    // Initialiser la structure de la semaine
    const weekDays = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + index);
      return {
        date: day,
        bookings: [],
      };
    });

    // Trier les réservations dans chaque jour
    bookings.forEach((booking) => {
      const dayIndex = Math.floor(
        (booking.getDate().getTime() - weekStart.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      if (dayIndex >= 0 && dayIndex < 7) {
        weekDays[dayIndex].bookings.push(booking);
      }
    });

    // Trier les réservations de chaque jour par heure de début
    weekDays.forEach((day) => {
      day.bookings.sort((a, b) => {
        return a.getStart().localeCompare(b.getStart());
      });
    });

    return {
      weekStart,
      days: weekDays,
    };
  }
}
