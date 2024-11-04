export interface ITokenRepository {
  saveRefreshToken(token: string, userId: string): Promise<void>;
  findRefreshToken(token: string): Promise<string | null>;
  deleteRefreshToken(token: string): Promise<void>;
}
