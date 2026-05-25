import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { User } from '../../entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Authenticate and receive a JWT bearer token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'Returns access_token and user metadata' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Req() req: Request & { user: User }) {
    return this.authService.login(req.user);
  }
}
