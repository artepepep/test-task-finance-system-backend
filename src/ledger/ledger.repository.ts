import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ledger } from './ledger.entity';

@Injectable()
export class LedgerRepository {
  constructor(
    @InjectRepository(Ledger)
    private readonly repository: Repository<Ledger>,
  ) {}

  get repo(): Repository<Ledger> {
    return this.repository;
  }
}
