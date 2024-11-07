import { InvalidPriceException } from '../exceptions/price.exception';

export enum PricingType {
  FREE = 'FREE',
  CUSTOM = 'CUSTOM',
}

export class Pricing {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly type: PricingType,
    private readonly price: number,
    private readonly label: string,
    private readonly description: string | null,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {
    this.validatePricing();
  }

  private validatePricing() {
    if (this.price <= 0) {
      throw new InvalidPriceException('Price cannot be 0 or negative');
    }
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getType(): PricingType {
    return this.type;
  }

  public getPrice(): number {
    return this.price;
  }

  public getLabel(): string {
    return this.label;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  static create(params: {
    userId: string;
    type: PricingType;
    price: number;
    label: string;
    description: string | null;
  }): Pricing {
    return new Pricing(
      undefined,
      params.userId,
      params.type,
      params.price,
      params.label,
      params.description,
      new Date(),
      new Date(),
    );
  }
}
