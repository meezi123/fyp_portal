import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProposalStatus } from '../common/enums/proposal-status.enum';
import { Group } from './group.entity';
import { User } from './user.entity';

@Entity('proposals')
@Index('idx_proposals_group', ['groupId'])
@Index('idx_proposals_supervisor', ['supervisorId'])
@Index('idx_proposals_status', ['status'])
export class Proposal {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ format: 'uuid' })
  @Column({ type: 'uuid' })
  groupId: string;

  @ApiProperty({ format: 'uuid' })
  @Column({ type: 'uuid' })
  supervisorId: string;

  @ApiProperty({ example: 'This project proposes a decentralized credential verification system.' })
  @Column({ type: 'text' })
  abstract: string;

  @ApiProperty({ enum: ProposalStatus, enumName: 'ProposalStatus', example: ProposalStatus.PENDING })
  @Column({ type: 'enum', enum: ProposalStatus, default: ProposalStatus.PENDING })
  status: ProposalStatus;

  @ApiPropertyOptional({ example: 'Please expand the literature review.', nullable: true })
  @Column({ type: 'text', nullable: true })
  remarks: string | null;

  @ApiPropertyOptional({ type: () => Group })
  @ManyToOne(() => Group, (group) => group.proposals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @ApiPropertyOptional({ type: () => User })
  @ManyToOne(() => User, (user) => user.receivedProposals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supervisorId' })
  supervisor: User;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
