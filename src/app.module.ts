import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Group } from './entities/group.entity';
import { GroupMember } from './entities/group-member.entity';
import { Proposal } from './entities/proposal.entity';
import { Milestone } from './entities/milestone.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { GroupsModule } from './modules/groups/groups.module';
import { ProposalsModule } from './modules/proposals/proposals.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.getOrThrow<string>('DB_HOST'),
        port: cfg.getOrThrow<number>('DB_PORT'),
        username: cfg.getOrThrow<string>('DB_USER'),
        password: cfg.getOrThrow<string>('DB_PASSWORD'),
        database: cfg.getOrThrow<string>('DB_NAME'),
        entities: [User, Group, GroupMember, Proposal, Milestone],
        synchronize: cfg.get('NODE_ENV') !== 'production',
        logging: cfg.get('NODE_ENV') === 'development',
      }),
    }),

    AuthModule,
    UsersModule,
    GroupsModule,
    ProposalsModule,
    AdminModule,
  ],
})
export class AppModule {}
