import { Injectable } from '@nestjs/common';
import { ITokenRepository } from 'src/domain/repositories/token.repository.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TokenRepository implements ITokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expire dans 7 jours

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async findRefreshToken(token: string): Promise<string | null> {
    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date(), // Token non expiré
        },
      },
    });

    return refreshToken?.token || null;
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { token },
    });
  }

  async deleteAllUserRefreshTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
