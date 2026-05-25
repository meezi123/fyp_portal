import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { GroupMember } from '../../entities/group-member.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { RequestUser } from '../../common/interfaces/request-user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  /**
   * Single LEFT JOIN query — returns students in the same department
   * who have no entry in group_members (never joined any group).
   * Avoids N+1 and never loads passwords.
   */
  findPeers(currentUser: RequestUser): Promise<User[]> {
    return this.userRepo
      .createQueryBuilder('u')
      .leftJoin(GroupMember, 'gm', 'gm.userId = u.id')
      .where('u.department = :dept', { dept: currentUser.department })
      .andWhere('u.role = :role', { role: UserRole.STUDENT })
      .andWhere('u.id != :self', { self: currentUser.id })
      .andWhere('gm.id IS NULL')
      .select(['u.id', 'u.name', 'u.email', 'u.department'])
      .getMany();
  }
}
