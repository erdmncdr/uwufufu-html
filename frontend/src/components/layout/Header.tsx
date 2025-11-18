'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '../ui/Button';
import { useEffect, useState } from 'react';

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLanguage = () => {
    const newLocale = locale === 'en' ? 'tr' : 'en';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const handleLogout = async () => {
    await logout();
    router.push(`/${locale}/auth/login`);
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {t('common.appName')}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href={`/${locale}`}
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              {t('navbar.home')}
            </Link>
            <Link
              href={`/${locale}/explore`}
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              {t('navbar.explore')}
            </Link>
            {isAuthenticated && (
              <Link
                href={`/${locale}/create`}
                className="text-gray-700 hover:text-primary-600 font-medium"
              >
                {t('navbar.create')}
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <button
              onClick={switchLanguage}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
              aria-label={t('common.language')}
            >
              {locale.toUpperCase()}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <>
                <Link href={`/${locale}/profile/${user?.username}`}>
                  <Button variant="ghost" size="sm">
                    {user?.username}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  {t('navbar.logout')}
                </Button>
              </>
            ) : (
              <>
                <Link href={`/${locale}/auth/login`}>
                  <Button variant="ghost" size="sm">
                    {t('navbar.login')}
                  </Button>
                </Link>
                <Link href={`/${locale}/auth/register`}>
                  <Button variant="primary" size="sm">
                    {t('navbar.register')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
