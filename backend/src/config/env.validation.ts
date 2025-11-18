export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  // Warn about using default secrets in production
  if (process.env.NODE_ENV === 'production') {
    if (
      process.env.JWT_ACCESS_SECRET?.includes('dev') ||
      process.env.JWT_ACCESS_SECRET?.includes('change')
    ) {
      console.warn(
        '⚠️  WARNING: Using default JWT secrets in production! Please change them immediately.'
      );
    }
  }

  console.log('✅ Environment variables validated successfully');
}
