import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateReportDto, UpdateReportDto, UserRole } from '@uwufufu/shared';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('reports')
  @Roles('admin', 'moderator')
  async getReports(@Query('status') status?: string) {
    return this.adminService.getReports(status);
  }

  @Put('reports/:id')
  @Roles('admin', 'moderator')
  async updateReport(
    @Param('id') id: string,
    @Body() dto: UpdateReportDto,
    @CurrentUser() user: any
  ) {
    return this.adminService.updateReport(id, dto, user.id);
  }

  @Post('reports')
  @UseGuards(JwtAuthGuard)
  async createReport(@Body() dto: CreateReportDto, @CurrentUser() user: any) {
    return this.adminService.createReport(dto, user.id);
  }

  @Get('users')
  @Roles('admin')
  async getUsers(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20
  ) {
    return this.adminService.getUsers(page, limit);
  }

  @Put('users/:userId/role')
  @Roles('admin')
  async updateUserRole(@Param('userId') userId: string, @Body('role') role: UserRole) {
    return this.adminService.updateUserRole(userId, role);
  }
}
