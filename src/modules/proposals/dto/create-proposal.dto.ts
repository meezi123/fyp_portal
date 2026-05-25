import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, MinLength } from 'class-validator';

export class CreateProposalDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  groupId: string;

  @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' })
  @IsUUID()
  supervisorId: string;

  @ApiProperty({
    example:
      'This project proposes a decentralized credential verification system using Hyperledger Fabric.',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  abstract: string;
}
