import { PricingType } from 'src/domain/entities/pricing.entity';

export class CreatePricingCommand {
  constructor(
    public readonly userId: string,
    public readonly type: PricingType,
    public readonly price: number,
    public readonly label: string,
    public readonly description: string,
  ) {}
}
