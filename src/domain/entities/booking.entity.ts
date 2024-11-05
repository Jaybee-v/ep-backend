import { User } from './user.entity';

export enum BookingStatus {
  PENDING = 'PENDING', // Vient d'être créé
  CONFIRMED = 'CONFIRMED', // Accepté par le centre/moniteur
  CANCELLED = 'CANCELLED', // Annulé (peu importe par qui pour commencer)
  COMPLETED = 'COMPLETED', // Cours terminé
}

export class Booking {
  constructor(
    private readonly id: number,
    private readonly userId: string,
    private readonly title: string,
    private readonly discipline: string,
    private readonly description: string,
    private readonly location: string,
    private readonly date: Date,
    private readonly start: string,
    private readonly end: string,
    private readonly status: BookingStatus,
    private readonly maxParticipants: number,
    private readonly requiredLevel: number,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {
    this.validateBooking();
  }

  private validateBooking(): void {
    if (!this.title.trim()) {
      throw new Error('Title is required');
    }
    if (
      !this.validateTimeFormat(this.start) ||
      !this.validateTimeFormat(this.end)
    ) {
      throw new Error('Invalid time format');
    }
    if (this.start >= this.end) {
      throw new Error('End time must be after start time');
    }
    // Validation de la date
    // if (this.date < new Date(new Date().setHours(0, 0, 0, 0))) {
    //   throw new Error('Cannot book in the past');
    // }
  }

  private validateTimeFormat(time: string): boolean {
    // Format HH:mm
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  public getId(): number {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getTitle(): string {
    return this.title;
  }

  public getDiscipline(): string {
    return this.discipline;
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

  public getStatus(): BookingStatus {
    return this.status;
  }

  public getMaxParticipants(): number {
    return this.maxParticipants;
  }

  public getRequiredLevel(): number {
    return this.requiredLevel;
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
    discipline: string;
    description: string;
    location: string;
    date: Date;
    start: string;
    end: string;
    maxParticipants: number;
    requiredLevel: number;
  }): Booking {
    return new Booking(
      undefined, // ID will be set by the database
      params.userId,
      params.title,
      params.discipline,
      params.description,
      params.location,
      params.date,
      params.start,
      params.end,
      BookingStatus.PENDING,
      params.maxParticipants,
      params.requiredLevel,
      new Date(),
      new Date(),
    );
  }

  static updateBooking(params: {
    id: number;
    userId: string;
    title: string;
    discipline: string;
    description: string;
    location: string;
    date: Date;
    start: string;
    end: string;
    status: BookingStatus;
    maxParticipants: number;
    requiredLevel: number;
    createdAt: Date;
  }): Booking {
    return new Booking(
      params.id,
      params.userId,
      params.title,
      params.discipline,
      params.description,
      params.location,
      params.date,
      params.start,
      params.end,
      params.status,
      params.maxParticipants,
      params.requiredLevel,
      params.createdAt,
      new Date(),
    );
  }
}
