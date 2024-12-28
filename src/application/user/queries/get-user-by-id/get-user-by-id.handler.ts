import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { User } from 'src/domain/entities/user.entity';
import { UserNotFoundException } from 'src/domain/exceptions/user/user.exceptions';

@Injectable()
export class GetUserByIdHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<User | null> {
    const user = await this.userRepository.findById(query.id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
