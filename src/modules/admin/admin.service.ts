import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { SeedStudentsDto } from './dto/seed-students.dto';
import { BootstrapAdminDto } from './dto/bootstrap-admin.dto';

export interface SeededStudent {
  id: string;
  name: string;
  email: string;
  department: string;
  plainPassword: string;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async seedStudents(dto: SeedStudentsDto): Promise<SeededStudent[]> {
    const emails = dto.students.map((s) => s.email);

    const existing = await this.userRepo
      .createQueryBuilder('u')
      .where('u.email IN (:...emails)', { emails })
      .getMany();

    if (existing.length > 0) {
      const dupes = existing.map((u) => u.email).join(', ');
      throw new ConflictException(`Emails already registered: ${dupes}`);
    }

    // Hash all passwords concurrently
    const prepared = await Promise.all(
      dto.students.map(async (item) => {
        const plain = item.password ?? crypto.randomBytes(8).toString('hex');
        const hash = await bcrypt.hash(plain, 10);
        return { item, plain, hash };
      }),
    );

    const entities = prepared.map(({ item, hash }) =>
      this.userRepo.create({
        name: item.name,
        email: item.email,
        password: hash,
        role: UserRole.STUDENT,
        department: item.department,
      }),
    );

    const saved = await this.userRepo.save(entities);

    return saved.map((user, i) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department as string,
      plainPassword: prepared[i].plain,
    }));
  }

  async bootstrapAdmin(dto: BootstrapAdminDto): Promise<Omit<User, 'password'>> {
    const adminCount = await this.userRepo.count({ where: { role: UserRole.ADMIN } });
    if (adminCount > 0) throw new ConflictException('An admin account already exists');

    const hash = await bcrypt.hash(dto.password, 10);
    const admin = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hash,
      role: UserRole.ADMIN,
      department: null,
    });
    const saved = await this.userRepo.save(admin);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...safe } = saved;
    return safe as Omit<User, 'password'>;
  }
}
