import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default function RootPage() {
  // Get browser language from Accept-Language header
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language') || '';

  // Simple language detection
  const locale = acceptLanguage.toLowerCase().includes('tr') ? 'tr' : 'en';

  // Redirect to localized home page
  redirect(`/${locale}`);
}
