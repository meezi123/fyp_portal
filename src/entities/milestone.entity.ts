import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('milestones')
@Index('idx_milestones_deadline', ['deadline'])
export class Milestone {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Proposal Submission' })
  @Column({ length: 255 })
  title: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  @Column({ type: 'timestamptz' })
  deadline: Date;

  @ApiPropertyOptional({ example: 'Submit the final approved proposal document.', nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
