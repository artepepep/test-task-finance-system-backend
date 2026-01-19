import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ minLength: 2, maxLength: 64, example: 'Alex' })
  @IsString()
  @Length(2, 64)
  name: string;

  @ApiProperty({ minLength: 2, maxLength: 64, example: 'Smith' })
  @IsString()
  @Length(2, 64)
  surname: string;

  @ApiProperty({ minLength: 5, maxLength: 255, example: 'user@example.com' })
  @IsEmail()
  @Length(5, 255)
  email: string;

  @ApiProperty({ minLength: 8, example: 'StrongP@ssw0rd' })
  @IsString()
  @MinLength(8)
  password: string;
}
