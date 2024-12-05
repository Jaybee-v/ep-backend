import { BaseUserException } from './base-user.exception';

export class UserAlreadyExistsException extends BaseUserException {
  constructor(email: string) {
    super(`User with email ${email} already exists`, 400);
    this.name = 'UserAlreadyExistsException';
  }
}

export class InvalidAddressException extends BaseUserException {
  constructor(message: string) {
    super(message, 400);
    this.name = 'InvalidAddressException';
  }
}

export class EmailNotVerifiedException extends BaseUserException {
  constructor() {
    super('Email not verified', 401);
    this.name = 'EmailNotVerifiedException';
  }
}

export class UserNotFoundException extends BaseUserException {
  constructor() {
    super('User not found', 404);
    this.name = 'UserNotFoundException';
  }
}
