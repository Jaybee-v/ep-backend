import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { CreateUserCommand } from './create-user.command';
import { User, UserRole } from 'src/domain/entities/user.entity';
import {
  InvalidAddressException,
  UserAlreadyExistsException,
} from 'src/domain/exceptions/user.exceptions';
import { SendActivationEmailUsecase } from 'src/application/email/send-activation-email.usecase';
import { Address } from 'src/domain/entities/address.entity';

@Injectable()
export class CreateUserHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly sendActivationEmailUsecase: SendActivationEmailUsecase,
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
    console.log('Command reçue:', command); // Debug
    const existingUser = await this.userRepository.findByEmail(command.email);

    if (existingUser) {
      throw new UserAlreadyExistsException(command.email);
    }

    let address: Address | undefined;
    if (command.role === UserRole.STABLE) {
      if (!command.address) {
        throw new InvalidAddressException(
          'Address is required for STABLE users',
        );
      }

      address = Address.create({
        street: command.address.street,
        zipCode: command.address.zipCode,
        city: command.address.city,
        country: command.address.country,
        additionalInfo: command.address.additionalInfo,
      });
    }

    const user = User.create({
      email: command.email,
      name: command.name,
      password: command.password,
      role: command.role,
      familyName: command.familyName,
      address: address,
    });

    const savedUser = await this.userRepository.save(user);
    await this.sendActivationEmailUsecase.execute(savedUser);
    return savedUser.getId();
  }
}
