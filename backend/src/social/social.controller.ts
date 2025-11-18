import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SocialService } from './social.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateCommentDto, UpdateCommentDto } from '@uwufufu/shared';

@Controller('social')
export class SocialController {
  constructor(private socialService: SocialService) {}

  // Likes
  @Post('quizzes/:quizId/like')
  @UseGuards(JwtAuthGuard)
  async likeQuiz(@Param('quizId') quizId: string, @CurrentUser() user: any) {
    return this.socialService.likeQuiz(quizId, user.id);
  }

  @Delete('quizzes/:quizId/like')
  @UseGuards(JwtAuthGuard)
  async unlikeQuiz(@Param('quizId') quizId: string, @CurrentUser() user: any) {
    return this.socialService.unlikeQuiz(quizId, user.id);
  }

  // Bookmarks
  @Post('quizzes/:quizId/bookmark')
  @UseGuards(JwtAuthGuard)
  async bookmarkQuiz(@Param('quizId') quizId: string, @CurrentUser() user: any) {
    return this.socialService.bookmarkQuiz(quizId, user.id);
  }

  @Delete('quizzes/:quizId/bookmark')
  @UseGuards(JwtAuthGuard)
  async unbookmarkQuiz(@Param('quizId') quizId: string, @CurrentUser() user: any) {
    return this.socialService.unbookmarkQuiz(quizId, user.id);
  }

  // Comments
  @Get('quizzes/:quizId/comments')
  async getComments(@Param('quizId') quizId: string) {
    return this.socialService.getComments(quizId);
  }

  @Post('comments')
  @UseGuards(JwtAuthGuard)
  async createComment(@Body() dto: CreateCommentDto, @CurrentUser() user: any) {
    return this.socialService.createComment(dto, user.id);
  }

  @Put('comments/:id')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @CurrentUser() user: any
  ) {
    return this.socialService.updateComment(id, dto, user.id);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Param('id') id: string, @CurrentUser() user: any) {
    return this.socialService.deleteComment(id, user.id);
  }
}
