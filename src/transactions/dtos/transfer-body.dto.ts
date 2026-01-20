import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

import { NotEqualTo } from '../../shared/validators/not-equal-to.validator';

export class TransferBodyDto {
  @ApiProperty({ example: 100.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  from: string;

  @ApiProperty({ format: 'uuid' })
  @NotEqualTo('from', { message: '"to" must not equal "from"' })
  @IsUUID()
  to: string;
}
