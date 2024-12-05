import { IPricingRepository } from 'src/domain/repositories/pricing.interface';
import { PrismaService } from '../prisma/prisma.service';
import { PricingMapper } from '../mappers/pricing.mapper';
import { Pricing } from 'src/domain/entities/pricing.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PricingRepository implements IPricingRepository {
  constructor(private readonly prisma: PrismaService) {
    console.log('PrismaService dans constructor:', this.prisma);
  }

  async save(pricing: Pricing): Promise<Pricing> {
    console.log('Début findAllByUserId');
    console.log('PrismaService:', this.prisma);
    console.log(pricing);
    const data = PricingMapper.toPrisma(pricing);
    console.log(data);
    const savedPricing = await this.prisma.pricing.create({
      data,
    });
    return PricingMapper.toDomain(savedPricing);
  }

  async findAllByUserId(userId: string): Promise<Pricing[]> {
    const pricings = await this.prisma.pricing.findMany({
      where: { userId },
    });
    return pricings.map((p) => PricingMapper.toDomain(p));
  }
}
