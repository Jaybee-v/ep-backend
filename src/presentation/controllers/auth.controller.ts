import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LoginCommand } from 'src/application/auth/commands/login/login.command';
import { LoginHandler } from 'src/application/auth/commands/login/login.handler';
<<<<<<< HEAD
import { RefreshTokenHandler } from 'src/application/auth/commands/refresh-token/refresh-token.handler';
import { RevokeTokenHandler } from 'src/application/auth/commands/revoke-token/revoke-token.handler';
import { JwtAuthGuard } from '../guards/auth.guard';
import { RevokeTokenCommand } from 'src/application/auth/commands/revoke-token/revoke-token.command';
import { RefreshTokenCommand } from 'src/application/auth/commands/refresh-token/refresh-token.command';
import { Auth } from 'googleapis';
import { AuthRequest } from 'src/domain/types/auth-request.type';
import { GetUserByIdHandler } from 'src/application/user/queries/get-user-by-id/get-user-by-id.handler';
import { GetPricingsByUserIdHandler } from 'src/application/pricing/queries/get-pricings-by-user-id/get-pricings-by-user-id.handler';
import { Pricing } from 'src/domain/entities/pricing.entity';
=======
import { RefreshTokenCommand } from 'src/application/auth/commands/refresh-token/refresh-token.command';
import { RefreshTokenHandler } from 'src/application/auth/commands/refresh-token/refresh-token.handler';
import { RevokeTokenHandler } from 'src/application/auth/commands/revoke-token/revoke-token.handler';
import { GetPricingsByUserIdHandler } from 'src/application/pricing/queries/get-pricings-by-user-id/get-pricings-by-user-id.handler';
import { PatchUserHandler } from 'src/application/user/commands/patch-user/patch-user.handler';
import { GetUserByIdHandler } from 'src/application/user/queries/get-user-by-id/get-user-by-id.handler';
import { Pricing } from 'src/domain/entities/pricing.entity';
import { AuthRequest } from 'src/domain/types/auth-request.type';
import { JwtAuthGuard } from '../guards/auth.guard';
>>>>>>> feat/home-controller

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginHandler: LoginHandler,
    private readonly refreshTokenHandler: RefreshTokenHandler,
    private readonly revokeTokenHandler: RevokeTokenHandler,
    private readonly getUserByIdHandler: GetUserByIdHandler,
    private readonly getPricingsByUserIdHandler: GetPricingsByUserIdHandler,
<<<<<<< HEAD
=======
    private readonly updateUserHandler: PatchUserHandler,
>>>>>>> feat/home-controller
  ) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const command = new LoginCommand(loginDto.email, loginDto.password);
    return this.loginHandler.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Get('is-authenticated')
  async isAuthenticated(@Req() req: AuthRequest) {
<<<<<<< HEAD
    console.log('req.user', req.user);
    const user = await this.getUserByIdHandler.execute({ id: req.user.id });
    console.log('user', user);
=======
    const user = await this.getUserByIdHandler.execute({ id: req.user.id });
>>>>>>> feat/home-controller
    if (user) {
      let pricings: Pricing[] = [];
      let pricingCompleted: boolean = false;
      if (user.getRole() !== 'RIDER') {
        pricings = await this.getPricingsByUserIdHandler.execute({
          userId: user.getId(),
        });
        if (pricings.length > 0) {
          pricingCompleted = true;
        }
      }
<<<<<<< HEAD

=======
      await this.updateUserHandler.execute({
        key: 'lastSeen',
        value: '',
        id: user.getId(),
      });
>>>>>>> feat/home-controller
      const _user = {
        ...user,
        pricingCompleted,
      };
      return {
        status: 200,
        data: _user,
        message: 'User is authenticated',
      };
    }
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.refreshTokenHandler.execute(
      new RefreshTokenCommand(refreshToken),
    );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Body('refreshToken') refreshToken: string) {
    await this.revokeTokenHandler.execute(refreshToken);
  }
}
