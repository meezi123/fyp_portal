import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from '../../entities/proposal.entity';
import { GroupMember } from '../../entities/group-member.entity';
import { User } from '../../entities/user.entity';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal, GroupMember, User])],
  providers: [ProposalsService],
  controllers: [ProposalsController],
})
export class ProposalsModule {}
