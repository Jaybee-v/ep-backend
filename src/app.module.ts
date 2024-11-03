import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/persistence/prisma/prisma.module';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserHandler } from './application/user/commands/create-user/create-user.handler';
import { GetUserByEmailHandler } from './application/user/queries/get-user-by-email/get-user-by-email.handler';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository';
import { GetUserByIdHandler } from './application/user/queries/get-user-by-id/get-user-by-id.handler';
import { BookingRepository } from './infrastructure/persistence/repositories/booking.repository';
import { CreateBookingHandler } from './application/booking/commands/create-booking/create-booking.handler';
import { GetBookingByIdHandler } from './application/booking/queries/get-booking-by-id/get-booking-by-id.handler';
import { BookingController } from './presentation/controllers/booking.controller';
import { GetBookingByUserIdHandler } from './application/booking/queries/get-booking-by-user-id/get-booking-by-user-id.handler';
import { PatchUserHandler } from './application/user/commands/patch-user/patch-user.handler';
import { EmailModule } from './presentation/module/email.module';
import { MailerAdapter } from './infrastructure/adapters/mailer.adapter';
import { ConfigModule } from '@nestjs/config';
import { GetWeekBookingsHandler } from './application/booking/queries/get-week-bookings-by-user-id/get-week-bookings-by-user-id.handler';
import { GetRidersHandler } from './application/user/queries/get-riders/get-riders-handler';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
  ],
  controllers: [UserController, BookingController],
  providers: [
    // Create Use Cases
    CreateUserHandler,
    CreateBookingHandler,
    // Get Use Cases
    GetUserByEmailHandler,
    GetUserByIdHandler,
    GetBookingByIdHandler,
    GetBookingByUserIdHandler,
    GetWeekBookingsHandler,
    GetRidersHandler,
    // Patch Use Cases
    PatchUserHandler,
    // Delete Use Cases
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IBookingRepository',
      useClass: BookingRepository,
    },
  ],
})
export class AppModule {}
