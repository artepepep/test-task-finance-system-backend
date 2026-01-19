import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Transaction } from "./transaction.entity";

@Injectable()
export class TransactionRepository {
  constructor(private readonly repository: Repository<Transaction>) {}
}