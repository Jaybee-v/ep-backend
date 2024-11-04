import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LoginCommand } from 'src/application/auth/commands/login/login.command';
import { LoginHandler } from 'src/application/auth/commands/login/login.handler';
import { RefreshTokenHandler } from 'src/application/auth/commands/refresh-token/refresh-token.handler';
import { RevokeTokenHandler } from 'src/application/auth/commands/revoke-token/revoke-token.handler';
import { JwtAuthGuard } from '../guards/auth.guard';
import { RevokeTokenCommand } from 'src/application/auth/commands/revoke-token/revoke-token.command';
import { RefreshTokenCommand } from 'src/application/auth/commands/refresh-token/refresh-token.command';
import { Auth } from 'googleapis';
import { AuthRequest } from 'src/domain/types/auth-request.type';
import { GetUserByIdHandler } from 'src/application/user/queries/get-user-by-id/get-user-by-id.handler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginHandler: LoginHandler,
    private readonly refreshTokenHandler: RefreshTokenHandler,
    private readonly revokeTokenHandler: RevokeTokenHandler,
    private readonly getUserByIdHandler: GetUserByIdHandler,
  ) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const command = new LoginCommand(loginDto.email, loginDto.password);
    return this.loginHandler.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Get('is-authenticated')
  async isAuthenticated(@Req() req: AuthRequest) {
    console.log('req.user', req.user);
    const user = await this.getUserByIdHandler.execute({ id: req.user.id });
    console.log('user', user);
    if (user) {
      return {
        status: 200,
        data: user,
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
