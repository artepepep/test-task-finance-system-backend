import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionController } from './transaction.controller';
import { Transaction } from './transaction.entity';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';

@Module({
  providers: [TransactionService, TransactionRepository],
  imports: [TypeOrmModule.forFeature([Transaction])],
  exports: [TypeOrmModule],
  controllers: [TransactionController],
})
export class TransactionsModule {}
