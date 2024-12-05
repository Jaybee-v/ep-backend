import { Inject, Injectable } from '@nestjs/common';
import { IPricingRepository } from 'src/domain/repositories/pricing.interface';
import { CreatePricingCommand } from './create-pricing.command';
import { Pricing } from 'src/domain/entities/pricing.entity';
import { PricingLimitExceeded } from 'src/domain/exceptions/price.exception';

@Injectable()
export class CreatePricingHandler {
  constructor(
    @Inject('IPricingRepository')
    private readonly pricingRepository: IPricingRepository,
  ) {}

  async execute(command: CreatePricingCommand): Promise<string> {
    console.log('STEP 1');
    const checkPricingUser = await this.pricingRepository.findAllByUserId(
      command.userId,
    );
    console.log('STEP 2');

    if (checkPricingUser.length === 2) {
      throw new PricingLimitExceeded('Pricing limit exceeded');
    }

    const pricing = Pricing.create({
      userId: command.userId,
      type: command.type,
      price: command.price,
      label: command.label,
      description: command.description,
    });
    console.log('STEP 3');

    const savedPricing = await this.pricingRepository.save(pricing);

    return `Pricing named ${savedPricing.getLabel()} created with id ${savedPricing.getId()}`;
  }
}
