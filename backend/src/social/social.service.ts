import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from '@uwufufu/shared';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  // Likes
  async likeQuiz(quizId: string, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const existing = await this.prisma.like.findUnique({
      where: {
        quizId_userId: {
          quizId,
          userId,
        },
      },
    });

    if (existing) {
      return { message: 'Already liked' };
    }

    await this.prisma.$transaction([
      this.prisma.like.create({
        data: { quizId, userId },
      }),
      this.prisma.quiz.update({
        where: { id: quizId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return { message: 'Quiz liked' };
  }

  async unlikeQuiz(quizId: string, userId: string) {
    const existing = await this.prisma.like.findUnique({
      where: {
        quizId_userId: {
          quizId,
          userId,
        },
      },
    });

    if (!existing) {
      return { message: 'Not liked' };
    }

    await this.prisma.$transaction([
      this.prisma.like.delete({
        where: {
          quizId_userId: {
            quizId,
            userId,
          },
        },
      }),
      this.prisma.quiz.update({
        where: { id: quizId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      }),
    ]);

    return { message: 'Quiz unliked' };
  }

  // Bookmarks
  async bookmarkQuiz(quizId: string, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const existing = await this.prisma.bookmark.findUnique({
      where: {
        quizId_userId: {
          quizId,
          userId,
        },
      },
    });

    if (existing) {
      return { message: 'Already bookmarked' };
    }

    await this.prisma.$transaction([
      this.prisma.bookmark.create({
        data: { quizId, userId },
      }),
      this.prisma.quiz.update({
        where: { id: quizId },
        data: {
          bookmarkCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return { message: 'Quiz bookmarked' };
  }

  async unbookmarkQuiz(quizId: string, userId: string) {
    const existing = await this.prisma.bookmark.findUnique({
      where: {
        quizId_userId: {
          quizId,
          userId,
        },
      },
    });

    if (!existing) {
      return { message: 'Not bookmarked' };
    }

    await this.prisma.$transaction([
      this.prisma.bookmark.delete({
        where: {
          quizId_userId: {
            quizId,
            userId,
          },
        },
      }),
      this.prisma.quiz.update({
        where: { id: quizId },
        data: {
          bookmarkCount: {
            decrement: 1,
          },
        },
      }),
    ]);

    return { message: 'Quiz unbookmarked' };
  }

  // Comments
  async getComments(quizId: string) {
    const comments = await this.prisma.comment.findMany({
      where: {
        quizId,
        parentCommentId: null, // Only root comments
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments;
  }

  async createComment(dto: CreateCommentDto, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id: dto.quizId } });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (dto.parentCommentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: dto.parentCommentId },
      });
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const comment = await this.prisma.comment.create({
      data: {
        quizId: dto.quizId,
        userId,
        content: dto.content,
        parentCommentId: dto.parentCommentId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return comment;
  }

  async updateComment(id: string, dto: UpdateCommentDto, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new NotFoundException('Forbidden');
    }

    const updated = await this.prisma.comment.update({
      where: { id },
      data: {
        content: dto.content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return updated;
  }

  async deleteComment(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new NotFoundException('Forbidden');
    }

    await this.prisma.comment.delete({
      where: { id },
    });

    return { message: 'Comment deleted' };
  }
}
