import { DateRange } from './DateRange';

export class YearDateCalculator {
  static getCurrentYearRange(): DateRange {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);

    return new DateRange(startOfYear, endOfYear);
  }
}
