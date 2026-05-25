import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class BootstrapAdminDto {
  @ApiProperty({ example: 'Super Admin' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin@university.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Secure@1234', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
