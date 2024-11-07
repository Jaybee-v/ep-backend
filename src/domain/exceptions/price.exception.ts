export class InvalidPriceException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPriceException';
  }
}

export class PricingLimitExceeded extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PricingLimitExceeded';
  }
}
