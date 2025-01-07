import { DateRange } from './DateRange';

export class MonthDateCalculator {
  static getCurrentMonthRange(): DateRange {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return new DateRange(startOfMonth, endOfMonth);
  }
}
