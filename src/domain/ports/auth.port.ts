export interface IAuthPort {
  generateToken(payload: any): string;
  verifyToken(token: string): any;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}