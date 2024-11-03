import { User } from '../entities/user.entity';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  patchUser(key: string, value: string | boolean, id: string): Promise<boolean>;
  getRiders(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ users: User[]; total: number; totalPages: number }>;
}
