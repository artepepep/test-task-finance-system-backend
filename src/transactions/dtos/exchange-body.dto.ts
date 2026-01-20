import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

import { Currency } from '../../shared/enums/currency.enum';

export class ExchangeBodyDto {
  @ApiProperty({ enum: Currency, example: Currency.USD })
  @IsEnum(Currency)
  fromCurrency: Currency;

  @ApiProperty({ enum: Currency, example: Currency.EUR })
  @IsEnum(Currency)
  toCurrency: Currency;

  @ApiProperty({ example: 100.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;
}
