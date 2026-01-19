import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersRepository {
  constructor(private readonly repository: Repository<User>) {}

  async findOneByEmail() {}

  async findOneById() {}
}