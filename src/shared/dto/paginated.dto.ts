import { IsNumber, IsOptional } from 'class-validator';

export class Paginated {
  @IsNumber()
  @IsOptional()
  page?: number | null;

  @IsNumber()
  @IsOptional()
  limit?: number | null;
}
