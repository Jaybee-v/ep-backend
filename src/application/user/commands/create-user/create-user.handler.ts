import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { CreateUserCommand } from './create-user.command';
import { User } from 'src/domain/entities/user.entity';
import { UserAlreadyExistsException } from 'src/domain/exceptions/user.exceptions';

@Injectable()
export class CreateUserHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const existingUser = await this.userRepository.findByEmail(command.email);

    if (existingUser) {
      throw new UserAlreadyExistsException(command.email);
    }

    const user = User.create({
      email: command.email,
      name: command.name,
      password: command.password,
      role: command.role,
    });

    const savedUser = await this.userRepository.save(user);

    return savedUser.getId();
  }
}
