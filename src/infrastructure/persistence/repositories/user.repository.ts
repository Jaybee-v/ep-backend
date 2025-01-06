import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetBookingByUserIdHandler } from 'src/application/booking/queries/get-booking-by-user-id/get-booking-by-user-id.handler';
import { GetDayBookingsByUserIdHandler } from 'src/application/booking/queries/get-day-bookings-by-user-id/get-day-bookings-by-user-id.handler';
import { FullStableOrInstructor, User } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { UserMapper } from '../mappers/user.mapper';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getBookingByUserIdHandler: GetBookingByUserIdHandler,
    private readonly getDayBookingsByUserIdHandler: GetDayBookingsByUserIdHandler,
  ) {}

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
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        familyName: true,
        address: true,
        instructorId: true,
        stableId: true,
        riders: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    console.log('USER BY ID', user);
    return user ? UserMapper.toDomain(user) : null;
  }

  async findStableOrInstructorByField(
    fields: { name?: string; zipCode?: string },
    page: number,
    limit: number,
  ): Promise<{
    users: User[];
    currentPage: number;
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const take = Number(limit);

    // Construction dynamique du where
    let whereClause: any = {
      OR: [{ role: 'STABLE' }, { role: 'INSTRUCTOR' }],
    };

    // Ajout des conditions de recherche si elles existent
    const searchConditions = [];

    if (fields.name) {
      searchConditions.push({
        OR: [
          {
            name: {
              contains: fields.name,
            },
          },
          {
            name: {
              contains: fields.name.toLowerCase(),
            },
          },
          {
            name: {
              contains: fields.name.toUpperCase(),
            },
          },
        ],
      });
    }

    if (fields.zipCode) {
      searchConditions.push({
        address: {
          zipCode: fields.zipCode,
        },
      });
    }

    // Si des conditions de recherche existent, les ajouter au where
    if (searchConditions.length > 0) {
      whereClause = {
        AND: [
          whereClause,
          {
            OR: searchConditions,
          },
        ],
      };
    }

    const [users, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        where: whereClause,
        skip,
        take,
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          familyName: true,
          address: true,
          instructorId: true,
          stableId: true,
          riders: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc', // Tri par date de création
        },
      }),
      this.prisma.user.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      users: users.map((user) => UserMapper.toDomain(user)),
      currentPage: page,
      total: totalCount,
      totalPages,
    };
  }

  async getStableOrInstructor(
    id: string,
    date: Date,
  ): Promise<FullStableOrInstructor> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const bookings = await this.getDayBookingsByUserIdHandler.execute({
      userId: id,
      date,
    });

    const domainUser = UserMapper.toDomain(user);
    const ridersCount = await this.countRidersByUserId(id);

    return UserMapper.toFullStableOrInstructor(
      domainUser,
      bookings,
      ridersCount,
    );
  }

  async getRidersCountByUserId(userId: string): Promise<number> {
    return this.prisma.user.count({
      where: {
        role: 'RIDER',
        OR: [
          {
            stableId: userId,
          },
          {
            instructorId: userId,
          },
        ],
      },
    });
  }

  async patchUser(
    key: string,
    value: string | boolean,
    id: string,
  ): Promise<boolean> {
    if (key === 'lastSeen') {
      const result = await this.prisma.user.update({
        where: { id },
        data: {
          lastSeen: new Date(),
          updatedAt: new Date(),
        },
      });
      return !!result;
    }

    const result = await this.prisma.user.update({
      where: { id },
      data: {
        [key]: value,
        updatedAt: new Date(),
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

  async getAllStableAndTeachers(
    page: number,
    limit: number,
  ): Promise<{
    users: User[];
    currentPage: number;
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const take = parseInt(limit.toString());

    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            role: 'STABLE',
          },
          {
            role: 'INSTRUCTOR',
          },
        ],
      },
      skip,
      take: take,
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        familyName: true,
        address: true,
        instructorId: true,
        stableId: true,
        riders: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalCount = await this.prisma.user.count({
      where: {
        OR: [
          {
            role: 'STABLE',
          },
          {
            role: 'INSTRUCTOR',
          },
        ],
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

  private countRidersByUserId(userId: string): Promise<number> {
    return this.prisma.user.count({
      where: {
        OR: [
          {
            instructorId: userId,
          },
          {
            stableId: userId,
          },
        ],
      },
    });
  }
}
