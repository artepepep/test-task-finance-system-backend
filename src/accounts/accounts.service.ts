import { Injectable, NotFoundException } from '@nestjs/common';

import { AccountResponseDto } from './dtos/get-accounts-response.dto';
import { AccountsRepository } from './accounts.repository';
import { GetAccountByIdDto } from './dtos/get-account-by-id-response.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly accountRepository: AccountsRepository) {}

  async getAllAccounts(): Promise<AccountResponseDto[]> {
    const dbResults = await this.accountRepository.findAll();

    return dbResults.map((account) => ({
      id: account.id,
      userId: account.userId,
      balance: account.balance,
      currency: account.currency,
    }));
  }

  async getAccountBalanceById(searchedId: string): Promise<GetAccountByIdDto> {
    const dbAccount = await this.accountRepository.findOneById(searchedId);

    if (!dbAccount) throw new NotFoundException(`Account with id: ${searchedId} not found`)

    const { balance, id } = dbAccount;

    return { id, balance }
  }
}
