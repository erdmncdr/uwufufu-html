import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuizzesService } from '../quizzes/quizzes.service';
import { WorldcupVoteDto, SmashOrPassVoteDto, Language } from '@uwufufu/shared';
import { getClientIp, hashIp } from '../common/utils/ip-hash.util';

@Injectable()
export class VotesService {
  constructor(
    private prisma: PrismaService,
    private quizzesService: QuizzesService
  ) {}

  async submitVote(quizId: string, itemId: string, userId: string | undefined, ipAddress: string) {
    const ipHash = hashIp(ipAddress);

    await this.prisma.vote.create({
      data: {
        quizId,
        quizItemId: itemId,
        userId,
        ipHash,
      },
    });

    // Increment play count (only once per session/user)
    await this.quizzesService.incrementPlayCount(quizId);
  }

  async submitWorldcupVote(dto: WorldcupVoteDto, userId: string | undefined, ipAddress: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: dto.quizId },
    });

    if (!quiz || quiz.type !== 'worldcup') {
      throw new NotFoundException('Worldcup quiz not found');
    }

    await this.submitVote(dto.quizId, dto.winnerId, userId, ipAddress);

    return { success: true };
  }

  async submitSmashOrPassVote(dto: SmashOrPassVoteDto, userId: string | undefined, ipAddress: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: dto.quizId },
    });

    if (!quiz || quiz.type !== 'smash_or_pass') {
      throw new NotFoundException('Smash or Pass quiz not found');
    }

    if (dto.action === 'smash') {
      await this.submitVote(dto.quizId, dto.itemId, userId, ipAddress);
    }

    return { success: true };
  }

  async getQuizResults(quizId: string, lang: Language = 'en') {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        items: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Get vote counts for each item
    const voteCounts = await this.prisma.vote.groupBy({
      by: ['quizItemId'],
      where: {
        quizId,
      },
      _count: {
        id: true,
      },
    });

    const totalVotes = voteCounts.reduce((sum, vc) => sum + vc._count.id, 0);

    // Map vote counts to items
    const itemResults = quiz.items.map((item) => {
      const voteCount = voteCounts.find((vc) => vc.quizItemId === item.id)?._count.id || 0;
      const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

      return {
        itemId: item.id,
        label: {
          en: item.label_en,
          tr: item.label_tr,
        },
        imageUrl: item.imageUrl,
        voteCount,
        percentage: Math.round(percentage * 100) / 100,
      };
    });

    // Sort by vote count
    itemResults.sort((a, b) => b.voteCount - a.voteCount);

    // Add rank
    itemResults.forEach((item, index) => {
      item['rank'] = index + 1;
    });

    return {
      quizId,
      totalVotes,
      itemResults,
    };
  }
}
