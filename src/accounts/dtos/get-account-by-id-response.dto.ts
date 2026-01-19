import { ApiProperty } from "@nestjs/swagger";

export class GetAccountByIdDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: '0.00' })
  balance: string;
}