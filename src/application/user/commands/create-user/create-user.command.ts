import { UserRole } from 'src/domain/entities/user.entity';

export type AddressData = {
  street: string;
  zipCode: string;
  city: string;
  country: string;
  additionalInfo?: string;
};

export class CreateUserCommand {
  
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly name?: string,
    public readonly familyName?: string,
    public readonly address?: AddressData,
  ) {}
}
