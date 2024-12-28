export class CreateBookingSubscriptionCommand {
  constructor(
    public readonly userId: string,
    public readonly bookingId: number,
  ) {}
}
