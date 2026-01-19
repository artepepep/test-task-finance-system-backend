import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Account } from "./accounts.entity";

@Injectable()
export class AccountsRepository {
  constructor(private readonly repository: Repository<Account>) {}
}