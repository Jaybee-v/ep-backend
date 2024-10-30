export class Booking {
  constructor(
    private readonly id: number,
    private readonly userId: string,
    private readonly title: string,
    private readonly description: string,
    private readonly location: string,
    private readonly date: Date,
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
    status: string;
  }): Booking {
    return new Booking(
      undefined, // ID will be set by the database
      params.userId,
      params.title,
      params.description,
      params.location,
      params.date,
      params.status,
      new Date(),
      new Date(),
    );
  }
}
