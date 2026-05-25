import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  ParseUUIDPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalStatusDto } from './dto/update-proposal-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import type { RequestUser } from '../../common/interfaces/request-user.interface';

@ApiTags('Proposals')
@ApiBearerAuth()
@Controller('proposals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProposalsController {
  constructor(private proposalsService: ProposalsService) {}

  @Post()
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Submit a project proposal to a supervisor' })
  @ApiResponse({ status: 201, description: 'Proposal submitted with PENDING status' })
  @ApiResponse({ status: 403, description: 'Caller not a member of the supplied group' })
  @ApiResponse({ status: 404, description: 'Supervisor not found' })
  submit(@Body() dto: CreateProposalDto, @CurrentUser() user: RequestUser) {
    return this.proposalsService.submit(dto, user);
  }

  @Get('incoming')
  @Roles(UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'List PENDING proposals assigned to the logged-in supervisor' })
  @ApiResponse({ status: 200, description: 'Array of pending proposals with group details' })
  findIncoming(@CurrentUser() user: RequestUser) {
    return this.proposalsService.findIncoming(user);
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'Accept, reject, or request revision on a proposal' })
  @ApiParam({ name: 'id', description: 'Proposal UUID' })
  @ApiResponse({ status: 200, description: 'Proposal status updated' })
  @ApiResponse({ status: 403, description: 'Proposal belongs to a different supervisor' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProposalStatusDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.proposalsService.updateStatus(id, dto, user);
  }
}
