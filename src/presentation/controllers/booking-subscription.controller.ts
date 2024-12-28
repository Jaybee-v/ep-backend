import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateBookingSubscriptionHandler } from 'src/application/booking-subscription/commands/create-booking-subscription/create-booking-subscription.handler';
import { CreateBookingSubscriptionDto } from '../dtos/create-booking-subscription.dto';
import { CreateBookingSubscriptionCommand } from 'src/application/booking-subscription/commands/create-booking-subscription/create-booking-subscription.command';
import { GetUserSubscriptionOnBookingHandler } from 'src/application/booking-subscription/queries/get-user-sub-on-booking/get-user-sub-on-booking.handler';
import { GetBookingSubscriptionsByBookingIdHandler } from 'src/application/booking-subscription/queries/get-by-booking-id/get-by-booking-id.handler';
import { BookingSubscription } from 'src/domain/entities/booking-subscription.entity';
import { GetAllRiderSubHandler } from 'src/application/booking-subscription/queries/get-all-riders-sub/get-all-rider-sub.handler';
import { Booking } from 'src/domain/entities/booking.entity';

@Controller('booking-subscription')
export class BookingSubscriptionController {
  constructor(
    private readonly createBookingSubscriptionHandler: CreateBookingSubscriptionHandler,
    private readonly getUserSubscriptionOnBookingHandler: GetUserSubscriptionOnBookingHandler,
    private readonly getSubscriptionByBookingIdHandler: GetBookingSubscriptionsByBookingIdHandler,
    private readonly getAllRiderSubHandler: GetAllRiderSubHandler,
  ) {}

  @Post()
  async createBookingSubscription(
    @Body() createBookingSubscription: CreateBookingSubscriptionDto,
  ): Promise<{ status: number; message: string }> {
    const command = new CreateBookingSubscriptionCommand(
      createBookingSubscription.userId,
      createBookingSubscription.bookingId,
    );
    const result = await this.createBookingSubscriptionHandler.execute(command);
    console.log('RESULT', result);
    return { status: 201, message: result };
  }

  @Get('user/:userId')
  async getUserSubscriptionsOnBooking(
    @Param('id') userId: string,
    @Query('bookingId') bookingId: string,
  ): Promise<boolean> {
    const result = await this.getUserSubscriptionOnBookingHandler.execute({
      userId,
      bookingId: parseInt(bookingId),
    });
    return result;
  }

  @Get(':id')
  async getBookingSubscription(
    @Param('id') id: string,
  ): Promise<{ status: number; message: string; data: BookingSubscription[] }> {
    const subs = await this.getSubscriptionByBookingIdHandler.execute({
      id: parseInt(id),
    });
    console.log('SUBS', subs);

    return {
      status: 200,
      message: 'Subscriptions found',
      data: subs,
    };
  }

  @Get('rider/:userId')
  async getRiderSubscriptions(
    @Param('userId') userId: string,
    @Query('date') date: string,
  ): Promise<{
    status: number;
    message: string;
    data: { pastBookings: Booking[]; upcomingBookings: Booking[] };
  }> {
    const subs = await this.getAllRiderSubHandler.execute({
      userId,
      date,
    });
    console.log('SUBS', subs);

    return {
      status: 200,
      message: 'Subscriptions found',
      data: subs,
    };
  }
}
