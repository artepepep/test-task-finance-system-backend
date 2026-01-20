import { IsEnum } from 'class-validator';
import { Paginated } from 'src/shared/dto/paginated.dto';

import { TransactionType } from '../enums/transaction-type.enum';

export class TransactionsPaginatedQuery extends Paginated {
  @IsEnum(TransactionType)
  type: TransactionType;
}
