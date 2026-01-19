import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ledger } from './ledger.entity';
import { LedgerRepository } from './ledger.repository';
import { LedgerService } from './ledger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ledger])],
  providers: [LedgerService, LedgerRepository],
  exports: [],
})
export class LedgerModule {}
