# UwuFufu Clone - Complete Setup Guide

This guide will walk you through setting up and running the complete bilingual quiz platform locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd uwufufu-html
```

### 2. Install Dependencies

From the root directory, install all workspace dependencies:

```bash
npm install
```

This will install dependencies for the root, frontend, backend, and shared packages.

### 3. Set Up PostgreSQL Database

Create a new PostgreSQL database:

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE uwufufu;

# Create user (optional, if you want a specific user)
CREATE USER uwufufu_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE uwufufu TO uwufufu_user;

# Exit
\q
```

### 4. Configure Environment Variables

#### Backend Configuration

Create `backend/.env` from the example:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your database credentials:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/uwufufu"

JWT_ACCESS_SECRET="your-super-secret-access-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

PORT=3001
FRONTEND_URL="http://localhost:3000"

NODE_ENV="development"
```

**⚠️ Important:** Change the JWT secrets to strong, random strings in production!

#### Frontend Configuration

Create `frontend/.env.local`:

```bash
cd ../frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 5. Run Database Migrations

From the backend directory:

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database with demo data
npm run prisma:seed
```

The seed script will create:
- 2 demo users (admin and regular user)
- 6 categories (K-Pop, Anime, Gaming, Movies, Food, Sports)
- 4 tags (Trending, New, Popular, Fun)
- 4 sample quizzes with items (K-Pop World Cup, Anime Smash or Pass, Fast Food World Cup, Marvel vs DC)

**Demo Accounts:**
- **Admin:** admin@uwufufu.com / password123
- **User:** demo@uwufufu.com / password123

### 6. Start the Development Servers

You can start both servers simultaneously from the root directory:

```bash
# From the root directory
npm run dev
```

Or start them separately:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The applications will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api

## 🌍 Testing Bilingual Features

### Language Switching

1. Visit http://localhost:3000
2. You'll be automatically redirected to `/en` (English) or `/tr` (Turkish) based on your browser language
3. Use the language switcher in the header (EN/TR button) to switch between languages
4. All UI text, quiz content, and categories will update to reflect the selected language

### Language Persistence

- **Guest users:** Language preference is stored in localStorage
- **Authenticated users:** Language preference is saved to their user profile in the database
- The backend respects the `Accept-Language` header and `lang` query parameter

### Testing Localized Content

1. **Browse quizzes** in both languages - titles, descriptions, and items are all localized
2. **Create a quiz** - you'll need to provide both English and Turkish content
3. **Switch languages** during quiz play to see real-time content updates

## 📁 Project Structure

```
uwufufu-html/
├── backend/                 # NestJS backend
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema with i18n fields
│   │   └── seed.ts         # Bilingual seed data
│   └── src/
│       ├── auth/           # JWT authentication
│       ├── quizzes/        # Quiz CRUD with i18n
│       ├── votes/          # Voting system
│       ├── social/         # Likes, bookmarks, comments
│       ├── admin/          # Admin & moderation
│       └── categories/     # Localized categories
├── frontend/               # Next.js 14 frontend
│   ├── locales/
│   │   ├── en/            # English translations
│   │   └── tr/            # Turkish translations
│   └── src/
│       ├── app/           # App Router pages
│       ├── components/    # Reusable components
│       ├── lib/           # API clients & utilities
│       └── stores/        # Zustand state management
└── shared/                # Shared TypeScript types
    └── src/types/         # Common interfaces
```

## 🧪 Testing Features

### 1. Authentication Flow

```bash
# Register a new user
POST http://localhost:3001/api/auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "preferredLanguage": "tr"
}

# Login
POST http://localhost:3001/api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Create a Bilingual Quiz

Using the frontend:
1. Login at `/en/auth/login` or `/tr/auth/login`
2. Navigate to `/en/create` or `/tr/create`
3. Fill in both English and Turkish content
4. Add items with localized labels
5. Publish the quiz

### 3. Play a Quiz

1. Visit `/en/explore` or `/tr/explore`
2. Click on any quiz card
3. Click "Play Now"
4. Make your selections
5. View results with localized content

### 4. Language-Specific API Requests

```bash
# Get quizzes in English
GET http://localhost:3001/api/quizzes?lang=en

# Get quizzes in Turkish
GET http://localhost:3001/api/quizzes?lang=tr

# With Accept-Language header
GET http://localhost:3001/api/quizzes
Headers: Accept-Language: tr
```

