import { Pricing } from 'src/domain/entities/pricing.entity';

export class PricingMapper {
  static toDomain(raw: any): Pricing {
    const pricing = new Pricing(
      raw.id,
      raw.userId,
      raw.type,
      raw.price,
      raw.label,
      raw.description || null,
      raw.createdAt,
      raw.updatedAt,
    );

    return pricing;
  }

  static toPrisma(pricing: Pricing): any {
    return {
      userId: pricing.getUserId(),
      type: pricing.getType(),
      price: pricing.getPrice(),
      label: pricing.getLabel(),
      description: pricing.getDescription(),
    };
  }
}
