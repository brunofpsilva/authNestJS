import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types';
import { RtAuthGuard } from '../utils/guards';
import {
  GetCurrentUser,
  GetCurrentUserById,
  Public,
} from '../utils/decorators';
import { User } from '../users/users.schema';
import { UserDto } from '../users/dto/user.dto';

// -----------------------------------------------------------------------------

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  async loginLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.loginLocal(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserById() user: string): Promise<boolean> {
    return this.authService.logout(user);
  }

  @UseGuards()
  @Get('account')
  @HttpCode(HttpStatus.OK)
  async account(@GetCurrentUserById() email: string): Promise<User> {
    return this.authService.account(email);
  }

  @Public()
  @UseGuards(RtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @GetCurrentUserById() user: string,
    @GetCurrentUser('refreshToken') rt: string,
  ): Promise<Tokens> {
    return this.authService.refresh(user, rt);
  }
}
