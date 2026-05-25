import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import { Group } from '../entities/group.entity';
import { GroupMember } from '../entities/group-member.entity';
import { Proposal } from '../entities/proposal.entity';
import { Milestone } from '../entities/milestone.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? 'fyp_portal',
  entities: [User, Group, GroupMember, Proposal, Milestone],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
  logging: false,
});
