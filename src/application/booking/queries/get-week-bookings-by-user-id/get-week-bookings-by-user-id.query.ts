export class GetWeekBookingsQuery {
  constructor(
    public readonly date: Date,
    public readonly userId: string, // Pour filtrer par créateur (STABLE/INSTRUCTOR)
  ) {}
}
