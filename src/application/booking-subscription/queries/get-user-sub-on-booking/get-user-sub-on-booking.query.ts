export class GetUserSubscriptionOnBookingQuery {
  constructor(
    public readonly userId: string,
    public readonly bookingId: number,
  ) {}
}
