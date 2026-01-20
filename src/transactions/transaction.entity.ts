import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Account } from '../accounts/accounts.entity';
import { BaseEntity } from '../shared/entities/base.entity';
import { Currency } from '../shared/enums/currency.enum';
import { TransactionType } from './enums/transaction-type.enum';

@Entity({ name: 'transactions' })
export class Transaction extends BaseEntity {
  @Column({ type: 'uuid', name: 'from_account_id' })
  fromAccountId: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'from_account_id' })
  fromAccount: Account;

  @Column({ type: 'uuid', name: 'to_account_id' })
  toAccountId: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'to_account_id' })
  toAccount: Account;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  amount: string;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;
}
