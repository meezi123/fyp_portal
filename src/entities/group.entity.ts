import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GroupStatus } from '../common/enums/group-status.enum';
import { GroupMember } from './group-member.entity';
import { Proposal } from './proposal.entity';

@Entity('groups')
@Index('idx_groups_status', ['status'])
export class Group {
  @ApiProperty({
    format: 'uuid',
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiPropertyOptional({
    example: 'Blockchain-based academic credential verification',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  projectTitle: string | null;

  @ApiProperty({
    enum: GroupStatus,
    enumName: 'GroupStatus',
    example: GroupStatus.FORMING,
  })
  @Column({ type: 'enum', enum: GroupStatus, default: GroupStatus.FORMING })
  status: GroupStatus;

  @ApiPropertyOptional({ type: () => GroupMember, isArray: true })
  @OneToMany(() => GroupMember, (gm) => gm.group, { cascade: true })
  members: GroupMember[];

  @ApiPropertyOptional({ type: () => Proposal, isArray: true })
  @OneToMany(() => Proposal, (p) => p.group)
  proposals: Proposal[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
