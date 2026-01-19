import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Module({
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
