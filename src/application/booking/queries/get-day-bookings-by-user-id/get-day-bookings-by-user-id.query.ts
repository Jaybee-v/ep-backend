export class GetDayBookingsQuery {
  constructor(
    public readonly date: Date,
    public readonly userId: string, // Pour filtrer par créateur (STABLE/INSTRUCTOR)
  ) {}
}
