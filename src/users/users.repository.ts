import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository {
  constructor() {}

  async findOneByEmail() {}

  async findOneById() {}
}