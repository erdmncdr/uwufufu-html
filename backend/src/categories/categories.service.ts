import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Language } from '@uwufufu/shared';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(lang: Language = 'en') {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            quizzes: true,
          },
        },
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: lang === 'tr' ? cat.name_tr : cat.name_en,
      description: lang === 'tr' ? cat.description_tr : cat.description_en,
      icon: cat.icon,
      quizCount: cat._count.quizzes,
    }));
  }

  async findBySlug(slug: string, lang: Language = 'en') {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            quizzes: true,
          },
        },
      },
    });

    if (!category) {
      return null;
    }

    return {
      id: category.id,
      slug: category.slug,
      name: lang === 'tr' ? category.name_tr : category.name_en,
      description: lang === 'tr' ? category.description_tr : category.description_en,
      icon: category.icon,
      quizCount: category._count.quizzes,
    };
  }
}
