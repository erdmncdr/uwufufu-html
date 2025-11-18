import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3">
              {t('common.appName')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('home.hero.subtitle')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">{t('navbar.explore')}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-gray-600 hover:text-primary-600 text-sm"
                >
                  {t('navbar.home')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/explore`}
                  className="text-gray-600 hover:text-primary-600 text-sm"
                >
                  {t('navbar.explore')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/create`}
                  className="text-gray-600 hover:text-primary-600 text-sm"
                >
                  {t('navbar.create')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">{t('footer.about')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} {t('common.appName')}. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
