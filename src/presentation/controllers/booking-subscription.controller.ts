import { Body, Controller, Post } from '@nestjs/common';
import { CreateBookingSubscriptionHandler } from 'src/application/booking-subscription/commands/create-booking-subscription/create-booking-subscription.handler';
import { CreateBookingSubscriptionDto } from '../dtos/create-booking-subscription.dto';
import { CreateBookingSubscriptionCommand } from 'src/application/booking-subscription/commands/create-booking-subscription/create-booking-subscription.command';

@Controller('booking-subscription')
export class BookingSubscriptionController {
  constructor(
    private readonly createBookingSubscriptionHandler: CreateBookingSubscriptionHandler,
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
    return { status: 201, message: result };
  }
}
