export class UserAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = 'UserAlreadyExistsException';
  }
}

export class InvalidAddressException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAddressException';
  }
}

export class EmailNotVerifiedException extends Error {
  constructor() {
    super('Email not verified');
    this.name = 'EmailNotVerifiedException';
  }
}

export class UserNotFoundException extends Error {
  constructor() {
    super('User not found');
    this.name = 'UserNotFoundException';
  }
}
