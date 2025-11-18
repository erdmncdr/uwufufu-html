import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateQuizDto,
  UpdateQuizDto,
  QuizListQuery,
  Language,
  QuizSortBy,
} from '@uwufufu/shared';
import { generateSlug, generateUniqueSlug } from '../common/utils/slug.util';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QuizListQuery, userId?: string) {
    const {
      page = 1,
      limit = 12,
      sort = 'newest',
      category,
      tag,
      type,
      search,
      lang = 'en',
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      visibility: 'public',
    };

    if (category) {
      const cat = await this.prisma.category.findUnique({ where: { slug: category } });
      if (cat) {
        where.categoryId = cat.id;
      }
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      };
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { title_en: { contains: search, mode: 'insensitive' } },
        { title_tr: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy
    let orderBy: any = { createdAt: 'desc' };

    switch (sort) {
      case 'most_played':
        orderBy = { playCount: 'desc' };
        break;
      case 'most_liked':
        orderBy = { likeCount: 'desc' };
        break;
      case 'trending':
        // Simple trending: recent + popular
        orderBy = [{ playCount: 'desc' }, { createdAt: 'desc' }];
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Execute query
    const [quizzes, total] = await Promise.all([
      this.prisma.quiz.findMany({
        where,
        include: {
          category: true,
          creator: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.quiz.count({ where }),
    ]);

    // Check likes/bookmarks for authenticated user
    let userLikes: string[] = [];
    let userBookmarks: string[] = [];

    if (userId) {
      const [likes, bookmarks] = await Promise.all([
        this.prisma.like.findMany({
          where: { userId, quizId: { in: quizzes.map((q) => q.id) } },
          select: { quizId: true },
        }),
        this.prisma.bookmark.findMany({
          where: { userId, quizId: { in: quizzes.map((q) => q.id) } },
          select: { quizId: true },
        }),
      ]);

      userLikes = likes.map((l) => l.quizId);
      userBookmarks = bookmarks.map((b) => b.quizId);
    }

    // Format response
    const data = quizzes.map((quiz) => this.formatQuiz(quiz, lang, userId, userLikes, userBookmarks));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string, lang: Language = 'en', userId?: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { slug },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        items: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Check if user liked/bookmarked
    let isLiked = false;
    let isBookmarked = false;

    if (userId) {
      const [like, bookmark] = await Promise.all([
        this.prisma.like.findUnique({
          where: {
            quizId_userId: {
              quizId: quiz.id,
              userId,
            },
          },
        }),
        this.prisma.bookmark.findUnique({
          where: {
            quizId_userId: {
              quizId: quiz.id,
              userId,
            },
          },
        }),
      ]);

      isLiked = !!like;
      isBookmarked = !!bookmark;
    }

    return this.formatQuizDetailed(quiz, lang, isLiked, isBookmarked);
  }

  async create(dto: CreateQuizDto, userId: string) {
    // Generate slug from title
    const baseSlug = generateSlug(dto.title.en);
    const existingSlugs = await this.prisma.quiz.findMany({
      where: { slug: { startsWith: baseSlug } },
      select: { slug: true },
    });
    const slug = generateUniqueSlug(dto.title.en, existingSlugs.map((q) => q.slug));

    // Create quiz with items
    const quiz = await this.prisma.quiz.create({
      data: {
        slug,
        type: dto.type,
        title_en: dto.title.en,
        title_tr: dto.title.tr,
        description_en: dto.description.en,
        description_tr: dto.description.tr,
        coverImageUrl: dto.coverImageUrl,
        categoryId: dto.categoryId,
        createdById: userId,
        visibility: dto.visibility || 'public',
        isNSFW: dto.isNSFW || false,
        items: {
          create: dto.items.map((item) => ({
            label_en: item.label.en,
            label_tr: item.label.tr,
            imageUrl: item.imageUrl,
            orderIndex: item.orderIndex,
            extraMeta: item.extraMeta,
          })),
        },
        tags: dto.tagIds
          ? {
              create: dto.tagIds.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        items: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });

    return this.formatQuizDetailed(quiz, 'en', false, false);
  }

  async update(id: string, dto: UpdateQuizDto, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.createdById !== userId) {
      throw new ForbiddenException('You can only update your own quizzes');
    }

    const updated = await this.prisma.quiz.update({
      where: { id },
      data: {
        title_en: dto.title?.en,
        title_tr: dto.title?.tr,
        description_en: dto.description?.en,
        description_tr: dto.description?.tr,
        coverImageUrl: dto.coverImageUrl,
        categoryId: dto.categoryId,
        visibility: dto.visibility,
        isNSFW: dto.isNSFW,
        tags: dto.tagIds
          ? {
              deleteMany: {},
              create: dto.tagIds.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        items: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });

    return this.formatQuizDetailed(updated, 'en', false, false);
  }

  async delete(id: string, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.createdById !== userId) {
      throw new ForbiddenException('You can only delete your own quizzes');
    }

    await this.prisma.quiz.delete({
      where: { id },
    });

    return { message: 'Quiz deleted successfully' };
  }

  async incrementPlayCount(quizId: string) {
    await this.prisma.quiz.update({
      where: { id: quizId },
      data: {
        playCount: {
          increment: 1,
        },
      },
    });
  }

  private formatQuiz(quiz: any, lang: Language, userId?: string, userLikes: string[] = [], userBookmarks: string[] = []) {
    return {
      id: quiz.id,
      slug: quiz.slug,
      type: quiz.type,
      title: lang === 'tr' ? quiz.title_tr : quiz.title_en,
      description: lang === 'tr' ? quiz.description_tr : quiz.description_en,
      coverImageUrl: quiz.coverImageUrl,
      category: {
        id: quiz.category.id,
        slug: quiz.category.slug,
        name: lang === 'tr' ? quiz.category.name_tr : quiz.category.name_en,
      },
      creator: quiz.creator,
      tags: quiz.tags.map((qt: any) => ({
        id: qt.tag.id,
        slug: qt.tag.slug,
        name: lang === 'tr' ? qt.tag.name_tr : qt.tag.name_en,
      })),
      visibility: quiz.visibility,
      isNSFW: quiz.isNSFW,
      playCount: quiz.playCount,
      likeCount: quiz.likeCount,
      bookmarkCount: quiz.bookmarkCount,
      itemCount: quiz._count.items,
      isLikedByUser: userId ? userLikes.includes(quiz.id) : false,
      isBookmarkedByUser: userId ? userBookmarks.includes(quiz.id) : false,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };
  }

  private formatQuizDetailed(quiz: any, lang: Language, isLiked = false, isBookmarked = false) {
    return {
      id: quiz.id,
      slug: quiz.slug,
      type: quiz.type,
      title: lang === 'tr' ? quiz.title_tr : quiz.title_en,
      description: lang === 'tr' ? quiz.description_tr : quiz.description_en,
      coverImageUrl: quiz.coverImageUrl,
      category: {
        id: quiz.category.id,
        slug: quiz.category.slug,
        name: lang === 'tr' ? quiz.category.name_tr : quiz.category.name_en,
      },
      creator: quiz.creator,
      tags: quiz.tags.map((qt: any) => ({
        id: qt.tag.id,
        slug: qt.tag.slug,
        name: lang === 'tr' ? qt.tag.name_tr : qt.tag.name_en,
      })),
      items: quiz.items.map((item: any) => ({
        id: item.id,
        label: lang === 'tr' ? item.label_tr : item.label_en,
        imageUrl: item.imageUrl,
        orderIndex: item.orderIndex,
        extraMeta: item.extraMeta,
      })),
      visibility: quiz.visibility,
      isNSFW: quiz.isNSFW,
      playCount: quiz.playCount,
      likeCount: quiz.likeCount,
      bookmarkCount: quiz.bookmarkCount,
      isLikedByUser: isLiked,
      isBookmarkedByUser: isBookmarked,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };
  }
}
