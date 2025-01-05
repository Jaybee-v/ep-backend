import { Address } from 'src/domain/entities/address.entity';
import { Booking } from 'src/domain/entities/booking.entity';
import {
  FullStableOrInstructor,
  User,
  UserRole,
} from 'src/domain/entities/user.entity';

export class UserMapper {
  static toDomain(raw: any): User {
    const address = raw.address
      ? new Address(
          raw.address.id,
          raw.address.street,
          raw.address.zipCode,
          raw.address.city,
          raw.address.country,
          raw.address.additionalInfo,
          raw.address.latitude,
          raw.address.longitude,
        ) // On utilise un skipValidation ici aussi
      : null;

    let user: User;
    if (raw.role === UserRole.STABLE) {
      user = new User(
        raw.id,
        raw.email,
        raw.emailVerified,
        raw.name,
        raw.familyName,
        raw.password,
        raw.role,
        address,
        raw.stableId,
        raw.instructorId,
        raw.createdAt,
        raw.updatedAt,
<<<<<<< HEAD
=======
        raw.lastSeen,
>>>>>>> feat/home-controller
      );
    } else {
      user = new User(
        raw.id,
        raw.email,
        raw.emailVerified,
        raw.name,
        raw.familyName,
        raw.password,
        raw.role,
        null,
        raw.stableId,
        raw.instructorId,
        raw.createdAt,
        raw.updatedAt,
<<<<<<< HEAD
=======
        raw.lastSeen,
>>>>>>> feat/home-controller
      );
    }
    return user;
  }

  static toPrisma(user: User): any {
    const data = {
      email: user.getEmail(),
      emailVerified: user.getEmailVerified(),
      name: user.getName(),
      familyName: user.getFamilyName(),
      password: user.getPassword(),
      role: user.getRole(),
      stableId: user.getStableId(),
      instructorId: user.getStableId(),
    };

    const address = user.getAddress();

    if (user.getRole() === UserRole.STABLE && address) {
      return {
        ...data,
        address: {
          create: {
            street: address.getStreet(),
            zipCode: address.getZipCode(),
            city: address.getCity(),
            country: address.getCountry(),
            additionalInfo: address.getAdditionalInfo(),
            latitude: address.getLatitude(),
            longitude: address.getLongitude(),
          },
        },
      };
    }

    return data;
  }

  static toFullStableOrInstructor(
    userFound: User,
    bookings: Booking[],
    ridersCount: number,
  ): FullStableOrInstructor {
    const user: FullStableOrInstructor = {
      id: userFound.getId(),
      email: userFound.getEmail(),
      emailVerified: userFound.getEmailVerified(),
      name: userFound.getName(),
      familyName: userFound.getFamilyName(),
      role: userFound.getRole(),
      address: userFound.getAddress(),
      ridersCount,
      bookings,
      createdAt: userFound.getCreatedAt(),
      updatedAt: userFound.getUpdatedAt(),
<<<<<<< HEAD
=======
      lastSeen: userFound.getLastSeen(),
>>>>>>> feat/home-controller
    };

    return user;
  }
}
