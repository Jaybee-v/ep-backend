import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { AuthController } from '../controllers/auth.controller';
import { LoginHandler } from 'src/application/auth/commands/login/login.handler';
import { JwtAdapter } from 'src/infrastructure/adapters/jwt.adapter';
import { TokenRepository } from 'src/infrastructure/persistence/repositories/token.repository';
import { RefreshTokenHandler } from 'src/application/auth/commands/refresh-token/refresh-token.handler';
import { RevokeTokenHandler } from 'src/application/auth/commands/revoke-token/revoke-token.handler';
import { GetPricingsByUserIdHandler } from 'src/application/pricing/queries/get-pricings-by-user-id/get-pricings-by-user-id.handler';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    LoginHandler,
    RefreshTokenHandler,
    RevokeTokenHandler,
    GetPricingsByUserIdHandler,
    {
      provide: 'IAuthPort',
      useClass: JwtAdapter,
    },
    {
      provide: 'ITokenRepository',
      useClass: TokenRepository,
    },
  ],
  exports: ['IAuthPort'],
})
export class AuthModule {}
