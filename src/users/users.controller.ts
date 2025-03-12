import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getCurrentUser(@Req() req: Request) {
    return this.usersService.getCurrentUser(req.user.userId);
  }

  @Patch('me')
  updateCurrentUser(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateCurrentUser(req.user.userId, updateUserDto);
  }
}
