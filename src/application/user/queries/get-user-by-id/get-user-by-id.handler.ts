import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { User } from 'src/domain/entities/user.entity';

@Injectable()
export class GetUserByIdHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<User | null> {
    return await this.userRepository.findById(query.id);
  }
}
