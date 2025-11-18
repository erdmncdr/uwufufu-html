'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { quizzesApi } from '@/lib/api/quizzes';
import { socialApi } from '@/lib/api/social';
import { useAuthStore } from '@/stores/authStore';

export default function QuizDetailPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizzesApi.getBySlug(params.slug as string, locale);
        setQuiz(data);
        setIsLiked(data.isLikedByUser || false);
        setIsBookmarked(data.isBookmarkedByUser || false);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params.slug, locale]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login`);
      return;
    }

    try {
      if (isLiked) {
        await socialApi.unlikeQuiz(quiz.id);
        setIsLiked(false);
        setQuiz({ ...quiz, likeCount: quiz.likeCount - 1 });
      } else {
        await socialApi.likeQuiz(quiz.id);
        setIsLiked(true);
        setQuiz({ ...quiz, likeCount: quiz.likeCount + 1 });
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login`);
      return;
    }

    try {
      if (isBookmarked) {
        await socialApi.unbookmarkQuiz(quiz.id);
        setIsBookmarked(false);
        setQuiz({ ...quiz, bookmarkCount: quiz.bookmarkCount - 1 });
      } else {
        await socialApi.bookmarkQuiz(quiz.id);
        setIsBookmarked(true);
        setQuiz({ ...quiz, bookmarkCount: quiz.bookmarkCount + 1 });
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-2xl mb-8" />
          <div className="h-8 bg-gray-200 rounded mb-4 w-2/3" />
          <div className="h-4 bg-gray-200 rounded mb-8 w-1/2" />
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('errors.404.title')}</h1>
        <p className="text-gray-600 mb-6">{t('errors.404.message')}</p>
        <Link href={`/${locale}`}>
          <Button>{t('errors.404.goHome')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="relative h-96 rounded-3xl overflow-hidden mb-8">
        {quiz.coverImageUrl ? (
          <Image
            src={quiz.coverImageUrl}
            alt={quiz.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="flex items-center space-x-2 mb-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
              {t(`quiz.types.${quiz.type}`)}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm">
              {quiz.category.name}
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-3">{quiz.title}</h1>
          <p className="text-xl text-white/90">{quiz.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <Link href={`/${locale}/profile/${quiz.creator.username}`} className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400" />
                <div>
                  <p className="text-sm text-gray-600">{t('quiz.createdBy')}</p>
                  <p className="font-semibold">{quiz.creator.username}</p>
                </div>
              </Link>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleLike}>
                  {isLiked ? '❤️' : '🤍'} {quiz.likeCount}
                </Button>
                <Button variant="outline" size="sm" onClick={handleBookmark}>
                  {isBookmarked ? '🔖' : '📑'} {quiz.bookmarkCount}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
              <span>▶️ {quiz.playCount} {t('quiz.plays')}</span>
              <span>📦 {quiz.items.length} {t('quiz.items')}</span>
            </div>

            <Link href={`/${locale}/play/${quiz.slug}`}>
              <Button variant="primary" size="lg" className="w-full">
                {t('quiz.playNow')} 🎮
              </Button>
            </Link>
          </Card>

          {/* Items Preview */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">{t('quiz.items')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quiz.items.slice(0, 8).map((item: any) => (
                <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.label}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 p-2">
                    <p className="text-white text-sm font-medium truncate">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 mb-6">
            <h3 className="font-bold mb-3">{t('quiz.tags')}</h3>
            <div className="flex flex-wrap gap-2">
              {quiz.tags.map((tag: any) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
