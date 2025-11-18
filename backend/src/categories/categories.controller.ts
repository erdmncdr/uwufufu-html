import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Lang } from '../common/decorators/language.decorator';
import { Language } from '@uwufufu/shared';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll(@Lang() lang: Language) {
    return this.categoriesService.findAll(lang);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string, @Lang() lang: Language) {
    return this.categoriesService.findBySlug(slug, lang);
  }
}
