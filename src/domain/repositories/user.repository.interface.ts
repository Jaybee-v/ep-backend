import { FullStableOrInstructor, User } from '../entities/user.entity';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  patchUser(key: string, value: string | boolean, id: string): Promise<boolean>;
  getRiders(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    users: User[];
    currentPage: number;
    total: number;
    totalPages: number;
  }>;
  getAllStableAndTeachers(
    page: number,
    limit: number,
  ): Promise<{
    users: User[];
    currentPage: number;
    total: number;
    totalPages: number;
  }>;
  findStableOrInstructorByField(
    fields: { name?: string; zipCode?: string },
    page: number,
    limit: number,
  ): Promise<{
    users: User[];
    currentPage: number;
    total: number;
    totalPages: number;
  }>;
  getStableOrInstructor(
    id: string,
    date: Date,
  ): Promise<FullStableOrInstructor>;
<<<<<<< HEAD
=======
  getRidersCountByUserId(userId: string): Promise<number>;
>>>>>>> feat/home-controller
}
