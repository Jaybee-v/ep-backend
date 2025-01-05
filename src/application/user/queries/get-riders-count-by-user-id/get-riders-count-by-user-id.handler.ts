import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { GetRidersCountByUserIdQuery } from './get-riders-count-by-user-id.query';

@Injectable()
export class GetRidersCountByUserIdHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetRidersCountByUserIdQuery): Promise<number> {
    return this.userRepository.getRidersCountByUserId(query.userId);
  }
}
