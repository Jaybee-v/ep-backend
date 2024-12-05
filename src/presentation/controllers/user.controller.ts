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
  UseFilters,
} from '@nestjs/common';
import { CreateUserCommand } from 'src/application/user/commands/create-user/create-user.command';
import { CreateUserHandler } from 'src/application/user/commands/create-user/create-user.handler';
import { GetUserByEmailHandler } from 'src/application/user/queries/get-user-by-email/get-user-by-email.handler';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserAlreadyExistsException } from 'src/domain/exceptions/user/user.exceptions';
import { User, UserRole } from 'src/domain/entities/user.entity';
import { GetUserByIdHandler } from 'src/application/user/queries/get-user-by-id/get-user-by-id.handler';
import { PatchUserHandler } from 'src/application/user/commands/patch-user/patch-user.handler';
import { GetRidersHandler } from 'src/application/user/queries/get-riders/get-riders-handler';
import { GetStableAndTeachersHandler } from 'src/application/user/queries/get-stable-and-teachers/get-stable-and-teachers.handler';
import { GetStableOrInstructorHandler } from 'src/application/user/queries/get-stable-or-teacher/get-stable-or-teacher.handler';
import { FindStableOrInstructorByFieldsHandler } from 'src/application/user/queries/find-stable-or-instructor-by-fields/find-stable-or-instructor-by-fields.handler';
import { BaseUserException } from 'src/domain/exceptions/user/base-user.exception';
import { UserExceptionFilter } from '../filters/user-exception.filter';

@Controller('users')
@UseFilters(UserExceptionFilter)
export class UserController {
  constructor(
    private readonly createUserHandler: CreateUserHandler,
    private readonly getUserByEmailHandler: GetUserByEmailHandler,
    private readonly getUserByIdHandler: GetUserByIdHandler,
    private readonly patchUserHandler: PatchUserHandler,
    private readonly getRidersHandler: GetRidersHandler,
    private readonly getStableAndTeachersHandler: GetStableAndTeachersHandler,
    private readonly getStableOrInstructorHandler: GetStableOrInstructorHandler,
    private readonly findStableOrInstructorByFieldsHandler: FindStableOrInstructorByFieldsHandler,
  ) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; status: number; data: { id: string } }> {
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
  }

  @Get(':id')
  async getUserById(
    @Param('id') id: string,
  ): Promise<{ status: number; data: User }> {
    const user = await this.getUserByIdHandler.execute({ id });

    return {
      status: 200,
      data: user,
    };
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
    console.log('RESULT', result);
    return {
      message: 'Riders fetched successfully',
      status: 200,
      data: result,
    };
  }

  @Get('search/stable-or-instructor')
  async findStableOrInstructorByFields(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name: string,
    @Query('zipCode') zipCode: string,
  ) {
    const result = await this.findStableOrInstructorByFieldsHandler.execute({
      fields: { name, zipCode },
      page,
      limit,
    });
    return {
      message: 'Stable or instructor fetched successfully',
      status: 200,
      data: result,
    };
  }

  @Get('find/stable-or-instructor')
  async getStableAndTeachers(
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
    console.log('on Est la ');
    const result = await this.getStableAndTeachersHandler.execute({
      page,
      limit,
    });
    console.log('RESULT', result);
    return {
      message: 'Stable and teachers fetched successfully',
      status: 200,
      data: result,
    };
  }

  @Get('stable-or-instructor/:id')
  async getStableOrInstructor(
    @Param('id') id: string,
    @Query('date') date: string,
  ) {
    try {
      const result = await this.getStableOrInstructorHandler.execute({
        id,
        date: new Date(date),
      });

      return {
        message: 'Stable or instructor fetched successfully',
        status: 200,
        data: result,
      };
    } catch (error) {
      console.log('ERROR', error);
    }
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
    console.log(body);

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
