import { DateRange } from './DateRange';

export class WeekDateCalculator {
  static getCurrentWeekRange(): DateRange {
    const now = new Date();
    // Définir le début de la semaine (lundi 00h01)
    const startOfWeek = new Date(now);
    const currentDay = now.getDay();
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
    startOfWeek.setDate(now.getDate() - daysToMonday);
    startOfWeek.setHours(0, 1, 0, 0);

    // Définir la fin de la semaine (dimanche 23h59:59)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return new DateRange(startOfWeek, endOfWeek);
  }
}
