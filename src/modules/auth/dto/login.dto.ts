import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'alice@university.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Secure@1234', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
