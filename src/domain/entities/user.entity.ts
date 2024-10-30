export class User {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly name: string | null,
    private readonly password: string,
    private readonly role: string,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {
    this.validateEmail(email);
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getName(): string | null {
    return this.name;
  }

  public getPassword(): string {
    return this.password;
  }

  public getRole(): string {
    return this.role;
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  static create(params: {
    email: string;
    name?: string;
    password: string;
    role: string;
  }): User {
    return new User(
      undefined, // ID will be set by the database
      params.email,
      params.name || null,
      params.password,
      params.role,
      new Date(),
      new Date(),
    );
  }
}
