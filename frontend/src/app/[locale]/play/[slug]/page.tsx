'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { quizzesApi } from '@/lib/api/quizzes';
import { votesApi } from '@/lib/api/votes';

export default function PlayPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentRound, setCurrentRound] = useState(0);
  const [matchups, setMatchups] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizzesApi.getBySlug(params.slug as string, locale);
        setQuiz(data);

        if (data.type === 'worldcup') {
          // Generate bracket matchups
          const items = [...data.items];
          const bracket: any[] = [];

          for (let i = 0; i < items.length; i += 2) {
            if (items[i + 1]) {
              bracket.push({
                itemA: items[i],
                itemB: items[i + 1],
              });
            }
          }

          setMatchups(bracket);
        }
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params.slug, locale]);

  const handleVote = async (winnerId: string) => {
    try {
      const matchup = matchups[currentRound];
      await votesApi.submitWorldcupVote({
        quizId: quiz.id,
        itemAId: matchup.itemA.id,
        itemBId: matchup.itemB.id,
        winnerId,
      });

      if (currentRound < matchups.length - 1) {
        setCurrentRound(currentRound + 1);
      } else {
        // Show results
        const resultsData = await votesApi.getResults(quiz.id, locale);
        setResults(resultsData);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Failed to submit vote:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-xl">{t('common.loading')}</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('errors.404.title')}</h1>
        <Button onClick={() => router.push(`/${locale}`)}>{t('errors.404.goHome')}</Button>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">{t('play.results')}</h1>

          <Card className="p-8 mb-6">
            <div className="space-y-4">
              {results.itemResults.slice(0, 10).map((item: any, index: number) => (
                <div key={item.itemId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-primary-600 w-8">#{index + 1}</div>
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                    <Image src={item.imageUrl} alt={item.label[locale]} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.label[locale]}</p>
                    <p className="text-sm text-gray-600">
                      {item.voteCount} {t('play.votes')} ({item.percentage}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex items-center justify-center space-x-4">
            <Button variant="primary" onClick={() => window.location.reload()}>
              {t('play.playAgain')}
            </Button>
            <Button variant="outline" onClick={() => router.push(`/${locale}/quiz/${quiz.slug}`)}>
              {t('play.backToQuiz')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentMatchup = matchups[currentRound];

  if (!currentMatchup) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Progress */}
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-600 mb-2">
            {t('play.round')} {currentRound + 1} {t('play.of')} {matchups.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentRound + 1) / matchups.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Matchup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item A */}
          <Card
            hover
            className="cursor-pointer overflow-hidden"
            onClick={() => handleVote(currentMatchup.itemA.id)}
          >
            <div className="relative aspect-square bg-gradient-to-br from-primary-100 to-secondary-100">
              <Image
                src={currentMatchup.itemA.imageUrl}
                alt={currentMatchup.itemA.label}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold">{currentMatchup.itemA.label}</h3>
            </div>
          </Card>

          {/* Item B */}
          <Card
            hover
            className="cursor-pointer overflow-hidden"
            onClick={() => handleVote(currentMatchup.itemB.id)}
          >
            <div className="relative aspect-square bg-gradient-to-br from-primary-100 to-secondary-100">
              <Image
                src={currentMatchup.itemB.imageUrl}
                alt={currentMatchup.itemB.label}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold">{currentMatchup.itemB.label}</h3>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">{t('quiz.selectOne')}</p>
        </div>
      </div>
    </div>
  );
}
