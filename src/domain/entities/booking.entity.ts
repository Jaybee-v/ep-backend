export class Booking {
  constructor(
    private readonly id: number,
    private readonly userId: string,
    private readonly title: string,
    private readonly description: string,
    private readonly location: string,
    private readonly date: Date,
    private readonly start: string,
    private readonly end: string,
    private readonly status: string,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  public getId(): number {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getTitle(): string {
    return this.title;
  }

  public getDescription(): string {
    return this.description;
  }

  public getLocation(): string {
    return this.location;
  }

  public getDate(): Date {
    return this.date;
  }

  public getStart(): string {
    return this.start;
  }

  public getEnd(): string {
    return this.end;
  }

  public getStatus(): string {
    return this.status;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  static create(params: {
    userId: string;
    title: string;
    description: string;
    location: string;
    date: Date;
    start: string;
    end: string;
    status: string;
  }): Booking {
    return new Booking(
      undefined, // ID will be set by the database
      params.userId,
      params.title,
      params.description,
      params.location,
      params.date,
      params.start,
      params.end,
      params.status,
      new Date(),
      new Date(),
    );
  }
}
