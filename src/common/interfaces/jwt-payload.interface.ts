import { UserRole } from '../enums/user-role.enum';
import { Department } from '../enums/department.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  department: Department | null;
}
