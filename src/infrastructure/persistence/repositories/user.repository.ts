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
      data,
      include: {
        address: true,
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
  ): Promise<boolean> {
    const result = await this.prisma.user.update({
      where: { id },
      data: {
        [key]: value,
      },
    });

    return !!result;
  }

  async getRiders(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    users: User[];
    currentPage: number;
    total: number;
    totalPages: number;
  }> {
    const user = await this.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.getRole() === 'RIDER') {
      throw new HttpException(
        'Only instructors and stables can get riders',
        HttpStatus.FORBIDDEN,
      );
    }

    const skip = (page - 1) * limit;
    const take = parseInt(limit.toString());

    if (user.getRole() === 'INSTRUCTOR') {
      const users = await this.prisma.user.findMany({
        where: { instructorId: userId },
        skip,
        take: take,
      });
      const totalCount = await this.prisma.user.count({
        where: {
          instructorId: userId,
          // Mêmes filtres que ci-dessus
        },
      });
      const totalPages = Math.ceil(totalCount / limit);

      return {
        users: users.map((user) => UserMapper.toDomain(user)),
        currentPage: page,
        total: totalCount,
        totalPages,
      };
    }

    if (user.getRole() === 'STABLE') {
      const users = await this.prisma.user.findMany({
        where: { stableId: userId },
        skip,
        take: take,
      });
      const totalCount = await this.prisma.user.count({
        where: {
          stableId: userId,
          // Mêmes filtres que ci-dessus
        },
      });
      const totalPages = Math.ceil(totalCount / limit);
      return {
        users: users.map((user) => UserMapper.toDomain(user)),
        currentPage: page,
        total: totalCount,
        totalPages,
      };
    }
  }
}
