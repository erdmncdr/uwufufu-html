import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Language } from '@uwufufu/shared';

export const Lang = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Language => {
    const request = ctx.switchToHttp().getRequest();

    // Priority: query param > header > user preference > default
    const langQuery = request.query.lang;
    if (langQuery === 'en' || langQuery === 'tr') {
      return langQuery;
    }

    const acceptLanguage = request.headers['accept-language'];
    if (acceptLanguage) {
      if (acceptLanguage.includes('tr')) return 'tr';
      if (acceptLanguage.includes('en')) return 'en';
    }

    if (request.user?.preferredLanguage) {
      return request.user.preferredLanguage;
    }

    return 'en';
  }
);
