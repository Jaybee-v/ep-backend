import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { GetUserByIdHandler } from 'src/application/user/queries/get-user-by-id/get-user-by-id.handler';
import { IAuthPort } from 'src/domain/ports/auth.port';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('IAuthPort')
    private readonly authPort: IAuthPort,
    private readonly getUserByIdHandler: GetUserByIdHandler,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.authPort.verifyToken(token);
      request.user = payload;

      const checkUserExists = await this.getUserByIdHandler.execute({
        id: payload.id,
      });
      if (!checkUserExists) {
        throw new UnauthorizedException();
      }

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
