import { Controller, Get, Param } from '@nestjs/common';
import { GetRiderMonthlySubscriptionsCountHandler } from 'src/application/booking-subscription/queries/get-rider-monthly-subscriptions-count/get-rider-monthly-subscriptions-count.handler';
import { GetSubscriptionsCountThisWeekByUserIdHandler } from 'src/application/booking-subscription/queries/get-subscriptions-count-this-week-by-user-id/get-subscriptions-count-this-week-by-user-id.handler';
import { GetBookingsCountThisWeekHandler } from 'src/application/booking/queries/get-bookings-count-this-week/get-bookings-count-this-week.handler';
import { GetRidersCountByUserIdHandler } from 'src/application/user/queries/get-riders-count-by-user-id/get-riders-count-by-user-id.handler';
import { GetWeekFillingRateHandler } from 'src/application/user/queries/get-week-filling-rate/get-week-filling-rate.handler';

@Controller('homepage')
export class HomepageController {
  constructor(
    private readonly getRidersCountByUserIdHandler: GetRidersCountByUserIdHandler,
    private readonly getWeekFillingRateHandler: GetWeekFillingRateHandler,
    private readonly getSubscriptionsCountThisWeekByUserIdHandler: GetSubscriptionsCountThisWeekByUserIdHandler,
    private readonly getBookingsCountThisWeekHandler: GetBookingsCountThisWeekHandler,
    private readonly getRiderMonthlySubscriptionsCountHandler: GetRiderMonthlySubscriptionsCountHandler,
  ) {}

  @Get('stable/:id')
  public async getHomepage(@Param('id') id: string) {
    const ridersCount = await this.getRidersCountByUserIdHandler.execute({
      userId: id,
    });
    const bookingsCountThisWeek =
      await this.getBookingsCountThisWeekHandler.execute({
        userId: id,
      });
    const fillingRate = await this.getWeekFillingRateHandler.execute({
      userId: id,
    });
    const subscriptionsCountThisWeek =
      await this.getSubscriptionsCountThisWeekByUserIdHandler.execute({
        userId: id,
      });
    return {
      status: 200,
      data: {
        ridersCount,
        bookingsCountThisWeek,
        fillingRate,
        subscriptionsCountThisWeek,
      },
    };
  }

  @Get('rider/:id')
  public async getRider(@Param('id') id: string) {
    const riderMonthlySubscriptionsCount =
      await this.getRiderMonthlySubscriptionsCountHandler.execute({
        userId: id,
      });
    return {
      status: 200,
      data: {
        monthlySubs: riderMonthlySubscriptionsCount,
      },
    };
  }
}
