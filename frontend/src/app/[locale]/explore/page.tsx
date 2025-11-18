'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { QuizCard } from '@/components/quiz/QuizCard';
import { Button } from '@/components/ui/Button';
import { quizzesApi } from '@/lib/api/quizzes';
import { categoriesApi } from '@/lib/api/categories';
import { QuizSortBy, QuizType } from '@uwufufu/shared';

export default function ExplorePage() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sort, setSort] = useState<QuizSortBy>((searchParams.get('sort') as QuizSortBy) || 'trending');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [type, setType] = useState<QuizType | undefined>(searchParams.get('type') as QuizType);
  const [search, setSearch] = useState('');

  useEffect(() => {
    categoriesApi.list(locale).then(setCategories);
  }, [locale]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const result = await quizzesApi.list({
          page,
          limit: 12,
          sort,
          category: category || undefined,
          type,
          search: search || undefined,
          lang: locale as any,
        });
        setQuizzes(result.data);
        setTotalPages(result.meta.totalPages);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [page, sort, category, type, search, locale]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('explore.title')}</h1>

      {/* Filters */}
      <div className="mb-8 bg-white rounded-2xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 outline-none transition-all"
          />

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as QuizSortBy)}
            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 outline-none transition-all"
          >
            <option value="trending">{t('explore.sort.trending')}</option>
            <option value="newest">{t('explore.sort.newest')}</option>
            <option value="most_played">{t('explore.sort.mostPlayed')}</option>
            <option value="most_liked">{t('explore.sort.mostLiked')}</option>
          </select>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 outline-none transition-all"
          >
            <option value="">{t('explore.filters.all')}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Type */}
          <select
            value={type || ''}
            onChange={(e) => setType(e.target.value as QuizType || undefined)}
            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 outline-none transition-all"
          >
            <option value="">{t('explore.filters.all')}</option>
            <option value="worldcup">{t('quiz.types.worldcup')}</option>
            <option value="personality">{t('quiz.types.personality')}</option>
            <option value="smash_or_pass">{t('quiz.types.smash_or_pass')}</option>
            <option value="vs">{t('quiz.types.vs')}</option>
            <option value="poll">{t('quiz.types.poll')}</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">{t('explore.noResults')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-12">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← {t('common.back')}
              </Button>
              <span className="px-4 py-2 text-gray-700">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                {t('common.next')} →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
