import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposal } from '../../entities/proposal.entity';
import { GroupMember } from '../../entities/group-member.entity';
import { User } from '../../entities/user.entity';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalStatusDto } from './dto/update-proposal-status.dto';
import { RequestUser } from '../../common/interfaces/request-user.interface';
import { UserRole } from '../../common/enums/user-role.enum';
import { ProposalStatus } from '../../common/enums/proposal-status.enum';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private proposalRepo: Repository<Proposal>,
    @InjectRepository(GroupMember)
    private memberRepo: Repository<GroupMember>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async submit(dto: CreateProposalDto, requester: RequestUser): Promise<Proposal> {
    const membership = await this.memberRepo.findOne({
      where: { groupId: dto.groupId, userId: requester.id },
    });
    if (!membership) throw new ForbiddenException('You are not a member of this group');

    const supervisor = await this.userRepo.findOne({ where: { id: dto.supervisorId } });
    if (!supervisor || supervisor.role !== UserRole.SUPERVISOR) {
      throw new NotFoundException('Supervisor not found');
    }

    return this.proposalRepo.save(
      this.proposalRepo.create({
        groupId: dto.groupId,
        supervisorId: dto.supervisorId,
        abstract: dto.abstract,
      }),
    );
  }

  findIncoming(supervisor: RequestUser): Promise<Proposal[]> {
    return this.proposalRepo.find({
      where: { supervisorId: supervisor.id, status: ProposalStatus.PENDING },
      relations: { group: { members: { user: true } } },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    id: string,
    dto: UpdateProposalStatusDto,
    supervisor: RequestUser,
  ): Promise<Proposal> {
    const proposal = await this.proposalRepo.findOne({ where: { id } });
    if (!proposal) throw new NotFoundException('Proposal not found');
    if (proposal.supervisorId !== supervisor.id) {
      throw new ForbiddenException('You are not the assigned supervisor for this proposal');
    }

    proposal.status = dto.status;
    proposal.remarks = dto.remarks ?? null;
    return this.proposalRepo.save(proposal);
  }
}
