import { Controller, Get, Param } from '@nestjs/common';
import { GetRiderMonthlySubscriptionsCountHandler } from 'src/application/booking-subscription/queries/get-rider-monthly-subscriptions-count/get-rider-monthly-subscriptions-count.handler';
import { GetRiderTotalSubscriptionsCountHandler } from 'src/application/booking-subscription/queries/get-rider-total-subscriptions-count/get-rider-total-subscriptions-count.handler';
import { GetRiderWaitingSubscriptionsCountHandler } from 'src/application/booking-subscription/queries/get-rider-waiting-subscriptions-count/get-rider-waiting-subscriptions-count.handler';
import { GetRiderWeeklySubscriptionsCountHandler } from 'src/application/booking-subscription/queries/get-rider-weekly-subscriptions-count/get-rider-weekly-subscriptions-count.handler';

@Controller('lesson')
export class LessonController {
  constructor(
    private readonly getRiderMonthlySubscriptionsCountHandler: GetRiderMonthlySubscriptionsCountHandler,
    private readonly getRiderWeeklySubscriptionsCountHandler: GetRiderWeeklySubscriptionsCountHandler,
    private readonly getRiderTotalSubscriptionsCountHandler: GetRiderTotalSubscriptionsCountHandler,
    private readonly getRiderWaitingSubscriptionsCountHandler: GetRiderWaitingSubscriptionsCountHandler,
  ) {}

  @Get('rider/:id')
  public async getRiderLessons(@Param('id') id: string) {
    const bookingsCountThisMonth =
      await this.getRiderMonthlySubscriptionsCountHandler.execute({
        userId: id,
      });
    const bookingsCountThisWeek =
      await this.getRiderWeeklySubscriptionsCountHandler.execute({
        userId: id,
      });

    const bookingsCountTotal =
      await this.getRiderTotalSubscriptionsCountHandler.execute({
        userId: id,
      });

    const waitingSubscriptionsCount =
      await this.getRiderWaitingSubscriptionsCountHandler.execute({
        userId: id,
      });

    return {
      status: 200,
      data: {
        bookingsCountThisMonth,
        bookingsCountThisWeek,
        bookingsCountTotal,
        waitingSubscriptionsCount,
      },
    };
  }
}
