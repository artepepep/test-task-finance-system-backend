import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../shared/entities/base.entity';

@Entity({ name: 'ledger' })
export class Ledger extends BaseEntity {
  @Column({ type: 'uuid', name: 'account_id' })
  accountId: string;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  amount: string;

  @Column({ type: 'varchar', length: 3 })
  currency: string;
}
