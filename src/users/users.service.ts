import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { Account } from '../accounts/accounts.entity';
import { Currency } from '../shared/enums/currency.enum';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneByEmail(email);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository.findOneByEmailWithPassword(email);
  }

  async setRefreshTokenHash(
    userId: string,
    hash: string | null,
  ): Promise<void> {
    await this.usersRepository.update(userId, { refreshTokenHash: hash });
  }

  async createWithAccounts(
    manager: EntityManager,
    data: Pick<User, 'email' | 'name' | 'surname' | 'password'>,
    accounts: Array<{ currency: Currency; balance: string }>,
  ): Promise<User> {
    const usersRepo = manager.getRepository(User);
    const accountsRepo = manager.getRepository(Account);
    const createdUser = usersRepo.create(data);
    const savedUser = await usersRepo.save(createdUser);

    const createdAccounts = accountsRepo.create(
      accounts.map((account) => ({
        userId: savedUser.id,
        currency: account.currency,
        balance: account.balance,
      })),
    );
    await accountsRepo.save(createdAccounts);

    return savedUser;
  }
}
