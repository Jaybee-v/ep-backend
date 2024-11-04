import { Inject, Injectable } from '@nestjs/common';
import { ITokenRepository } from 'src/domain/repositories/token.repository.interface';

@Injectable()
export class RevokeTokenHandler {
  constructor(
    @Inject('ITokenRepository')
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    await this.tokenRepository.deleteRefreshToken(refreshToken);
  }
}
