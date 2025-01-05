export class DateRange {
  constructor(
    private readonly start: Date,
    private readonly end: Date,
  ) {}

  getStart(): Date {
    return this.start;
  }

  getEnd(): Date {
    return this.end;
  }
}
