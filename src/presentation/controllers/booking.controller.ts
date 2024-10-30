import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateBookingHandler } from 'src/application/booking/commands/create-booking/create-booking.handler';
import { GetBookingByIdHandler } from 'src/application/booking/queries/get-booking-by-id/get-booking-by-id.handler';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { CreateBookingCommand } from 'src/application/booking/commands/create-booking/create-booking.command';
import { GetBookingByUserIdHandler } from 'src/application/booking/queries/get-booking-by-user-id/get-booking-by-user-id.handler';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly createBookingHandler: CreateBookingHandler,
    private readonly getBookingByIdHandler: GetBookingByIdHandler,
    private readonly getBookingByUserIdHandler: GetBookingByUserIdHandler,
  ) {}

  @Post()
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<{ status: number; message: string }> {
    try {
      const command = new CreateBookingCommand(
        createBookingDto.userId,
        createBookingDto.title,
        createBookingDto.description,
        createBookingDto.location,
        createBookingDto.date,
        createBookingDto.status,
      );

      const result = await this.createBookingHandler.execute(command);
      return { status: 201, message: result };
    } catch (error) {
      console.log('ERROR', error);
      throw new HttpException(
        {
          status: 500,
          error: 'Internal server error',
        },
        500,
      );
    }
  }

  @Get(':id')
  async getBookingById(
    @Param('id') id: number,
  ): Promise<{ status: number; data: any }> {
    try {
      const booking = await this.getBookingByIdHandler.execute({ id });
      return { status: 200, data: booking };
    } catch (error) {
      console.log('ERROR', error);
      throw new HttpException(
        {
          status: 500,
          error: 'Internal server error',
        },
        500,
      );
    }
  }

  @Get('user/:userId')
  async getBookingByUserId(
    @Param('userId') userId: string,
  ): Promise<{ status: number; data: any }> {
    try {
      const bookings = await this.getBookingByUserIdHandler.execute({ userId });
      return { status: 200, data: bookings };
    } catch (error) {
      console.log('ERROR', error);
      throw new HttpException(
        {
          status: 500,
          error: 'Internal server error',
        },
        500,
      );
    }
  }
}
