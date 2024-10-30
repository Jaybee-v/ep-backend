export class CreateBookingCommand {
  constructor(
    public readonly userId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly location: string,
    public readonly date: Date,
    public readonly status: string,
  ) {}
}
