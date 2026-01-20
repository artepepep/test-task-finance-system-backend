import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DataSource } from 'typeorm';

import { Account } from '../accounts/accounts.entity';
import { Ledger } from '../ledger/ledger.entity';
import { DOLLAR_EXCHANGE_RATE } from '../shared/constants/exchange-rate';
import { Currency } from '../shared/enums/currency.enum';
import { ExchangeBodyDto } from './dtos/exchange-body.dto';
import { TransactionsPaginatedQuery } from './dtos/transactions-paginated-query.dto';
import { TransferBodyDto } from './dtos/transfer-body.dto';
import { TransferResponseDto } from './dtos/transfer-response.dto';
import { TransactionType } from './enums/transaction-type.enum';
import { Transaction } from './transaction.entity';
import { TransactionRepository } from './transaction.repository';
import { Transaction as TransactionReturn } from './types/transaction.type';

@Injectable()
export class TransactionService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async getPaginated(
    data: TransactionsPaginatedQuery,
  ): Promise<TransactionReturn[]> {
    const page = Math.max(1, Number(data.page ?? 1));
    const limit = Math.max(1, Number(data.limit ?? 10));
    const skip = (page - 1) * limit;

    const transactions = await this.transactionRepository.find({
      where: { type: data.type },
      take: limit,
      skip,
      order: { createdAt: 'DESC' },
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      createdAt: transaction.createdAt.toISOString(),
      amount: transaction.amount,
      currency: transaction.currency,
      type: transaction.type,
      fromAccountId: transaction.fromAccountId,
      toAccountId: transaction.toAccountId,
    }));
  }

  async transfer(data: TransferBodyDto): Promise<TransferResponseDto> {
    const transactionInfo = await this.dataSource.transaction(
      async (manager) => {
        const ledgerRepo = manager.getRepository(Ledger);
        const transactionRepo = manager.getRepository(Transaction);
        const accountRepo = manager.getRepository(Account);

        const accountFrom = await accountRepo.findOne({
          where: { id: data.from },
          lock: { mode: 'pessimistic_write' },
        });
        const accountTo = await accountRepo.findOne({
          where: { id: data.to },
          lock: { mode: 'pessimistic_write' },
        });
        if (!accountFrom || !accountTo) {
          throw new NotFoundException('Account not found');
        }
        if (accountFrom.id === accountTo.id) {
          throw new BadRequestException('Accounts must be different');
        }
        if (accountFrom.currency !== accountTo.currency) {
          throw new BadRequestException('Accounts must use the same currency');
        }
        if (Number(accountFrom.balance) < data.amount) {
          throw new BadRequestException(
            'There are insufficient funds in the account balance',
          );
        }

        const ledgerEntityFrom = ledgerRepo.create({
          amount: String(-data.amount),
          accountId: data.from,
        });
        const ledgerFrom = await ledgerRepo.save(ledgerEntityFrom);

        const ledgerEntityTo = ledgerRepo.create({
          amount: String(data.amount),
          accountId: data.to,
        });
        const ledgerTo = await ledgerRepo.save(ledgerEntityTo);

        await accountRepo.increment({ id: data.to }, 'balance', data.amount);
        await accountRepo.decrement({ id: data.from }, 'balance', data.amount);

        const transactionEntity = transactionRepo.create({
          fromAccountId: data.from,
          toAccountId: data.to,
          amount: String(data.amount),
          currency: accountFrom.currency,
          type: TransactionType.TRANSFER,
        });

        const transaction = await transactionRepo.save(transactionEntity);

        return {
          from: ledgerFrom.accountId,
          to: ledgerTo.accountId,
          amount: transaction.amount,
        };
      },
    );

    return transactionInfo;
  }

  async exchange(
    data: ExchangeBodyDto,
    userId: string,
  ): Promise<TransferResponseDto> {
    const transactionInfo = await this.dataSource.transaction(
      async (manager) => {
        const accountRepo = manager.getRepository(Account);
        const ledgerRepo = manager.getRepository(Ledger);
        const transactionRepo = manager.getRepository(Transaction);

        const accountFrom = await accountRepo.findOne({
          where: { currency: data.fromCurrency, userId },
          lock: { mode: 'pessimistic_write' },
        });
        const accountTo = await accountRepo.findOne({
          where: { currency: data.toCurrency, userId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!accountFrom || !accountTo) {
          throw new NotFoundException('Account not found');
        }
        if (accountFrom.id === accountTo.id) {
          throw new BadRequestException('Accounts must be different');
        }
        if (Number(accountFrom.balance) < data.amount) {
          throw new BadRequestException(
            'There are insufficient funds in the account balance',
          );
        }

        const ledgerEntityFrom = ledgerRepo.create({
          amount: String(-data.amount),
          accountId: accountFrom.id,
        });
        const ledgerFrom = await ledgerRepo.save(ledgerEntityFrom);

        let convertedAmount = data.amount;
        if (data.fromCurrency === data.toCurrency) {
          throw new BadRequestException('Currencies must be different');
        }
        if (
          data.fromCurrency === Currency.EUR &&
          data.toCurrency === Currency.USD
        ) {
          convertedAmount = data.amount / DOLLAR_EXCHANGE_RATE.EUR;
        }
        if (
          data.fromCurrency === Currency.USD &&
          data.toCurrency === Currency.EUR
        ) {
          convertedAmount = data.amount * DOLLAR_EXCHANGE_RATE.EUR;
        }

        const ledgerEntityTo = ledgerRepo.create({
          amount: String(convertedAmount),
          accountId: accountTo.id,
        });
        const ledgerTo = await ledgerRepo.save(ledgerEntityTo);

        await accountRepo.increment(
          { id: accountTo.id },
          'balance',
          convertedAmount,
        );
        await accountRepo.decrement(
          { id: accountFrom.id },
          'balance',
          data.amount,
        );

        const transactionEntity = transactionRepo.create({
          fromAccountId: accountFrom.id,
          toAccountId: accountTo.id,
          amount: String(data.amount),
          currency: accountFrom.currency,
          type: TransactionType.EXCHANGE,
        });
        const transaction = await transactionRepo.save(transactionEntity);

        return {
          from: ledgerFrom.accountId,
          to: ledgerTo.accountId,
          amount: transaction.amount,
        };
      },
    );

    return transactionInfo;
  }
}
