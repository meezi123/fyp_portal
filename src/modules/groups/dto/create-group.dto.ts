import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGroupDto {
  @ApiPropertyOptional({ example: 'Blockchain-based academic credential verification' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  projectTitle?: string;
}
