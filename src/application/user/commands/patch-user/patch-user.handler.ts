import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { PatchUserCommand } from './patch-user.command';

@Injectable()
export class PatchUserHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: PatchUserCommand): Promise<void> {
    await this.userRepository.patchUser(command.key, command.value, command.id);
  }
}
