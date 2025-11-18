import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo users
  console.log('Creating users...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@uwufufu.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@uwufufu.com',
      passwordHash,
      role: 'admin',
      preferredLanguage: 'en',
      bio: 'Platform administrator',
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@uwufufu.com' },
    update: {},
    create: {
      username: 'demouser',
      email: 'demo@uwufufu.com',
      passwordHash,
      role: 'user',
      preferredLanguage: 'tr',
      bio: 'Demo kullanıcısı / Demo user',
    },
  });

  // Create categories
  console.log('Creating categories...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'kpop' },
      update: {},
      create: {
        slug: 'kpop',
        name_en: 'K-Pop',
        name_tr: 'K-Pop',
        description_en: 'Korean pop music groups and idols',
        description_tr: 'Kore pop müzik grupları ve idoller',
        icon: '🎵',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'anime' },
      update: {},
      create: {
        slug: 'anime',
        name_en: 'Anime',
        name_tr: 'Anime',
        description_en: 'Anime characters and series',
        description_tr: 'Anime karakterleri ve dizileri',
        icon: '🎌',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'gaming' },
      update: {},
      create: {
        slug: 'gaming',
        name_en: 'Gaming',
        name_tr: 'Oyun',
        description_en: 'Video games and gaming characters',
        description_tr: 'Video oyunları ve oyun karakterleri',
        icon: '🎮',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'movies' },
      update: {},
      create: {
        slug: 'movies',
        name_en: 'Movies',
        name_tr: 'Filmler',
        description_en: 'Movies, actors, and film characters',
        description_tr: 'Filmler, aktörler ve film karakterleri',
        icon: '🎬',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'food' },
      update: {},
      create: {
        slug: 'food',
        name_en: 'Food',
        name_tr: 'Yiyecek',
        description_en: 'Food, drinks, and cuisine',
        description_tr: 'Yemekler, içecekler ve mutfak',
        icon: '🍔',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sports' },
      update: {},
      create: {
        slug: 'sports',
        name_en: 'Sports',
        name_tr: 'Spor',
        description_en: 'Sports, athletes, and teams',
        description_tr: 'Sporlar, sporcular ve takımlar',
        icon: '⚽',
      },
    }),
  ]);

  // Create tags
  console.log('Creating tags...');
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'trending' },
      update: {},
      create: {
        slug: 'trending',
        name_en: 'Trending',
        name_tr: 'Trend',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'new' },
      update: {},
      create: {
        slug: 'new',
        name_en: 'New',
        name_tr: 'Yeni',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'popular' },
      update: {},
      create: {
        slug: 'popular',
        name_en: 'Popular',
        name_tr: 'Popüler',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'fun' },
      update: {},
      create: {
        slug: 'fun',
        name_en: 'Fun',
        name_tr: 'Eğlenceli',
      },
    }),
  ]);

  // Create demo quizzes
  console.log('Creating quizzes...');

  // Quiz 1: K-Pop Groups Worldcup
  const kpopQuiz = await prisma.quiz.create({
    data: {
      slug: 'kpop-groups-worldcup',
      type: 'worldcup',
      title_en: 'K-Pop Groups World Cup',
      title_tr: 'K-Pop Grupları Dünya Kupası',
      description_en: 'Choose your favorite K-Pop group in this epic battle!',
      description_tr: 'Bu epik savaşta favori K-Pop grubunu seç!',
      coverImageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800',
      categoryId: categories[0].id,
      createdById: demoUser.id,
      visibility: 'public',
      isNSFW: false,
      playCount: 1247,
      likeCount: 89,
      bookmarkCount: 34,
      items: {
        create: [
          {
            label_en: 'BTS',
            label_tr: 'BTS',
            imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
            orderIndex: 0,
          },
          {
            label_en: 'BLACKPINK',
            label_tr: 'BLACKPINK',
            imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
            orderIndex: 1,
          },
          {
            label_en: 'TWICE',
            label_tr: 'TWICE',
            imageUrl: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400',
            orderIndex: 2,
          },
          {
            label_en: 'EXO',
            label_tr: 'EXO',
            imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
            orderIndex: 3,
          },
          {
            label_en: 'Red Velvet',
            label_tr: 'Red Velvet',
            imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
            orderIndex: 4,
          },
          {
            label_en: 'Stray Kids',
            label_tr: 'Stray Kids',
            imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
            orderIndex: 5,
          },
          {
            label_en: 'ITZY',
            label_tr: 'ITZY',
            imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
            orderIndex: 6,
          },
          {
            label_en: 'NCT',
            label_tr: 'NCT',
            imageUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400',
            orderIndex: 7,
          },
        ],
      },
      tags: {
        create: [{ tagId: tags[0].id }, { tagId: tags[2].id }],
      },
    },
  });

  // Quiz 2: Anime Characters Smash or Pass
  const animeQuiz = await prisma.quiz.create({
    data: {
      slug: 'anime-characters-smash-or-pass',
      type: 'smash_or_pass',
      title_en: 'Anime Characters: Smash or Pass',
      title_tr: 'Anime Karakterleri: Evet mi Hayır mı',
      description_en: 'Rate these popular anime characters!',
      description_tr: 'Bu popüler anime karakterlerini değerlendir!',
      coverImageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
      categoryId: categories[1].id,
      createdById: admin.id,
      visibility: 'public',
      isNSFW: false,
      playCount: 892,
      likeCount: 67,
      bookmarkCount: 23,
      items: {
        create: [
          {
            label_en: 'Naruto Uzumaki',
            label_tr: 'Naruto Uzumaki',
            imageUrl: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400',
            orderIndex: 0,
          },
          {
            label_en: 'Mikasa Ackerman',
            label_tr: 'Mikasa Ackerman',
            imageUrl: 'https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b?w=400',
            orderIndex: 1,
          },
          {
            label_en: 'Luffy',
            label_tr: 'Luffy',
            imageUrl: 'https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3c?w=400',
            orderIndex: 2,
          },
          {
            label_en: 'Goku',
            label_tr: 'Goku',
            imageUrl: 'https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3d?w=400',
            orderIndex: 3,
          },
        ],
      },
      tags: {
        create: [{ tagId: tags[3].id }],
      },
    },
  });

  // Quiz 3: Fast Food Worldcup
  const foodQuiz = await prisma.quiz.create({
    data: {
      slug: 'fast-food-worldcup',
      type: 'worldcup',
      title_en: 'Fast Food World Cup',
      title_tr: 'Fast Food Dünya Kupası',
      description_en: 'Which fast food reigns supreme?',
      description_tr: 'Hangi fast food en iyisi?',
      coverImageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800',
      categoryId: categories[4].id,
      createdById: demoUser.id,
      visibility: 'public',
      isNSFW: false,
      playCount: 2134,
      likeCount: 156,
      bookmarkCount: 67,
      items: {
        create: [
          {
            label_en: 'Pizza',
            label_tr: 'Pizza',
            imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
            orderIndex: 0,
          },
          {
            label_en: 'Burger',
            label_tr: 'Hamburger',
            imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
            orderIndex: 1,
          },
          {
            label_en: 'Sushi',
            label_tr: 'Suşi',
            imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
            orderIndex: 2,
          },
          {
            label_en: 'Tacos',
            label_tr: 'Tako',
            imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400',
            orderIndex: 3,
          },
          {
            label_en: 'Ramen',
            label_tr: 'Ramen',
            imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
            orderIndex: 4,
          },
          {
            label_en: 'Fried Chicken',
            label_tr: 'Kızarmış Tavuk',
            imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
            orderIndex: 5,
          },
        ],
      },
      tags: {
        create: [{ tagId: tags[0].id }, { tagId: tags[2].id }, { tagId: tags[3].id }],
      },
    },
  });

  // Quiz 4: Marvel vs DC
  const moviesQuiz = await prisma.quiz.create({
    data: {
      slug: 'marvel-vs-dc-heroes',
      type: 'vs',
      title_en: 'Marvel vs DC Heroes',
      title_tr: 'Marvel vs DC Kahramanlar',
      description_en: 'The ultimate superhero showdown!',
      description_tr: 'Nihai süper kahraman kapışması!',
      coverImageUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800',
      categoryId: categories[3].id,
      createdById: admin.id,
      visibility: 'public',
      isNSFW: false,
      playCount: 1567,
      likeCount: 123,
      bookmarkCount: 45,
      items: {
        create: [
          {
            label_en: 'Spider-Man',
            label_tr: 'Örümcek Adam',
            imageUrl: 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=400',
            orderIndex: 0,
          },
          {
            label_en: 'Batman',
            label_tr: 'Yarasa Adam',
            imageUrl: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400',
            orderIndex: 1,
          },
          {
            label_en: 'Iron Man',
            label_tr: 'Demir Adam',
            imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
            orderIndex: 2,
          },
          {
            label_en: 'Superman',
            label_tr: 'Süperman',
            imageUrl: 'https://images.unsplash.com/photo-1594741158704-5a784b8e59b4?w=400',
            orderIndex: 3,
          },
        ],
      },
      tags: {
        create: [{ tagId: tags[2].id }],
      },
    },
  });

  // Create some demo votes
  console.log('Creating demo votes...');

  // Get quiz items for voting
  const kpopItems = await prisma.quizItem.findMany({
    where: { quizId: kpopQuiz.id },
    take: 2,
  });

  const foodItems = await prisma.quizItem.findMany({
    where: { quizId: foodQuiz.id },
    take: 2,
  });

  if (kpopItems.length > 0 && foodItems.length > 0) {
    await prisma.vote.createMany({
      data: [
        { quizId: kpopQuiz.id, quizItemId: kpopItems[0].id, ipHash: 'demo-hash-1', userId: demoUser.id },
        { quizId: kpopQuiz.id, quizItemId: kpopItems[1].id, ipHash: 'demo-hash-2', userId: admin.id },
        { quizId: foodQuiz.id, quizItemId: foodItems[0].id, ipHash: 'demo-hash-3', userId: demoUser.id },
        { quizId: foodQuiz.id, quizItemId: foodItems[1].id, ipHash: 'demo-hash-4', userId: admin.id },
      ],
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('\n📝 Demo accounts:');
  console.log('Admin: admin@uwufufu.com / password123');
  console.log('User: demo@uwufufu.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
