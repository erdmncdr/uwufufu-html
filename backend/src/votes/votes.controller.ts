import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { VotesService } from './votes.service';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Lang } from '../common/decorators/language.decorator';
import { WorldcupVoteDto, SmashOrPassVoteDto, Language } from '@uwufufu/shared';
import { getClientIp } from '../common/utils/ip-hash.util';

@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post('worldcup')
  @UseGuards(OptionalJwtAuthGuard)
  async submitWorldcupVote(
    @Body() dto: WorldcupVoteDto,
    @CurrentUser() user: any,
    @Req() request: any
  ) {
    const ipAddress = getClientIp(request);
    return this.votesService.submitWorldcupVote(dto, user?.id, ipAddress);
  }

  @Post('smash-or-pass')
  @UseGuards(OptionalJwtAuthGuard)
  async submitSmashOrPassVote(
    @Body() dto: SmashOrPassVoteDto,
    @CurrentUser() user: any,
    @Req() request: any
  ) {
    const ipAddress = getClientIp(request);
    return this.votesService.submitSmashOrPassVote(dto, user?.id, ipAddress);
  }

  @Get('results/:quizId')
  async getResults(@Param('quizId') quizId: string, @Lang() lang: Language) {
    return this.votesService.getQuizResults(quizId, lang);
  }
}
