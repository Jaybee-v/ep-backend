import { BasePriceException } from './base-prise.exception';

export class InvalidPriceException extends BasePriceException {
  constructor(message: string) {
    super(message, 404);
    this.name = 'InvalidPriceException';
  }
}

export class PricingLimitExceeded extends BasePriceException {
  constructor(message: string) {
    super(message, 400);
    this.name = 'PricingLimitExceeded';
  }
}