## 🔧 Useful Commands

### Backend

```bash
cd backend

# Development
npm run dev              # Start with hot reload
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio

# Testing & Linting
npm run lint             # Lint code
npm run test             # Run tests
```

### Frontend

```bash
cd frontend

# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Utilities
npm run lint             # Lint code
npm run type-check       # TypeScript check
```

## 🐛 Troubleshooting

### Database Connection Issues

**Error:** `Can't reach database server`

**Solution:**
1. Ensure PostgreSQL is running: `pg_ctl status`
2. Check your DATABASE_URL in `backend/.env`
3. Verify database exists: `psql -l | grep uwufufu`

### Port Already in Use

**Error:** `Port 3000/3001 is already in use`

**Solution:**
```bash
# Find process using the port
lsof -i :3000
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or change the port in .env files
```

### Prisma Client Issues

**Error:** `@prisma/client did not initialize yet`

**Solution:**
```bash
cd backend
npm run prisma:generate
```

### Missing Translations

**Error:** Page shows translation keys like `home.hero.title`

**Solution:**
1. Check that locale files exist: `frontend/locales/en/common.json` and `frontend/locales/tr/common.json`
2. Restart the frontend dev server
3. Clear Next.js cache: `rm -rf frontend/.next`

### CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
1. Ensure backend `FRONTEND_URL` in `.env` matches your frontend URL
2. Check backend `main.ts` CORS configuration
3. Restart backend server

## 🚀 Production Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your production API URL
4. Deploy

### Backend (Railway/Render)

1. Create new project
2. Connect GitHub repository
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm run start`
5. Add environment variables from `backend/.env.example`
6. Add PostgreSQL database addon
7. Run migrations: `npx prisma migrate deploy`
8. Seed database: `npx prisma db seed`

### Database (Supabase/Railway)

1. Create PostgreSQL database
2. Copy connection string
3. Update `DATABASE_URL` in backend environment
4. Run migrations

## 📚 API Documentation

### Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-api-domain.com/api`

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Get current user |
| POST | `/auth/logout` | Logout user |

### Quiz Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quizzes` | List quizzes (with filters) |
| GET | `/quizzes/:slug` | Get quiz details |
| POST | `/quizzes` | Create quiz (auth required) |
| PUT | `/quizzes/:id` | Update quiz |
| DELETE | `/quizzes/:id` | Delete quiz |

### Vote Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/votes/worldcup` | Submit worldcup vote |
| POST | `/votes/smash-or-pass` | Submit smash or pass vote |
| GET | `/votes/results/:quizId` | Get quiz results |

### Social Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/social/quizzes/:id/like` | Like quiz |
| DELETE | `/social/quizzes/:id/like` | Unlike quiz |
| POST | `/social/quizzes/:id/bookmark` | Bookmark quiz |
| DELETE | `/social/quizzes/:id/bookmark` | Remove bookmark |
| GET | `/social/quizzes/:id/comments` | Get comments |
| POST | `/social/comments` | Create comment |

All endpoints support the `lang` query parameter (`en` or `tr`) and `Accept-Language` header for localized responses.

## 🎯 Key Features Demonstrated

✅ **Full Bilingual Support (TR/EN)**
- All UI text localized
- Database content in both languages
- Language switcher in header
- Persistent language preference
- Auto-detection on first visit

✅ **Complete Authentication**
- JWT with access & refresh tokens
- Protected routes
- User preferences saved

✅ **Interactive Quizzes**
- Multiple quiz types (worldcup, smash or pass, etc.)
- Real-time voting
- Results with statistics
- Responsive design

✅ **Social Features**
- Likes and bookmarks
- Comments with threading
- User profiles
- Quiz sharing

✅ **Modern Stack**
- Next.js 14 App Router
- NestJS with TypeScript
- Prisma ORM
- PostgreSQL
- Zustand state management
- Tailwind CSS

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments
3. Check the console for error messages
4. Refer to the official documentation:
   - [Next.js](https://nextjs.org/docs)
   - [NestJS](https://docs.nestjs.com/)
   - [Prisma](https://www.prisma.io/docs)
   - [next-intl](https://next-intl-docs.vercel.app/)

---

**Happy coding! 🎉**
