import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Account } from '../accounts/accounts.entity';
import { BaseEntity } from '../shared/entities/base.entity';
import { Currency } from '../shared/enums/currency.enum';
import { User } from '../users/user.entity';
import { TransactionType } from './enums/transaction-type.enum';

@Entity({ name: 'transactions' })
export class Transaction extends BaseEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', name: 'account_id' })
  accountId: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  amount: string;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;
}
