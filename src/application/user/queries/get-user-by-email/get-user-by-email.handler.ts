import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { GetUserByEmailQuery } from './get-user-by-email.query';

@Injectable()
export class GetUserByEmailHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserByEmailQuery): Promise<User | null> {
    return await this.userRepository.findByEmail(query.email);
  }
}
