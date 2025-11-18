'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Card } from '../ui/Card';

interface QuizCardProps {
  quiz: any; // QuizWithRelations type
}

export function QuizCard({ quiz }: QuizCardProps) {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <Link href={`/${locale}/quiz/${quiz.slug}`}>
      <Card hover className="overflow-hidden">
        {/* Cover Image */}
        <div className="relative w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
          {quiz.coverImageUrl ? (
            <Image
              src={quiz.coverImageUrl}
              alt={quiz.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl">
              🎮
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
            {quiz.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {quiz.description}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <span>▶️ {quiz.playCount} {t('quiz.plays')}</span>
              <span>❤️ {quiz.likeCount} {t('quiz.likes')}</span>
            </div>
            <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-lg font-medium">
              {t(`quiz.types.${quiz.type}`)}
            </span>
          </div>

          {/* Creator */}
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
            {t('quiz.createdBy')} <span className="font-medium">{quiz.creator.username}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
