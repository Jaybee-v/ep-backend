export enum SubscriptionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  WAITING_LIST = 'WAITING_LIST',
  NO_SHOW = 'NO_SHOW',
}

export class BookingSubscription {
  constructor(
    private readonly id: number,
    private readonly bookingId: number,
    private readonly userId: string,
    private readonly status: SubscriptionStatus,
    private readonly position: number, // Position dans la liste d'attente si applicable
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  public getId(): number {
    return this.id;
  }

  public getBookingId(): number {
    return this.bookingId;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getStatus(): SubscriptionStatus {
    return this.status;
  }

  public getPosition(): number {
    return this.position;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public canCancel(): boolean {
    return this.status === SubscriptionStatus.CONFIRMED;
  }

  public isOnWaitingList(): boolean {
    return this.status === SubscriptionStatus.WAITING_LIST;
  }

  static create(params: {
    bookingId: number;
    userId: string;
    position: number;
  }) {
    return new BookingSubscription(
      undefined,
      params.bookingId,
      params.userId,
      SubscriptionStatus.PENDING,
      params.position,
      new Date(),
      new Date(),
    );
  }
}
