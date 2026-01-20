import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findOneByEmailWithPassword(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'surname', 'password', 'refreshTokenHash'],
    });
  }

  async update(userId: string, data: Partial<User>): Promise<void> {
    await this.repository.update({ id: userId }, data);
  }
}
