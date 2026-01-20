import { ApiProperty } from '@nestjs/swagger';

import { Currency } from '../../shared/enums/currency.enum';
import { TransactionType } from '../enums/transaction-type.enum';

export class TransactionResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  fromAccountId: string;

  @ApiProperty({ format: 'uuid' })
  toAccountId: string;

  @ApiProperty({ example: '0.00' })
  amount: string;

  @ApiProperty({ enum: Currency })
  currency: Currency;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  createdAt: string;
}
