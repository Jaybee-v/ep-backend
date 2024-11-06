import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { FindStableOrInstructorByFieldsQuery } from './find-stable-or-instructor-by-fields.query';
import { User } from '@prisma/client';
import { UserResponse } from 'src/domain/entities/user.entity';

@Injectable()
export class FindStableOrInstructorByFieldsHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: FindStableOrInstructorByFieldsQuery): Promise<{
    users: UserResponse[];
    currentPage: number;
    total: number;
    totalPages: number;
  }> {
    const result = await this.userRepository.findStableOrInstructorByField(
      {
        name: query.fields?.name,
        zipCode: query.fields?.zipCode,
      },
      query.page,
      query.limit,
    );

    return {
      ...result,
      users: result.users.map((user) => ({
        id: user.getId(),
        email: user.getEmail(),
        emailVerified: user.getEmailVerified(),
        name: user.getName(),
        familyName: user.getFamilyName(),
        role: user.getRole(),
        address: user.getAddress(),
        stableId: user.getStableId(),
        instructorId: user.getInstructorId(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
      })),
    };
  }
}
