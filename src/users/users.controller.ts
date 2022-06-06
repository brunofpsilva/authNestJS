import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from './types';
import { Roles } from '../utils/decorators/roles.decorator';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() user: UserDto) {
    return await this.usersService.create(user);
  }

  @Roles(Role.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  async get() {
    return await this.usersService.getAll({});
  }
}
