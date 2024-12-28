import { Inject, Injectable } from '@nestjs/common';
import { IAuthPort } from 'src/domain/ports/auth.port';
import { ITokenRepository } from 'src/domain/repositories/token.repository.interface';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { LoginCommand } from './login.command';
import { InvalidCredentialsException } from 'src/domain/exceptions/auth/auth.exception';
import { EmailNotVerifiedException } from 'src/domain/exceptions/user/user.exceptions';

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class LoginHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IAuthPort')
    private readonly authPort: IAuthPort,
    @Inject('ITokenRepository')
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(command: LoginCommand): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(command.email);
    console.log('User:', user); // Debug

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isValidPassword = await this.authPort.comparePassword(
      command.password,
      user.getPassword(),
    );

    if (!isValidPassword) {
      throw new InvalidCredentialsException();
    }

    if (!user.getEmailVerified()) {
      throw new EmailNotVerifiedException();
    }

    const accessToken = this.authPort.generateToken({
      id: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
    });

    const refreshToken = this.authPort.generateToken({
      userId: user.getId(),
      type: 'refresh',
    });

    await this.tokenRepository.saveRefreshToken(user.getId(), refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.getId(),
        email: user.getEmail(),
        role: user.getRole(),
      },
    };
  }
}
