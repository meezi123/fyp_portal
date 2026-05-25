import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../../entities/group.entity';
import { GroupMember } from '../../entities/group-member.entity';
import { User } from '../../entities/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { RequestUser } from '../../common/interfaces/request-user.interface';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepo: Repository<Group>,
    @InjectRepository(GroupMember)
    private memberRepo: Repository<GroupMember>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createGroup(dto: CreateGroupDto, creator: RequestUser): Promise<Group> {
    const alreadyMember = await this.memberRepo.findOne({
      where: { userId: creator.id },
    });
    if (alreadyMember)
      throw new ConflictException('You are already part of a group');

    const group = this.groupRepo.create({
      projectTitle: dto.projectTitle ?? null,
    });
    const saved = await this.groupRepo.save(group);

    await this.memberRepo.save(
      this.memberRepo.create({ groupId: saved.id, userId: creator.id }),
    );

    return this.groupRepo.findOne({
      where: { id: saved.id },
      relations: { members: { user: true } },
    }) as Promise<Group>;
  }

  async inviteMember(
    groupId: string,
    dto: InviteMemberDto,
    requester: RequestUser,
  ): Promise<GroupMember> {
    const membership = await this.memberRepo.findOne({
      where: { groupId, userId: requester.id },
    });
    if (!membership)
      throw new ForbiddenException('You are not a member of this group');

    const peer = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!peer) throw new NotFoundException('User not found');
    if (peer.role !== UserRole.STUDENT) {
      throw new BadRequestException('Only students can join a group');
    }
    if (peer.department !== requester.department) {
      throw new ForbiddenException('Peer must belong to the same department');
    }

    const peerAlreadyInGroup = await this.memberRepo.findOne({
      where: { userId: peer.id },
    });
    if (peerAlreadyInGroup)
      throw new ConflictException('Peer is already part of a group');

    return this.memberRepo.save(
      this.memberRepo.create({ groupId, userId: peer.id }),
    );
  }
}
