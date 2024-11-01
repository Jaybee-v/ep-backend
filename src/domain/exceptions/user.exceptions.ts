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
