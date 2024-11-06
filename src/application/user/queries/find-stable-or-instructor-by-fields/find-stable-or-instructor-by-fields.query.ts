export class FindStableOrInstructorByFieldsQuery {
  constructor(
    public readonly fields: { name?: string; zipCode?: string },
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
