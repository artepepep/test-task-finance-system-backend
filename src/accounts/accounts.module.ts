import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';

@Module({
  providers: [AccountsService],
  controllers: [AccountsController],
  imports: [],
  exports: []
})
export class AccountsModule {}
