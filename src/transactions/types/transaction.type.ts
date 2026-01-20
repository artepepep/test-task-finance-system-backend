import { Currency } from 'src/shared/enums/currency.enum';

import { TransactionType } from '../enums/transaction-type.enum';

export type Transaction = {
  id: string;
  createdAt: string;
  amount: string;
  currency: Currency;
  type: TransactionType;
  fromAccountId: string;
  toAccountId: string;
};
