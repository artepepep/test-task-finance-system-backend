import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { User } from '../users/user.entity';
import { BaseEntity } from '../shared/entities/base.entity';
import { Currency } from '../shared/enums/currency.enum';

@Entity({ name: 'accounts' })
export class Account extends BaseEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  balance: string;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;
}
