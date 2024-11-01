import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { UserRole } from 'src/domain/entities/user.entity';
import { CreateAddressDto } from './create-address.dto';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  familyName?: string;

  @IsString()
  @IsNotEmpty()
  role: UserRole;

  @ValidateIf((o) => o.role === UserRole.STABLE)
  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsNotEmpty({ message: 'Address is required for stable users' })
  address?: CreateAddressDto;
}
