import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserCommand } from 'src/application/user/commands/create-user/create-user.command';
import { CreateUserHandler } from 'src/application/user/commands/create-user/create-user.handler';
import { GetUserByEmailHandler } from 'src/application/user/queries/get-user-by-email/get-user-by-email.handler';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserAlreadyExistsException } from 'src/domain/exceptions/user.exceptions';
import { User, UserRole } from 'src/domain/entities/user.entity';
import { GetUserByIdHandler } from 'src/application/user/queries/get-user-by-id/get-user-by-id.handler';
import { PatchUserHandler } from 'src/application/user/commands/patch-user/patch-user.handler';
import { GetRidersHandler } from 'src/application/user/queries/get-riders/get-riders-handler';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserHandler: CreateUserHandler,
    private readonly getUserByEmailHandler: GetUserByEmailHandler,
    private readonly getUserByIdHandler: GetUserByIdHandler,
    private readonly patchUserHandler: PatchUserHandler,
    private readonly getRidersHandler: GetRidersHandler,
  ) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; status: number; data: { id: string } }> {
    try {
      const command = new CreateUserCommand(
        createUserDto.email,
        createUserDto.password,
        createUserDto.role,
        createUserDto.name,
        createUserDto.familyName,
        createUserDto.role === UserRole.STABLE
          ? {
              street: createUserDto.address.street,
              zipCode: createUserDto.address.zipCode,
              city: createUserDto.address.city,
              country: createUserDto.address.country,
              additionalInfo: createUserDto.address.additionalInfo,
            }
          : undefined,
      );

      const userId = await this.createUserHandler.execute(command);
      return {
        message: 'User created successfully',
        status: 201,
        data: { id: userId },
      };
    } catch (error) {
      console.log('ERROR', error);
      if (error instanceof UserAlreadyExistsException) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: error.message,
          },
          HttpStatus.CONFLICT,
        );
      }
      // Pour les autres erreurs non gérées
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.getUserByIdHandler.execute({ id });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  @Get('riders/:userId')
  async getRiders(
    @Param('userId') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<{
    message: string;
    status: number;
    data: {
      users: User[];
      currentPage: number;
      total: number;
      totalPages: number;
    };
  }> {
    const result = await this.getRidersHandler.execute({ userId, page, limit });

    return {
      message: 'Riders fetched successfully',
      status: 200,
      data: result,
    };
  }

  @Patch('activate/:id')
  async activateUser(
    @Param('id') id: string,
  ): Promise<{ message: string; status: number }> {
    const result = await this.patchUserHandler.execute({
      id,
      key: 'emailVerified',
      value: true,
    });

    if (!result) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      message: 'User activated successfully',
      status: 200,
    };
  }

  @Patch(':id')
  async patchUser(
    @Param('id') id: string,
    @Body() body: { key: string; value: string | boolean },
  ): Promise<{ message: string; status: number }> {
    const result = await this.patchUserHandler.execute({
      id,
      key: body.key,
      value: body.value,
    });

    if (!result) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      message: 'User updated successfully',
      status: 200,
    };
  }
}
