import { Injectable } from "@nestjs/common";
import { LedgerRepository } from "./ledger.repository";

@Injectable()
export class LedgerService {
  constructor(private readonly ledgerRepository: LedgerRepository) {}
}