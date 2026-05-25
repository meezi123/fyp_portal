import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import type { RequestUser } from '../../common/interfaces/request-user.interface';

@ApiTags('Students')
@ApiBearerAuth()
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('peers')
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'List ungrouped peers in the same department (LEFT JOIN, no N+1)',
  })
  @ApiResponse({ status: 200, description: 'Array of eligible peers' })
  @ApiResponse({ status: 403, description: 'Only students can call this endpoint' })
  findPeers(@CurrentUser() user: RequestUser) {
    return this.usersService.findPeers(user);
  }
}
