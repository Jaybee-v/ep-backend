import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { GetStableAndTeachersQuery } from './get-stable-and-teachers.query';
import { User } from 'src/domain/entities/user.entity';

@Injectable()
export class GetStableAndTeachersHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetStableAndTeachersQuery): Promise<{
    users: User[];
    currentPage: number;
    total: number;
    totalPages: number;
  }> {
    return await this.userRepository.getAllStableAndTeachers(
      query.page,
      query.limit,
    );
  }
}
