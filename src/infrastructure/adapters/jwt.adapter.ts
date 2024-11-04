import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAuthPort } from 'src/domain/ports/auth.port';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAdapter implements IAuthPort {
  constructor(private readonly configService: ConfigService) {}

  generateToken(payload: any): string {
    return jwt.sign(payload, this.configService.get('JWT_SECRET'), {
      expiresIn: '1h',
    });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.configService.get('JWT_SECRET'));
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
