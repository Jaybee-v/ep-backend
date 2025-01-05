import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { LoginHandler } from './application/auth/commands/login/login.handler';
import { RefreshTokenHandler } from './application/auth/commands/refresh-token/refresh-token.handler';
import { RevokeTokenHandler } from './application/auth/commands/revoke-token/revoke-token.handler';
import { CreateBookingSubscriptionHandler } from './application/booking-subscription/commands/create-booking-subscription/create-booking-subscription.handler';
import { GetAllRiderSubHandler } from './application/booking-subscription/queries/get-all-riders-sub/get-all-rider-sub.handler';
import { GetBookingSubscriptionsByBookingIdHandler } from './application/booking-subscription/queries/get-by-booking-id/get-by-booking-id.handler';
import { GetRiderSubscriptionsHandler } from './application/booking-subscription/queries/get-rider-subscriptions/get-rider-subscriptions.handler';
import { GetSubscriptionsCountThisWeekByUserIdHandler } from './application/booking-subscription/queries/get-subscriptions-count-this-week-by-user-id/get-subscriptions-count-this-week-by-user-id.handler';
import { GetUserAndSubByBookingIdHandler } from './application/booking-subscription/queries/get-user-and-sub-by-booking-id/get-user-and-sub-by-booking-id.handler';
import { GetUserSubscriptionOnBookingHandler } from './application/booking-subscription/queries/get-user-sub-on-booking/get-user-sub-on-booking.handler';
import { CreateBookingHandler } from './application/booking/commands/create-booking/create-booking.handler';
import { UpdateBookingHandler } from './application/booking/commands/update-booking/update-booking.handler';
import { GetBookingByIdHandler } from './application/booking/queries/get-booking-by-id/get-booking-by-id.handler';
import { GetBookingByUserIdHandler } from './application/booking/queries/get-booking-by-user-id/get-booking-by-user-id.handler';
import { GetBookingsCountThisWeekHandler } from './application/booking/queries/get-bookings-count-this-week/get-bookings-count-this-week.handler';
import { GetDayBookingsByUserIdHandler } from './application/booking/queries/get-day-bookings-by-user-id/get-day-bookings-by-user-id.handler';
import { GetWeekBookingsHandler } from './application/booking/queries/get-week-bookings-by-user-id/get-week-bookings-by-user-id.handler';
import { CreatePricingHandler } from './application/pricing/commands/create-pricing/create-pricing.handler';
import { GetPricingsByUserIdHandler } from './application/pricing/queries/get-pricings-by-user-id/get-pricings-by-user-id.handler';
import { CreateUserHandler } from './application/user/commands/create-user/create-user.handler';
import { PatchUserHandler } from './application/user/commands/patch-user/patch-user.handler';
import { FindStableOrInstructorByFieldsHandler } from './application/user/queries/find-stable-or-instructor-by-fields/find-stable-or-instructor-by-fields.handler';
import { GetRidersCountByUserIdHandler } from './application/user/queries/get-riders-count-by-user-id/get-riders-count-by-user-id.handler';
import { GetRidersHandler } from './application/user/queries/get-riders/get-riders-handler';
import { GetStableAndTeachersHandler } from './application/user/queries/get-stable-and-teachers/get-stable-and-teachers.handler';
import { GetStableOrInstructorHandler } from './application/user/queries/get-stable-or-teacher/get-stable-or-teacher.handler';
import { GetUserByEmailHandler } from './application/user/queries/get-user-by-email/get-user-by-email.handler';
import { GetUserByIdHandler } from './application/user/queries/get-user-by-id/get-user-by-id.handler';
import { GetWeekFillingRateHandler } from './application/user/queries/get-week-filling-rate/get-week-filling-rate.handler';
import { JwtAdapter } from './infrastructure/adapters/jwt.adapter';
import { PrismaModule } from './infrastructure/persistence/prisma/prisma.module';
import { BookingSubscriptionRepository } from './infrastructure/persistence/repositories/booking-subscription.repository';
import { BookingRepository } from './infrastructure/persistence/repositories/booking.repository';
import { PricingRepository } from './infrastructure/persistence/repositories/pricing.repository';
import { TokenRepository } from './infrastructure/persistence/repositories/token.repository';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository';
import { AuthController } from './presentation/controllers/auth.controller';
import { BookingSubscriptionController } from './presentation/controllers/booking-subscription.controller';
import { BookingController } from './presentation/controllers/booking.controller';
import { HomepageController } from './presentation/controllers/homepage.controller';
import { PricingController } from './presentation/controllers/pricing.controller';
import { UserController } from './presentation/controllers/user.controller';
import { EmailModule } from './presentation/module/email.module';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    EmailModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
  ],
  controllers: [
    UserController,
    BookingController,
    AuthController,
    PricingController,
    BookingSubscriptionController,
    HomepageController,
  ],
  providers: [
    // Create Use Cases
    CreateUserHandler,
    CreateBookingHandler,
    CreatePricingHandler,
    CreateBookingSubscriptionHandler,
    LoginHandler,
    // Get Use Cases
    GetUserByEmailHandler,
    GetUserByIdHandler,
    GetBookingByIdHandler,
    GetBookingByUserIdHandler,
    GetWeekBookingsHandler,
    GetRidersHandler,
    RefreshTokenHandler,
    GetDayBookingsByUserIdHandler,
    GetStableAndTeachersHandler,
    GetStableOrInstructorHandler,
    FindStableOrInstructorByFieldsHandler,
    GetPricingsByUserIdHandler,
    GetBookingSubscriptionsByBookingIdHandler,
    GetUserSubscriptionOnBookingHandler,
    GetUserAndSubByBookingIdHandler,
    GetAllRiderSubHandler,
    GetRiderSubscriptionsHandler,
    GetBookingsCountThisWeekHandler,
    GetRidersCountByUserIdHandler,
    GetWeekFillingRateHandler,
    GetSubscriptionsCountThisWeekByUserIdHandler,
    // Patch Use Cases
    PatchUserHandler,
    UpdateBookingHandler,
    // Delete Use Cases
    RevokeTokenHandler,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IBookingRepository',
      useClass: BookingRepository,
    },
    {
      provide: 'IBookingSubscriptionRepository',
      useClass: BookingSubscriptionRepository,
    },
    {
      provide: 'IAuthPort',
      useClass: JwtAdapter,
    },
    {
      provide: 'ITokenRepository',
      useClass: TokenRepository,
    },
    {
      provide: 'IPricingRepository',
      useClass: PricingRepository,
    },
  ],
})
export class AppModule {}
