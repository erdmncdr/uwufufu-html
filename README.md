# UwuFufu Clone - Bilingual Quiz Platform 🌍

A modern, full-stack quiz platform supporting **Turkish** and **English** with multiple quiz types including worldcup brackets, personality quizzes, and more.

## 🚀 Features

- **Full Bilingual Support**: Complete TR/EN localization for all UI, SEO, and user flows
- **Multiple Quiz Types**: Worldcup, Personality, Smash or Pass, VS mode, and more
- **User Authentication**: JWT-based auth with refresh tokens
- **Social Features**: Likes, bookmarks, comments, and sharing
- **Quiz Creation**: Multi-step wizard with bilingual content support
- **Admin Panel**: Content moderation and user management
- **Modern Stack**: Next.js 14, NestJS, Prisma, PostgreSQL
- **Responsive Design**: Mobile-first with Tailwind CSS

## 📁 Project Structure

```
uwufufu-clone/
├── frontend/          # Next.js 14 App Router + React + TypeScript
├── backend/           # NestJS + Prisma + PostgreSQL
├── shared/            # Shared TypeScript types and DTOs
└── package.json       # Workspace root
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **I18n**: next-intl
- **State**: Zustand
- **Forms**: React Hook Form + Zod

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT (access + refresh tokens)
- **Validation**: class-validator, class-transformer

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd uwufufu-html
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   **Backend** (`backend/.env`):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/uwufufu"
   JWT_ACCESS_SECRET="your-access-secret-change-in-production"
   JWT_REFRESH_SECRET="your-refresh-secret-change-in-production"
   JWT_ACCESS_EXPIRY="15m"
   JWT_REFRESH_EXPIRY="7d"
   PORT=3001
   FRONTEND_URL="http://localhost:3000"
   ```

   **Frontend** (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001/api"
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   cd ..
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 🌐 Language Support

The application automatically detects the user's browser language on first visit. Users can:
- Switch languages using the TR/EN toggle in the header
- Set their preferred language (saved in their profile for logged-in users)
- Guest preferences are stored in localStorage

All content including quizzes, categories, and UI elements support both languages.

## 📚 API Documentation

API endpoints are available at `http://localhost:3001/api`

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Quizzes
- `GET /api/quizzes` - List quizzes (with filters)
- `GET /api/quizzes/:slug` - Get quiz detail
- `POST /api/quizzes` - Create quiz (auth required)
- `PUT /api/quizzes/:id` - Update quiz
- `POST /api/quizzes/:id/vote` - Submit vote
- `GET /api/quizzes/:id/results` - Get results

### Social
- `POST /api/quizzes/:id/like` - Like quiz
- `POST /api/quizzes/:id/bookmark` - Bookmark quiz
- `GET /api/quizzes/:id/comments` - Get comments
- `POST /api/quizzes/:id/comments` - Add comment

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests only
npm run test --workspace=backend

# Frontend tests only
npm run test --workspace=frontend
```

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend (Railway/Render)
1. Create new project and connect repository
2. Set environment variables
3. Deploy from the `backend` directory

### Database (Supabase/Railway)
1. Create PostgreSQL database
2. Copy connection string to `DATABASE_URL`
3. Run migrations

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.
