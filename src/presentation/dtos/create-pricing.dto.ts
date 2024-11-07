import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PricingType } from 'src/domain/entities/pricing.entity';

export class CreatePricingDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: PricingType;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
