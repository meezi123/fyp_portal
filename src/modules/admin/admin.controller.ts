import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { SeedStudentsDto } from './dto/seed-students.dto';
import { BootstrapAdminDto } from './dto/bootstrap-admin.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('bootstrap')
  @ApiOperation({
    summary: 'Create the first admin account (one-time, secret-protected)',
  })
  @ApiHeader({
    name: 'x-bootstrap-secret',
    description: 'Must match BOOTSTRAP_SECRET env var',
  })
  @ApiResponse({ status: 201, description: 'Admin created' })
  @ApiResponse({ status: 409, description: 'Admin already exists' })
  bootstrap(
    @Body() dto: BootstrapAdminDto,
    @Headers('x-bootstrap-secret') secret: string,
  ) {
    if (!secret || secret !== process.env.BOOTSTRAP_SECRET) {
      throw new UnauthorizedException('Invalid bootstrap secret');
    }
    return this.adminService.bootstrapAdmin(dto);
  }

  @Post('seed-students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk-provision student accounts' })
  @ApiResponse({ status: 201, description: 'Students created; returns plain passwords' })
  @ApiResponse({ status: 409, description: 'One or more emails already registered' })
  seedStudents(@Body() dto: SeedStudentsDto) {
    return this.adminService.seedStudents(dto);
  }
}
