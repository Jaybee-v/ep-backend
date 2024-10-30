import { User } from 'src/domain/entities/user.entity';

export class UserMapper {
  static toDomain(raw: any): User {
    const user = new User(
      raw.id,
      raw.email,
      raw.name,
      '********',
      raw.role,
      raw.createdAt,
      raw.updatedAt,
    );
    return user;
  }

  static toPrisma(user: User): any {
    return {
      email: user.getEmail(),
      name: user.getName(),
      password: user.getPassword(),
      role: user.getRole(),
    };
  }
}
