import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookingSubscriptionDto {
  @IsNumber()
  @IsNotEmpty()
  bookingId: number;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
