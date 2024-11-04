import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { GetRidersQuery } from './get-riders.query';

@Injectable()
export class GetRidersHandler {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    query: GetRidersQuery,
  ): Promise<{
    users: User[];
    currentPage: number;
    total: number;
    totalPages: number;
  }> {
    return await this.userRepository.getRiders(
      query.userId,
      query.page,
      query.limit,
    );
  }
}
