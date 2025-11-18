import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto, UpdateReportDto, UserRole } from '@uwufufu/shared';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getReports(status?: string) {
    const where = status ? { status } : {};

    const reports = await this.prisma.report.findMany({
      where,
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reports;
  }

  async updateReport(id: string, dto: UpdateReportDto, reviewerId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const updated = await this.prisma.report.update({
      where: { id },
      data: {
        status: dto.status,
        reviewNote: dto.reviewNote,
        reviewedById: reviewerId,
      },
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return updated;
  }

  async createReport(dto: CreateReportDto, reporterId: string) {
    const report = await this.prisma.report.create({
      data: {
        targetType: dto.targetType,
        targetId: dto.targetId,
        reporterId,
        reason: dto.reason,
        description: dto.description,
      },
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return report;
  }

  async getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          preferredLanguage: true,
          createdAt: true,
          _count: {
            select: {
              createdQuizzes: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserRole(userId: string, role: UserRole) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }
}
