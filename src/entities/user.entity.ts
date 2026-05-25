import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, ApiHideProperty } from '@nestjs/swagger';
import { UserRole } from '../common/enums/user-role.enum';
import { Department } from '../common/enums/department.enum';
import { GroupMember } from './group-member.entity';
import { Proposal } from './proposal.entity';

@Entity('users')
@Index('idx_users_department', ['department'])
@Index('idx_users_role', ['role'])
export class User {
  @ApiProperty({ format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'alice@university.edu' })
  @Column({ unique: true, length: 255 })
  @Index('idx_users_email')
  email: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ length: 255 })
  password: string;

  @ApiProperty({ example: 'Alice Johnson' })
  @Column({ length: 120 })
  name: string;

  @ApiProperty({ enum: UserRole, enumName: 'UserRole', example: UserRole.STUDENT })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @ApiPropertyOptional({ enum: Department, enumName: 'Department', nullable: true, example: Department.CS })
  @Column({ type: 'enum', enum: Department, nullable: true })
  department: Department | null;

  @ApiPropertyOptional({ type: () => GroupMember, isArray: true })
  @OneToMany(() => GroupMember, (gm) => gm.user)
  groupMemberships: GroupMember[];

  @ApiPropertyOptional({ type: () => Proposal, isArray: true })
  @OneToMany(() => Proposal, (p) => p.supervisor)
  receivedProposals: Proposal[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
