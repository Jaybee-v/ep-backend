import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'src/domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const data = UserMapper.toPrisma(user);
    const savedUser = await this.prisma.user.create({
      data: {
        email: data.email,
        emailVerified: data.emailVerified,
        password: data.password,
        role: data.role,
        name: data.name,
        familyName: data.familyName,
      },
    });
    console.log('SAVED USER', savedUser);

    return UserMapper.toDomain(savedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async patchUser(
    key: string,
    value: string | boolean,
    id: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        [key]: value,
      },
    });
  }
}
