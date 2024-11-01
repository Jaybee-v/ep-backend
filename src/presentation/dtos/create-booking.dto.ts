import { IsString } from 'class-validator';

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
  status: string;
}
