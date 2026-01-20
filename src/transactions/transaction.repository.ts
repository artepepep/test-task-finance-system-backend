import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {}

  create(data: Partial<Transaction>): Transaction {
    return this.repository.create(data);
  }

  async save(data: Transaction): Promise<Transaction> {
    return this.repository.save(data);
  }

  async find(
    options?: Parameters<Repository<Transaction>['find']>[0],
  ): Promise<Transaction[]> {
    return this.repository.find(options);
  }
}
