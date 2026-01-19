import { ApiProperty } from '@nestjs/swagger';

import { Currency } from '../../shared/enums/currency.enum';

export class AccountResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  userId: string;

  @ApiProperty({ example: '0.00' })
  balance: string;

  @ApiProperty({ enum: Currency, example: Currency.USD })
  currency: Currency;
}
