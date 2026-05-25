import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Department } from '../../../common/enums/department.enum';

export class SeedStudentItemDto {
  @ApiProperty({ example: 'Alice Johnson' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'alice@university.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: Department, example: Department.CS })
  @IsEnum(Department)
  department: Department;

  @ApiPropertyOptional({ example: 'Secure@1234', minLength: 8 })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}

export class SeedStudentsDto {
  @ApiProperty({ type: [SeedStudentItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeedStudentItemDto)
  students: SeedStudentItemDto[];
}
