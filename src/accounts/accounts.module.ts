import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsController } from './accounts.controller';
import { Account } from './accounts.entity';
import { AccountsService } from './accounts.service';
import { AccountsRepository } from './accounts.repository';

@Module({
  providers: [AccountsService, AccountsRepository],
  controllers: [AccountsController],
  imports: [TypeOrmModule.forFeature([Account])],
})
export class AccountsModule {}
