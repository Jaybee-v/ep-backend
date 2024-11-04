export class InvalidCredentialsException extends Error {
  constructor() {
    super('Invalid credentials');
    this.name = 'InvalidCredentialsException';
  }
}

export class InvalidRefreshTokenException extends Error {
  constructor() {
    super('Invalid refresh token');
    this.name = 'InvalidRefreshTokenException';
  }
}
