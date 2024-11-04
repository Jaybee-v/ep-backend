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
import { AuthModule } from './presentation/module/auth.module';
import { JwtAdapter } from './infrastructure/adapters/jwt.adapter';
import { TokenRepository } from './infrastructure/persistence/repositories/token.repository';
import { LoginHandler } from './application/auth/commands/login/login.handler';
import { RefreshTokenHandler } from './application/auth/commands/refresh-token/refresh-token.handler';
import { RevokeTokenHandler } from './application/auth/commands/revoke-token/revoke-token.handler';
import { AuthController } from './presentation/controllers/auth.controller';
import { GetDayBookingsByUserIdHandler } from './application/booking/queries/get-day-bookings-by-user-id/get-day-bookings-by-user-id.handler';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
  ],
  controllers: [UserController, BookingController, AuthController],
  providers: [
    // Create Use Cases
    CreateUserHandler,
    CreateBookingHandler,
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
    // Patch Use Cases
    PatchUserHandler,
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
      provide: 'IAuthPort',
      useClass: JwtAdapter,
    },
    {
      provide: 'ITokenRepository',
      useClass: TokenRepository,
    },
  ],
})
export class AppModule {}
