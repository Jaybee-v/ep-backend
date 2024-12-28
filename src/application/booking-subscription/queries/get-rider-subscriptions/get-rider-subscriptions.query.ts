export class GetRiderSubscriptionsQuery {
  constructor(
    public readonly userId: string,
    public readonly date: string,
  ) {}
}
