import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class TransferResponseDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  from: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  to: string;

  @ApiProperty({ example: '100.50' })
  @IsString()
  amount: string;
}
