import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { User } from './user.entity';

@Module({
  providers: [UsersService],
  exports: [],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
