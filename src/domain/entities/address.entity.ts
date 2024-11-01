export class Address {
  constructor(
    private readonly id: string,
    private readonly street: string,
    private readonly zipCode: string,
    private readonly city: string,
    private readonly country: string,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
    private readonly additionalInfo?: string,
    private readonly latitude?: number,
    private readonly longitude?: number,
  ) {
    this.validateAddress();
  }

  private validateAddress(): void {
    if (!this.street) {
      throw new Error('Street is required');
    }
    if (!this.zipCode) {
      throw new Error('Zip code is required');
    }
    if (!this.city) {
      throw new Error('City is required');
    }
    if (!this.country) {
      throw new Error('Country is required');
    }
  }

  public getId(): string {
    return this.id;
  }

  public getStreet(): string {
    return this.street;
  }

  public getZipCode(): string {
    return this.zipCode;
  }

  public getCity(): string {
    return this.city;
  }

  public getCountry(): string {
    return this.country;
  }

  public getAdditionalInfo(): string | undefined {
    return this.additionalInfo;
  }

  public getLatitude(): number | undefined {
    return this.latitude;
  }

  public getLongitude(): number | undefined {
    return this.longitude;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  static create(params: {
    street: string;
    zipCode: string;
    city: string;
    country: string;
    additionalInfo?: string;
    latitude?: number;
    longitude?: number;
  }): Address {
    return new Address(
      undefined, // ID will be set by the database
      params.street,
      params.zipCode,
      params.city,
      params.country,
      new Date(),
      new Date(),
      params.additionalInfo || null,
      params.latitude || null,
      params.longitude || null,
    );
  }
}
