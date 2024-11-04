import { Inject, Injectable } from '@nestjs/common';
import { IAuthPort } from 'src/domain/ports/auth.port';
import { ITokenRepository } from 'src/domain/repositories/token.repository.interface';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { RefreshTokenCommand } from './refresh-token.command';
import { UserNotFoundException } from 'src/domain/exceptions/user.exceptions';
import { InvalidRefreshTokenException } from 'src/domain/exceptions/auth.exception';

@Injectable()
export class RefreshTokenHandler {
  constructor(
    @Inject('ITokenRepository')
    private readonly tokenRepository: ITokenRepository,
    @Inject('IAuthPort')
    private readonly authPort: IAuthPort,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<{ accessToken: string }> {
    try {
      // Vérifier si le refresh token est valide
      const decoded = this.authPort.verifyToken(command.refreshToken);

      // Vérifier si le token existe en base
      const storedToken = await this.tokenRepository.findRefreshToken(
        command.refreshToken,
      );
      if (!storedToken) {
        throw new InvalidRefreshTokenException();
      }

      // Récupérer l'utilisateur
      const user = await this.userRepository.findById(decoded.sub);
      if (!user) {
        throw new UserNotFoundException();
      }

      // Générer un nouveau access token
      const accessToken = this.authPort.generateToken({
        sub: user.getId(),
        email: user.getEmail(),
        role: user.getRole(),
      });

      return { accessToken };
    } catch (error) {
      if (error instanceof InvalidRefreshTokenException) {
        throw error;
      }
      throw new InvalidRefreshTokenException();
    }
  }
}
