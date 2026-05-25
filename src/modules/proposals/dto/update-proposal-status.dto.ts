import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { ProposalStatus } from '../../../common/enums/proposal-status.enum';

const ALLOWED = [
  ProposalStatus.ACCEPTED,
  ProposalStatus.REJECTED,
  ProposalStatus.REVISION,
] as const;

export class UpdateProposalStatusDto {
  @ApiProperty({ enum: ALLOWED, example: ProposalStatus.REVISION })
  @IsIn(ALLOWED)
  status: ProposalStatus;

  @ApiPropertyOptional({ example: 'Please expand the literature review section.' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
