import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserCommand } from 'src/application/user/commands/create-user/create-user.command';
import { CreateUserHandler } from 'src/application/user/commands/create-user/create-user.handler';
import { GetUserByEmailHandler } from 'src/application/user/queries/get-user-by-email/get-user-by-email.handler';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserAlreadyExistsException } from 'src/domain/exceptions/user.exceptions';
import { User } from 'src/domain/entities/user.entity';
import { GetUserByIdHandler } from 'src/application/user/queries/get-user-by-id/get-user-by-id.handler';
import { PatchUserHandler } from 'src/application/user/commands/patch-user/patch-user.handler';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserHandler: CreateUserHandler,
    private readonly getUserByEmailHandler: GetUserByEmailHandler,
    private readonly getUserByIdHandler: GetUserByIdHandler,
    private readonly patchUserHandler: PatchUserHandler,
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

  @Patch(':id')
  async patchUser(
    @Param('id') id: string,
    @Body() body: { key: string; value: string | boolean },
  ): Promise<void> {
    await this.patchUserHandler.execute({
      id,
      key: body.key,
      value: body.value,
    });
  }
}
