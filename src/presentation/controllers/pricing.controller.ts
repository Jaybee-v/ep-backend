import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePricingHandler } from 'src/application/pricing/commands/create-pricing/create-pricing.handler';
import { GetPricingsByUserIdHandler } from 'src/application/pricing/queries/get-pricings-by-user-id/get-pricings-by-user-id.handler';
import { CreatePricingDto } from '../dtos/create-pricing.dto';
import { CreatePricingCommand } from 'src/application/pricing/commands/create-pricing/create-pricing.command';
import { PricingType } from '@prisma/client';

@Controller('pricing')
export class PricingController {
  constructor(
    private readonly createPricingHandler: CreatePricingHandler,
    private readonly getPricingsByUserIdHandler: GetPricingsByUserIdHandler,
  ) {}

  @Post()
  async createPricing(@Body() body: CreatePricingDto) {
    try {
      const command = new CreatePricingCommand(
        body.userId,
        body.type,
        body.price,
        body.label,
        body.description,
      );
      const result = await this.createPricingHandler.execute(command);

      return {
        status: 201,
        message: result,
      };
    } catch (error) {
      console.log(error);
      return {
        message: error.message,
        status: error.status,
        data: null,
      };
    }
  }

  @Get('user/:userId')
  async getPricingsByUserId(userId: string) {
    try {
      const result = await this.getPricingsByUserIdHandler.execute({
        userId,
      });

      return {
        status: 200,
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        message: error.message,
        status: error.status,
        data: null,
      };
    }
  }
}
