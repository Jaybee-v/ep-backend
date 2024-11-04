import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsString()
  date: Date;

  @IsString()
  start: string;

  @IsString()
  end: string;

  @IsString()
  @IsNotEmpty()
  discipline: string;

  @IsNumber()
  @IsNotEmpty()
  requiredLevel: number;

  @IsNumber()
  @IsNotEmpty()
  maxParticipants: number;
}
