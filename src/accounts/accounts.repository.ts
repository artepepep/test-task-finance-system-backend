import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Account } from './accounts.entity';

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
  ) {}

  async findAll(): Promise<Account[]> {
    const results = await this.repository.find({
      select: ['id', 'userId', 'balance', 'currency'],
    });

    return results;
  }

  async findOneById(id: string): Promise<Account | null> {
    const result = await this.repository.findOne({
      where: { id }, select: ['id', 'balance']
    });

    return result;
  } 
}
