import {
  Controller,
  Post,
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
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import type { RequestUser } from '../../common/interfaces/request-user.interface';

@ApiTags('Groups')
@ApiBearerAuth()
@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new FYP group (creator becomes first member)' })
  @ApiResponse({ status: 201, description: 'Group created with creator as first member' })
  @ApiResponse({ status: 409, description: 'Caller is already part of a group' })
  createGroup(@Body() dto: CreateGroupDto, @CurrentUser() user: RequestUser) {
    return this.groupsService.createGroup(dto, user);
  }

  @Post(':id/invite')
  @ApiOperation({ summary: 'Invite a peer to the group (same-department guard)' })
  @ApiParam({ name: 'id', description: 'Group UUID' })
  @ApiResponse({ status: 201, description: 'Peer added to group' })
  @ApiResponse({ status: 403, description: 'Caller not in group, or cross-department invite' })
  @ApiResponse({ status: 409, description: 'Peer already in a group' })
  inviteMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: InviteMemberDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.groupsService.inviteMember(id, dto, user);
  }
}
