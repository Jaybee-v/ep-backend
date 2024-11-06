import { Inject, Injectable } from '@nestjs/common';
import { FullStableOrInstructor } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { GetStableOrInstructorQuery } from './get-stable-or-teacher.query';

@Injectable()
export class GetStableOrInstructorHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    query: GetStableOrInstructorQuery,
  ): Promise<FullStableOrInstructor> {
    return await this.userRepository.getStableOrInstructor(
      query.id,
      query.date,
    );
  }
}
