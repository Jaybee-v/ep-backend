import { Pricing } from '../entities/pricing.entity';

export interface IPricingRepository {
  save(pricing: Pricing): Promise<Pricing>;
  findAllByUserId(userId: string): Promise<Pricing[]>;
}
