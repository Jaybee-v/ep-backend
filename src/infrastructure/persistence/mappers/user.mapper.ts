import { User } from 'src/domain/entities/user.entity';

export class UserMapper {
  static toDomain(raw: any): User {
    const user = new User(
      raw.id,
      raw.email,
      raw.emailVerified,
      raw.name,
      raw.familyName,
      '********',
      raw.role,
      raw.stableId,
      raw.instructorId,
      raw.createdAt,
      raw.updatedAt,
    );
    return user;
  }

  static toPrisma(user: User): any {
    return {
      email: user.getEmail(),
      emailVerified: user.getEmailVerified(),
      name: user.getName(),
      familyName: user.getFamilyName(),
      password: user.getPassword(),
      role: user.getRole(),
      stableId: user.getStableId(),
      instructorId: user.getStableId(),
    };
  }
}
