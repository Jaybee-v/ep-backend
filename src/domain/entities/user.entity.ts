export enum UserRole {
  STABLE = 'STABLE',
  RIDER = 'RIDER',
  INSTRUCTOR = 'INSTRUCTOR',
}

export class User {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly emailVerified: boolean,
    private readonly name: string | null,
    private readonly familyName: string | null,
    private readonly password: string,
    private readonly role: UserRole,
    private readonly stableId: string | null,
    private readonly instructorId: string | null,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {
    this.validateEmail(email);
    this.validateRole();
  }

  private validateRole(): void {
    if (this.role === UserRole.RIDER) {
      return;
    }
    if (this.stableId !== null || this.instructorId !== null) {
      throw new Error('Only riders can have a stable or instructor id');
    }
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getEmailVerified(): boolean {
    return this.emailVerified;
  }

  public getName(): string | null {
    return this.name;
  }

  public getFamilyName(): string | null {
    return this.familyName;
  }

  public getPassword(): string {
    return this.password;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getStableId(): string | null {
    return this.stableId;
  }

  public getInstructorId(): string | null {
    return this.instructorId;
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  static create(params: {
    email: string;
    emailVerified?: boolean;
    name?: string;
    familyName?: string;
    password: string;
    role: UserRole;
    stableId?: string;
    instructorId?: string;
  }): User {
    if (params.role === UserRole.RIDER) {
      return new User(
        undefined, // ID will be set by the database
        params.email,
        params.emailVerified || false,
        params.name || null,
        params.familyName || null,
        params.password,
        params.role,
        params.stableId || null,
        params.instructorId || null,
        new Date(),
        new Date(),
      );
    }
    return new User(
      undefined, // ID will be set by the database
      params.email,
      params.emailVerified || false,
      params.name || null,
      params.familyName || null,
      params.password,
      params.role,
      null,
      null,
      new Date(),
      new Date(),
    );
  }
}
