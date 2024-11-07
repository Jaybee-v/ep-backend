import { Inject, Injectable } from '@nestjs/common';
import { IPricingRepository } from 'src/domain/repositories/pricing.interface';
import { GetPricingsByUserIdQuery } from './get-pricings-by-user-id.query';
import { Pricing } from 'src/domain/entities/pricing.entity';

@Injectable()
export class GetPricingsByUserIdHandler {
  constructor(
    @Inject('IPricingRepository')
    private readonly pricingRepository: IPricingRepository,
  ) {}

  async execute(query: GetPricingsByUserIdQuery): Promise<Pricing[]> {
    const pricings = await this.pricingRepository.findAllByUserId(query.userId);
    return pricings as Pricing[];
  }
}
