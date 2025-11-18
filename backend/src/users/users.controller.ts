import { Controller, Get, Put, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateUserDto } from '@uwufufu/shared';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':username')
  async getUserProfile(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto);
  }

  @Get(':username/quizzes')
  async getUserQuizzes(
    @Param('username') username: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 12
  ) {
    return this.usersService.getUserQuizzes(username, page, limit);
  }

  @Get('me/bookmarks')
  @UseGuards(JwtAuthGuard)
  async getUserBookmarks(
    @CurrentUser() user: any,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 12
  ) {
    return this.usersService.getUserBookmarks(user.id, page, limit);
  }
}
