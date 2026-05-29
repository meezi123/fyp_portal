import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Group } from '../entities/group.entity';
import { GroupMember } from '../entities/group-member.entity';
import { Proposal } from '../entities/proposal.entity';
import { Milestone } from '../entities/milestone.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  // 1. Pass the environment variable directly here
  url: process.env.DATABASE_URL,
  entities: [User, Group, GroupMember, Proposal, Milestone],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
  logging: false,
  // 2. Enable SSL here too so running migrations from terminal won't fail
  ssl: {
    rejectUnauthorized: false,
  },
});