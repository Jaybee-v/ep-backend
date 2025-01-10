import { Inject, Injectable } from '@nestjs/common';
import { BookingSubscription } from 'src/domain/entities/booking-subscription.entity';
import { IBookingSubscriptionRepository } from 'src/domain/repositories/booking-subscription.interface';
import { MonthDateCalculator } from 'src/domain/shared/utils/MonthDateCalculator';
import { WeekDateCalculator } from 'src/domain/shared/utils/WeekDateCalculator';
import { YearDateCalculator } from 'src/domain/shared/utils/YearDateCalculator';
import { GetRiderSubscriptionsQuery } from './get-rider-subscriptions.query';

@Injectable()
export class GetRiderSubscriptionsHandler {
  constructor(
    @Inject('IBookingSubscriptionRepository')
    private readonly bookingSubscriptionRepository: IBookingSubscriptionRepository,
  ) {}

  async execute(
    query: GetRiderSubscriptionsQuery,
  ): Promise<BookingSubscription[]> {
    let startDate: Date;

    if (query.date === 'WEEK') {
      const weekRange = WeekDateCalculator.getCurrentWeekRange();
      startDate = weekRange.getStart();
    }
    if (query.date === 'MONTH') {
      const monthRange = MonthDateCalculator.getCurrentMonthRange();
      startDate = monthRange.getStart();
    }
    if (query.date === 'YEAR') {
      const yearRange = YearDateCalculator.getCurrentYearRange();
      startDate = yearRange.getStart();
    }

    return await this.bookingSubscriptionRepository.getRiderSubscriptions(
      query.userId,
      startDate,
    );
  }
}
