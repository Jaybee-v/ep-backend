import { BaseAuthException } from './base-auth.exception';

export class InvalidCredentialsException extends BaseAuthException {
  constructor() {
    super('Invalid credentials', 401);
    this.name = 'InvalidCredentialsException';
  }
}

export class InvalidRefreshTokenException extends BaseAuthException {
  constructor() {
    super('Invalid refresh token', 401);
    this.name = 'InvalidRefreshTokenException';
  }
}
