import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/domain/entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  familyName?: string;

  @IsString()
  role: UserRole;
}
