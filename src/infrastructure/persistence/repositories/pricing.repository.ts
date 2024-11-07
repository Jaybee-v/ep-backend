import { IPricingRepository } from 'src/domain/repositories/pricing.interface';
import { PrismaService } from '../prisma/prisma.service';
import { PricingMapper } from '../mappers/pricing.mapper';
import { Pricing } from 'src/domain/entities/pricing.entity';

export class PricingRepository implements IPricingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(pricing: Pricing): Promise<Pricing> {
    const data = PricingMapper.toPrisma(pricing);
    const savedPricing = await this.prisma.pricing.create({
      data,
    });
    return PricingMapper.toDomain(savedPricing);
  }

  async findAllByUserId(userId: string): Promise<Pricing[]> {
    const pricings = await this.prisma.pricing.findMany({
      where: { userId },
    });
    return pricings.map(PricingMapper.toDomain);
  }
}
