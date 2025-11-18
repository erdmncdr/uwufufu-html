'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { QuizCard } from '@/components/quiz/QuizCard';
import { quizzesApi } from '@/lib/api/quizzes';
import { categoriesApi } from '@/lib/api/categories';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const [trendingQuizzes, setTrendingQuizzes] = useState<any[]>([]);
  const [newQuizzes, setNewQuizzes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trending, newest, cats] = await Promise.all([
          quizzesApi.list({ page: 1, limit: 6, sort: 'trending', lang: locale as any }),
          quizzesApi.list({ page: 1, limit: 6, sort: 'newest', lang: locale as any }),
          categoriesApi.list(locale),
        ]);

        setTrendingQuizzes(trending.data);
        setNewQuizzes(newest.data);
        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          {t('home.hero.title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('home.hero.subtitle')}
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link href={`/${locale}/explore`}>
            <Button variant="primary" size="lg">
              {t('home.hero.startPlaying')}
            </Button>
          </Link>
          <Link href={`/${locale}/create`}>
            <Button variant="outline" size="lg">
              {t('home.hero.createQuiz')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Trending Quizzes */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">{t('home.trending.title')}</h2>
          <Link href={`/${locale}/explore?sort=trending`}>
            <Button variant="ghost">{t('home.trending.viewAll')} →</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </section>

      {/* New Quizzes */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">{t('home.new.title')}</h2>
          <Link href={`/${locale}/explore?sort=newest`}>
            <Button variant="ghost">{t('home.new.viewAll')} →</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-6">{t('home.categories.title')}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/${locale}/explore?category=${category.slug}`}>
              <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-soft-lg hover:scale-105 transition-all cursor-pointer text-center">
                <div className="text-4xl mb-2">{category.icon || '📁'}</div>
                <h3 className="font-semibold text-sm">{category.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{category.quizCount} quizzes</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
