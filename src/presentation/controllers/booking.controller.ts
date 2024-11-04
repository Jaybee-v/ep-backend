import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateBookingHandler } from 'src/application/booking/commands/create-booking/create-booking.handler';
import { GetBookingByIdHandler } from 'src/application/booking/queries/get-booking-by-id/get-booking-by-id.handler';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { CreateBookingCommand } from 'src/application/booking/commands/create-booking/create-booking.command';
import { GetBookingByUserIdHandler } from 'src/application/booking/queries/get-booking-by-user-id/get-booking-by-user-id.handler';
import { GetWeekBookingsHandler } from 'src/application/booking/queries/get-week-bookings-by-user-id/get-week-bookings-by-user-id.handler';
import { GetDayBookingsByUserIdHandler } from 'src/application/booking/queries/get-day-bookings-by-user-id/get-day-bookings-by-user-id.handler';

@Controller('bookings')
export class BookingController {
  constructor(
    private readonly createBookingHandler: CreateBookingHandler,
    private readonly getBookingByIdHandler: GetBookingByIdHandler,
    private readonly getBookingByUserIdHandler: GetBookingByUserIdHandler,
    private readonly getWeekBookingsHandler: GetWeekBookingsHandler,
    private readonly getDayBookingsHandler: GetDayBookingsByUserIdHandler,
  ) {}

  @Post()
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<{ status: number; message: string }> {
    try {
      const command = new CreateBookingCommand(
        createBookingDto.userId,
        createBookingDto.title,
        createBookingDto.discipline,
        createBookingDto.description,
        createBookingDto.location,
        new Date(createBookingDto.date),
        createBookingDto.start,
        createBookingDto.end,
        createBookingDto.maxParticipants,
        createBookingDto.requiredLevel,
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
    @Param('id') id: string,
  ): Promise<{ status: number; data: any }> {
    try {
      const booking = await this.getBookingByIdHandler.execute({
        id: parseInt(id),
      });
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

  // @Get('user/:userId')
  // async getBookingByUserId(
  //   @Param('userId') userId: string,
  // ): Promise<{ status: number; data: any }> {
  //   try {
  //     const bookings = await this.getBookingByUserIdHandler.execute({ userId });
  //     return { status: 200, data: bookings };
  //   } catch (error) {
  //     console.log('ERROR', error);
  //     throw new HttpException(
  //       {
  //         status: 500,
  //         error: 'Internal server error',
  //       },
  //       500,
  //     );
  //   }
  // }

  @Get('user/day')
  async getDayBookings(
    @Query('date') dateString: string,
    @Query('userId') userId: string,
  ) {
    const date = dateString ? new Date(dateString) : new Date();
    const dayBookings = await this.getDayBookingsHandler.execute({
      date,
      userId,
    });

    console.log('DAY BOOKINGS', dayBookings);

    return dayBookings;
  }

  @Get('user/week')
  async getWeekBookings(
    @Query('date') dateString: string,
    @Query('userId') userId: string,
  ) {
    const date = dateString ? new Date(dateString) : new Date();
    const weekBookings = await this.getWeekBookingsHandler.execute({
      date,
      userId,
    });

    console.log('WEEK BOOKINGS', weekBookings);

    return weekBookings;
  }
}
