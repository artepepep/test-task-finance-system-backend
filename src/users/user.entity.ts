import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../shared/entities/base.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({ type: 'varchar', length: 64 })
  surname: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;
}
