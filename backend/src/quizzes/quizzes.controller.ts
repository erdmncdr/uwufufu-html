import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Lang } from '../common/decorators/language.decorator';
import { CreateQuizDto, UpdateQuizDto, Language, QuizSortBy, QuizType } from '@uwufufu/shared';

@Controller('quizzes')
export class QuizzesController {
  constructor(private quizzesService: QuizzesService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(
    @CurrentUser() user: any,
    @Lang() lang: Language,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 12,
    @Query('sort') sort?: QuizSortBy,
    @Query('category') category?: string,
    @Query('tag') tag?: string,
    @Query('type') type?: QuizType,
    @Query('search') search?: string
  ) {
    return this.quizzesService.findAll(
      {
        page,
        limit,
        sort,
        category,
        tag,
        type,
        search,
        lang,
      },
      user?.id
    );
  }

  @Get(':slug')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(
    @Param('slug') slug: string,
    @Lang() lang: Language,
    @CurrentUser() user: any
  ) {
    return this.quizzesService.findBySlug(slug, lang, user?.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateQuizDto, @CurrentUser() user: any) {
    return this.quizzesService.create(dto, user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateQuizDto,
    @CurrentUser() user: any
  ) {
    return this.quizzesService.update(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.quizzesService.delete(id, user.id);
  }
}
