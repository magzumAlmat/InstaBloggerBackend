'use strict';

const db = require('../models');
const bcrypt = require('bcryptjs');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function downloadImage(url, folder, prefix) {
  const filename = `${prefix}-${uuidv4().slice(0, 8)}.jpg`;
  const filepath = path.join(__dirname, '..', 'uploads', folder, filename);
  try {
    await downloadFile(url, filepath);
    console.log(`  ✅ Downloaded: ${folder}/${filename}`);
    return `/uploads/${folder}/${filename}`;
  } catch (err) {
    console.log(`  ⚠️  Failed to download ${url}: ${err.message}`);
    return null;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────
// Data: 20 Bloggers
// ─────────────────────────────────────────

const bloggers = [
  {
    email: 'alina.beauty@gmail.com',
    ig_username: 'alina_beauty_kz',
    bio: 'Бьюти-блогер из Алматы 💄 Обзоры косметики, макияж, уход за кожей. 150K подписчиков.',
    rating: 4.8,
    followers_count: 150000,
    stories_views_percent: 12.5,   // 12.5% подписчиков смотрят сторис = ~18 750 чел
    reels_views_percent: 38.0,     // 38% от подписчиков смотрят рилсы
    likes_percent: 8.5,            // 8.5% лайков от подписчиков
    reach: 18750,                  // охват — уникальные просмотры сторис
    impressions: 28125,            // просмотры (с повторами, ~1.5x охвата)
    engagement_rate: 5.2,          // 5.2% взаимодействие
  },
  {
    email: 'damir.travel@gmail.com',
    ig_username: 'damir_explores',
    bio: 'Тревел-блогер 🌍 Путешествую по Казахстану и Центральной Азии. 200K подписчиков.',
    rating: 4.9,
    followers_count: 200000,
    stories_views_percent: 10.0,
    reels_views_percent: 45.0,
    likes_percent: 7.2,
    reach: 20000,
    impressions: 34000,
    engagement_rate: 6.1,
  },
  {
    email: 'madina.food@gmail.com',
    ig_username: 'madina_foodie',
    bio: 'Фуд-блогер 🍕 Обзоры ресторанов Астаны и рецепты. 180K подписчиков.',
    rating: 4.7,
    followers_count: 180000,
    stories_views_percent: 11.0,
    reels_views_percent: 42.0,
    likes_percent: 9.0,
    reach: 19800,
    impressions: 31680,
    engagement_rate: 5.8,
  },
  {
    email: 'arman.fitness@gmail.com',
    ig_username: 'arman_fit',
    bio: 'Фитнес-тренер и блогер 💪 Тренировки, питание, мотивация. 120K подписчиков.',
    rating: 4.6,
    followers_count: 120000,
    stories_views_percent: 14.0,
    reels_views_percent: 35.0,
    likes_percent: 10.5,
    reach: 16800,
    impressions: 23520,
    engagement_rate: 7.3,
  },
  {
    email: 'assel.fashion@gmail.com',
    ig_username: 'assel_style',
    bio: 'Fashion-блогер 👗 Тренды моды, стритстайл, шопинг-гиды. 250K подписчиков.',
    rating: 4.9,
    followers_count: 250000,
    stories_views_percent: 9.5,
    reels_views_percent: 40.0,
    likes_percent: 7.8,
    reach: 23750,
    impressions: 38000,
    engagement_rate: 4.9,
  },
  {
    email: 'nursultan.tech@gmail.com',
    ig_username: 'nurs_techreview',
    bio: 'Техноблогер 📱 Обзоры гаджетов, IT-новости, распаковки. 95K подписчиков.',
    rating: 4.5,
    followers_count: 95000,
    stories_views_percent: 13.0,
    reels_views_percent: 48.0,
    likes_percent: 11.0,
    reach: 12350,
    impressions: 19760,
    engagement_rate: 6.8,
  },
  {
    email: 'diana.lifestyle@gmail.com',
    ig_username: 'diana_daily',
    bio: 'Лайфстайл-блогер ✨ Мой день, влоги, рекомендации. 170K подписчиков.',
    rating: 4.7,
    followers_count: 170000,
    stories_views_percent: 11.5,
    reels_views_percent: 36.0,
    likes_percent: 8.0,
    reach: 19550,
    impressions: 29325,
    engagement_rate: 5.5,
  },
  {
    email: 'timur.auto@gmail.com',
    ig_username: 'timur_auto_kz',
    bio: 'Автоблогер 🚗 Тест-драйвы, обзоры авто, новости автомира. 130K подписчиков.',
    rating: 4.4,
    followers_count: 130000,
    stories_views_percent: 8.5,
    reels_views_percent: 32.0,
    likes_percent: 6.5,
    reach: 11050,
    impressions: 18785,
    engagement_rate: 4.2,
  },
  {
    email: 'kamila.mom@gmail.com',
    ig_username: 'kamila_mama',
    bio: 'Мамочка-блогер 👶 Воспитание, развитие детей, лайфхаки для мам. 160K подписчиков.',
    rating: 4.8,
    followers_count: 160000,
    stories_views_percent: 15.0,
    reels_views_percent: 33.0,
    likes_percent: 12.0,
    reach: 24000,
    impressions: 33600,
    engagement_rate: 7.8,
  },
  {
    email: 'berik.sport@gmail.com',
    ig_username: 'berik_sportlife',
    bio: 'Спортивный блогер ⚽ Футбол, бокс, UFC. Аналитика и прогнозы. 110K подписчиков.',
    rating: 4.3,
    followers_count: 110000,
    stories_views_percent: 9.0,
    reels_views_percent: 28.0,
    likes_percent: 7.0,
    reach: 9900,
    impressions: 16830,
    engagement_rate: 3.9,
  },
  {
    email: 'aigul.art@gmail.com',
    ig_username: 'aigul_creative',
    bio: 'Арт-блогер 🎨 Живопись, иллюстрации, творческие процессы. 85K подписчиков.',
    rating: 4.6,
    followers_count: 85000,
    stories_views_percent: 14.5,
    reels_views_percent: 44.0,
    likes_percent: 13.0,
    reach: 12325,
    impressions: 18488,
    engagement_rate: 8.1,
  },
  {
    email: 'yerbol.music@gmail.com',
    ig_username: 'yerbol_beats',
    bio: 'Музыкальный блогер 🎵 Обзоры треков, студийные влоги, битмейкинг. 90K подписчиков.',
    rating: 4.5,
    followers_count: 90000,
    stories_views_percent: 10.0,
    reels_views_percent: 50.0,
    likes_percent: 9.5,
    reach: 9000,
    impressions: 15300,
    engagement_rate: 5.6,
  },
  {
    email: 'zarina.skincare@gmail.com',
    ig_username: 'zarina_glow',
    bio: 'Скинкэр-блогер 🧴 Уход за кожей, корейская косметика, честные обзоры. 140K подписчиков.',
    rating: 4.7,
    followers_count: 140000,
    stories_views_percent: 13.5,
    reels_views_percent: 37.0,
    likes_percent: 10.0,
    reach: 18900,
    impressions: 28350,
    engagement_rate: 6.5,
  },
  {
    email: 'aibek.gaming@gmail.com',
    ig_username: 'aibek_gamer',
    bio: 'Геймер-блогер 🎮 Стримы, обзоры игр, киберспорт. 200K подписчиков.',
    rating: 4.4,
    followers_count: 200000,
    stories_views_percent: 7.5,
    reels_views_percent: 55.0,
    likes_percent: 6.0,
    reach: 15000,
    impressions: 27000,
    engagement_rate: 3.8,
  },
  {
    email: 'dana.yoga@gmail.com',
    ig_username: 'dana_zen',
    bio: 'Йога и медитация 🧘‍♀️ Практики, ретриты, осознанность. 75K подписчиков.',
    rating: 4.8,
    followers_count: 75000,
    stories_views_percent: 16.0,
    reels_views_percent: 30.0,
    likes_percent: 14.0,
    reach: 12000,
    impressions: 16800,
    engagement_rate: 8.5,
  },
  {
    email: 'marat.photo@gmail.com',
    ig_username: 'marat_lens',
    bio: 'Фотограф-блогер 📸 Пейзажи, портреты, обучение фотографии. 160K подписчиков.',
    rating: 4.9,
    followers_count: 160000,
    stories_views_percent: 12.0,
    reels_views_percent: 41.0,
    likes_percent: 11.5,
    reach: 19200,
    impressions: 30720,
    engagement_rate: 6.9,
  },
  {
    email: 'gulnaz.cook@gmail.com',
    ig_username: 'gulnaz_kitchen',
    bio: 'Кулинарный блогер 🍰 Домашние рецепты, выпечка, казахская кухня. 190K подписчиков.',
    rating: 4.6,
    followers_count: 190000,
    stories_views_percent: 11.0,
    reels_views_percent: 39.0,
    likes_percent: 8.8,
    reach: 20900,
    impressions: 33440,
    engagement_rate: 5.4,
  },
  {
    email: 'sultan.business@gmail.com',
    ig_username: 'sultan_hustle',
    bio: 'Бизнес-блогер 💼 Стартапы, инвестиции, финансовая грамотность. 100K подписчиков.',
    rating: 4.5,
    followers_count: 100000,
    stories_views_percent: 10.5,
    reels_views_percent: 25.0,
    likes_percent: 7.5,
    reach: 10500,
    impressions: 17850,
    engagement_rate: 4.7,
  },
  {
    email: 'ainura.books@gmail.com',
    ig_username: 'ainura_reads',
    bio: 'Книжный блогер 📚 Обзоры книг, рекомендации, книжные подборки. 65K подписчиков.',
    rating: 4.7,
    followers_count: 65000,
    stories_views_percent: 15.5,
    reels_views_percent: 28.0,
    likes_percent: 12.5,
    reach: 10075,
    impressions: 15113,
    engagement_rate: 7.6,
  },
  {
    email: 'ruslan.outdoor@gmail.com',
    ig_username: 'ruslan_wild',
    bio: 'Outdoor-блогер 🏔️ Горы, походы, кемпинг, природа Казахстана. 145K подписчиков.',
    rating: 4.8,
    followers_count: 145000,
    stories_views_percent: 13.0,
    reels_views_percent: 43.0,
    likes_percent: 10.2,
    reach: 18850,
    impressions: 30160,
    engagement_rate: 6.3,
  },
];

// ─────────────────────────────────────────
// Data: 20 Brands (Заказчики)
// ─────────────────────────────────────────

const brands = [
  {
    email: 'marketing@choco.kz',
    ig_username: 'choco_kz',
    bio: 'Choco.kz — сервис доставки еды №1 в Казахстане 🍔 Ищем блогеров для коллабораций.',
    rating: 4.7,
  },
  {
    email: 'pr@kaspi.kz',
    ig_username: 'kaspi_official',
    bio: 'Kaspi.kz — суперприложение. Банк, маркетплейс, платежи. Партнёрства с инфлюенсерами.',
    rating: 4.9,
  },
  {
    email: 'brand@sulpak.kz',
    ig_username: 'sulpak_kz',
    bio: 'Sulpak — крупнейшая сеть электроники в Казахстане 📱 Обзоры и рекламные интеграции.',
    rating: 4.5,
  },
  {
    email: 'marketing@glovo.kz',
    ig_username: 'glovo_kazakhstan',
    bio: 'Glovo Казахстан — доставка всего за минуты 🛵 Ищем креативных блогеров.',
    rating: 4.4,
  },
  {
    email: 'smm@magnum.kz',
    ig_username: 'magnum_cash_carry',
    bio: 'Magnum — сеть супермаркетов 🛒 Продвижение продуктов через блогеров.',
    rating: 4.3,
  },
  {
    email: 'pr@fortebank.kz',
    ig_username: 'fortebank_kz',
    bio: 'ForteBank — современный банк для современных людей 🏦 Финансовые коллаборации.',
    rating: 4.6,
  },
  {
    email: 'marketing@arbuz.kz',
    ig_username: 'arbuz_kz',
    bio: 'Arbuz.kz — онлайн-супермаркет с доставкой 🍉 Ищем фуд-блогеров для обзоров.',
    rating: 4.5,
  },
  {
    email: 'brand@technodom.kz',
    ig_username: 'technodom_kz',
    bio: 'Technodom — техника и электроника 💻 Коллаборации с техноблогерами.',
    rating: 4.4,
  },
  {
    email: 'pr@chocolife.me',
    ig_username: 'chocolife_me',
    bio: 'Chocolife — скидки и развлечения 🎉 Промо-кампании с инфлюенсерами.',
    rating: 4.2,
  },
  {
    email: 'smm@air.astana.kz',
    ig_username: 'airastana',
    bio: 'Air Astana — национальная авиакомпания ✈️ Тревел-коллаборации с блогерами.',
    rating: 4.8,
  },
  {
    email: 'marketing@wolt.kz',
    ig_username: 'wolt_kz',
    bio: 'Wolt Казахстан — доставка еды нового уровня 🍽️ Партнёрства с фуд-блогерами.',
    rating: 4.3,
  },
  {
    email: 'pr@halyk.bank',
    ig_username: 'halykbank',
    bio: 'Halyk Bank — народный банк Казахстана 🏦 Финансовые интеграции с блогерами.',
    rating: 4.7,
  },
  {
    email: 'brand@mechta.kz',
    ig_username: 'mechta_kz',
    bio: 'Мечта — сеть магазинов электроники 🖥️ Обзоры и распаковки с блогерами.',
    rating: 4.4,
  },
  {
    email: 'marketing@fitness.palace',
    ig_username: 'fitness_palace_kz',
    bio: 'Fitness Palace — премиум фитнес-клубы 🏋️ Фитнес-коллаборации с блогерами.',
    rating: 4.5,
  },
  {
    email: 'pr@marwin.kz',
    ig_username: 'marwin_club',
    bio: 'Marwin Club — детские развлекательные центры 🎢 Промо через мамочек-блогеров.',
    rating: 4.3,
  },
  {
    email: 'smm@dodo.pizza.kz',
    ig_username: 'dodopizza_kz',
    bio: 'Dodo Pizza Казахстан 🍕 Ищем блогеров для обзоров и челленджей.',
    rating: 4.6,
  },
  {
    email: 'brand@lamoda.kz',
    ig_username: 'lamoda_kz',
    bio: 'Lamoda — онлайн-магазин моды 👠 Fashion-коллаборации с блогерами.',
    rating: 4.5,
  },
  {
    email: 'marketing@alma.tv',
    ig_username: 'almatv_official',
    bio: 'ALMA TV — телевидение и интернет 📺 Рекламные интеграции с контент-мейкерами.',
    rating: 4.2,
  },
  {
    email: 'pr@kinopark.kz',
    ig_username: 'kinopark_kz',
    bio: 'Kinopark — сеть кинотеатров 🎬 Премьеры и розыгрыши через блогеров.',
    rating: 4.4,
  },
  {
    email: 'smm@shoqan.cosmetics',
    ig_username: 'shoqan_beauty',
    bio: 'Shoqan Cosmetics — казахстанская косметика 💅 Бьюти-коллаборации с блогерами.',
    rating: 4.6,
  },
];

// ─────────────────────────────────────────
// Offers data for brands
// ─────────────────────────────────────────

const offerTemplates = [
  { title: 'Обзор нового меню', description: 'Нужен честный обзор нашего обновлённого меню в сторис и рилсах. Формат: 3 сторис + 1 рилс.', category: 'Еда', product_value: 50000, requirements: 'От 50K подписчиков, фуд-контент, живая аудитория.' },
  { title: 'Распаковка гаджета', description: 'Распаковка и первые впечатления от нового смартфона. Видео 2-3 минуты.', category: 'Техника', product_value: 150000, requirements: 'Техноблогер, от 80K подписчиков, качественное видео.' },
  { title: 'Тестирование приложения', description: 'Установите наше приложение, покажите процесс заказа, расскажите о впечатлениях.', category: 'IT', product_value: 80000, requirements: 'Лайфстайл или IT блогер, от 30K подписчиков.' },
  { title: 'Fashion-лукбук', description: 'Создайте 5 образов из нашей новой коллекции. Фотосессия + рилс.', category: 'Мода', product_value: 120000, requirements: 'Fashion-блогер, от 100K подписчиков, высокое качество фото.' },
  { title: 'Тренировка с продуктом', description: 'Покажите нашу спортивную линейку в деле: тренировка, обзор, отзыв.', category: 'Спорт', product_value: 70000, requirements: 'Фитнес-блогер, от 50K подписчиков, реальный спортивный контент.' },
  { title: 'Travel-влог', description: 'Создайте влог о путешествии с нашим сервисом. Маршрут на ваш выбор.', category: 'Путешествия', product_value: 200000, requirements: 'Тревел-блогер, от 100K подписчиков, профессиональная съёмка.' },
  { title: 'Детский день рождения', description: 'Покажите наш центр развлечений: аттракционы, еда, атмосфера.', category: 'Дети', product_value: 60000, requirements: 'Мамочка-блогер, от 50K подписчиков, семейный контент.' },
  { title: 'Обзор крема для лица', description: 'Тестирование крема 2 недели с ежедневными фото результата.', category: 'Красота', product_value: 40000, requirements: 'Бьюти или скинкэр-блогер, от 30K подписчиков.' },
  { title: 'Банковская карта — обзор', description: 'Расскажите о преимуществах нашей новой карты: кэшбэк, бонусы, удобство.', category: 'Финансы', product_value: 100000, requirements: 'Бизнес или лайфстайл-блогер, от 70K подписчиков.' },
  { title: 'Кинопремьера — розыгрыш', description: 'Проведите розыгрыш билетов на премьеру + сторис из кинотеатра.', category: 'Развлечения', product_value: 30000, requirements: 'Любой блогер, от 20K подписчиков, активная аудитория.' },
];

// ─────────────────────────────────────────
// Main seed function
// ─────────────────────────────────────────

async function seed() {
  try {
    console.log('\n🚀 Starting database seed...\n');

    // Sync database (force: true will drop existing tables)
    await db.sequelize.sync({ force: true });
    console.log('✅ Database synced (tables recreated)\n');

    const hashedPassword = await bcrypt.hash('Test1234!', 10);

    // ── Create Bloggers ──
    console.log('👤 Creating 20 bloggers...');
    const createdBloggers = [];
    for (let i = 0; i < bloggers.length; i++) {
      const b = bloggers[i];
      // Download avatar from picsum (random person-like images)
      const avatarSeed = 100 + i; // unique seed for each
      const avatarUrl = await downloadImage(
        `https://picsum.photos/seed/blogger${avatarSeed}/400/400`,
        'avatars',
        'blogger'
      );

      const user = await db.User.create({
        email: b.email,
        password: hashedPassword,
        role: 'BLOGGER',
        ig_username: b.ig_username,
        avatar_url: avatarUrl || '/uploads/avatars/default.jpg',
        rating: b.rating,
        is_verified: Math.random() > 0.3, // 70% verified
        bio: b.bio,
        // Instagram metrics
        followers_count: b.followers_count,
        stories_views_percent: b.stories_views_percent,
        reels_views_percent: b.reels_views_percent,
        likes_percent: b.likes_percent,
        reach: b.reach,
        impressions: b.impressions,
        engagement_rate: b.engagement_rate,
      });
      createdBloggers.push(user);
      console.log(`  👤 Blogger #${i + 1}: ${b.ig_username} (ID: ${user.id})`);

      // Create 3-5 portfolio items per blogger
      const portfolioCount = 3 + Math.floor(Math.random() * 3);
      for (let j = 0; j < portfolioCount; j++) {
        const portfolioSeed = 1000 + i * 10 + j;
        const mediaUrl = await downloadImage(
          `https://picsum.photos/seed/portfolio${portfolioSeed}/800/800`,
          'portfolio',
          'portfolio'
        );
        if (mediaUrl) {
          const attachments = [
            { media_url: mediaUrl, media_type: 'IMAGE' }
          ];
          
          const secondMediaUrl = await downloadImage(
            `https://picsum.photos/seed/portfolio${portfolioSeed + 5000}/800/800`,
            'portfolio',
            'portfolio'
          );
          if (secondMediaUrl) attachments.push({ media_url: secondMediaUrl, media_type: 'IMAGE' });

          const titles = [
            'Съемка кроссовок для Nike',
            'Интеграция уходовой косметики',
            'Реклама нового ресторана Mado',
            'Обзор фитнес-клуба',
            'Сотрудничество с локальным брендом'
          ];
          const randomTitle = titles[Math.floor(Math.random() * titles.length)];

          await db.PortfolioMedia.create({
            user_id: user.id,
            title: randomTitle,
            description: 'Подробное описание проекта: разработка сценария, подбор локации, съемка Reels на телефон и серия качественных фотографий с продуктом для повышения охватов и продаж.',
            media_url: mediaUrl,
            media_type: 'IMAGE',
            attachments: attachments
          });
        }
        await sleep(100); // avoid rate-limiting
      }
    }

    // ── Create Brands ──
    console.log('\n🏢 Creating 20 brands...');
    const createdBrands = [];
    for (let i = 0; i < brands.length; i++) {
      const b = brands[i];
      const avatarSeed = 200 + i;
      const avatarUrl = await downloadImage(
        `https://picsum.photos/seed/brand${avatarSeed}/400/400`,
        'avatars',
        'brand'
      );

      const user = await db.User.create({
        email: b.email,
        password: hashedPassword,
        role: 'BRAND',
        ig_username: b.ig_username,
        avatar_url: avatarUrl || '/uploads/avatars/default.jpg',
        rating: b.rating,
        is_verified: true, // brands are all verified
        bio: b.bio,
      });
      createdBrands.push(user);
      console.log(`  🏢 Brand #${i + 1}: ${b.ig_username} (ID: ${user.id})`);
      await sleep(100);
    }

    // ── Create Offers (2-3 per brand) ──
    console.log('\n📋 Creating offers...');
    const createdOffers = [];
    for (let i = 0; i < createdBrands.length; i++) {
      const brand = createdBrands[i];
      const offerCount = 2 + Math.floor(Math.random() * 2); // 2-3 offers
      for (let j = 0; j < offerCount; j++) {
        const template = offerTemplates[(i + j) % offerTemplates.length];
        const imageSeed = 2000 + i * 10 + j;
        const imageUrl = await downloadImage(
          `https://picsum.photos/seed/offer${imageSeed}/600/400`,
          'offers',
          'offer'
        );

        const offer = await db.Offer.create({
          title: template.title,
          description: template.description,
          category: template.category,
          product_value: template.product_value + Math.floor(Math.random() * 20000),
          requirements: template.requirements,
          image_url: imageUrl || '/uploads/offers/default.jpg',
          status: ['active', 'active', 'active', 'completed'][Math.floor(Math.random() * 4)],
          brand_id: brand.id,
        });
        createdOffers.push({ offer, brandId: brand.id });
        console.log(`  📋 Offer: "${template.title}" by ${brand.ig_username} (ID: ${offer.id})`);
        await sleep(100);
      }
    }

    // ── Create Deals (connect bloggers to offers) ──
    console.log('\n🤝 Creating deals...');
    const createdDeals = [];
    const dealStatuses = ['pending', 'accepted', 'in_progress', 'content_submitted', 'completed'];
    for (let i = 0; i < 30; i++) {
      const blogger = createdBloggers[i % createdBloggers.length];
      const offerData = createdOffers[Math.floor(Math.random() * createdOffers.length)];
      const status = dealStatuses[Math.floor(Math.random() * dealStatuses.length)];

      const deal = await db.Deal.create({
        status: status,
        report_link: status === 'completed' ? `https://instagram.com/p/example_${uuidv4().slice(0, 8)}` : null,
        report_screenshot_url: null,
        offer_id: offerData.offer.id,
        blogger_id: blogger.id,
      });
      createdDeals.push({ deal, bloggerId: blogger.id, brandId: offerData.brandId });
      console.log(`  🤝 Deal #${deal.id}: ${blogger.ig_username} ↔ Offer #${offerData.offer.id} [${status}]`);
    }

    // ── Create Reviews (for completed deals) ──
    console.log('\n⭐ Creating reviews...');
    const completedDeals = createdDeals.filter(d => d.deal.status === 'completed');
    const reviewComments = [
      'Отличная работа! Контент был на высшем уровне, обязательно обратимся снова.',
      'Профессиональный подход, всё сделано в срок. Рекомендую!',
      'Хороший блогер, но немного задержал дедлайн. В целом доволен.',
      'Превзошёл все ожидания! Креативный подход, живая подача материала.',
      'Качество контента отличное, аудитория хорошо отреагировала на интеграцию.',
      'Заказчик быстро отвечал, чётко поставил задачу. Приятно работать!',
      'Бренд предоставил все материалы вовремя, оплата без задержек.',
      'Классный продукт! Было легко создавать контент, потому что самому понравилось.',
    ];

    for (const dealData of completedDeals) {
      // Brand reviews blogger
      await db.Review.create({
        stars: 3 + Math.floor(Math.random() * 3), // 3-5 stars
        comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        deal_id: dealData.deal.id,
        from_user_id: dealData.brandId,
        to_user_id: dealData.bloggerId,
      });

      // Blogger reviews brand
      await db.Review.create({
        stars: 3 + Math.floor(Math.random() * 3),
        comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        deal_id: dealData.deal.id,
        from_user_id: dealData.bloggerId,
        to_user_id: dealData.brandId,
      });
    }
    console.log(`  ⭐ Created ${completedDeals.length * 2} reviews for ${completedDeals.length} completed deals`);

    // ── Create Messages (for deals in progress or completed) ──
    console.log('\n💬 Creating messages...');
    const messageTemplates = [
      'Привет! Рада начать сотрудничество 🙌',
      'Здравствуйте! Какой формат контента предпочитаете?',
      'Могу сделать 3 сторис + 1 рилс, подойдёт?',
      'Отлично, давайте обсудим детали. Когда дедлайн?',
      'Контент готов, отправляю на согласование!',
      'Всё выглядит отлично! Публикуйте 👍',
      'Опубликовано! Вот ссылка на пост.',
      'Спасибо за работу! Статистику пришлю завтра.',
      'Охваты отличные, давайте сделаем ещё одну интеграцию!',
      'С удовольствием! Предложите дату.',
    ];

    const activeDeals = createdDeals.filter(d =>
      ['in_progress', 'content_submitted', 'completed'].includes(d.deal.status)
    );

    let totalMessages = 0;
    for (const dealData of activeDeals) {
      const msgCount = 3 + Math.floor(Math.random() * 6); // 3-8 messages per deal
      for (let m = 0; m < msgCount; m++) {
        const senderId = m % 2 === 0 ? dealData.bloggerId : dealData.brandId;
        await db.Message.create({
          content: messageTemplates[Math.floor(Math.random() * messageTemplates.length)],
          sender_id: senderId,
          deal_id: dealData.deal.id,
        });
        totalMessages++;
      }
    }
    console.log(`  💬 Created ${totalMessages} messages for ${activeDeals.length} active deals`);

    // ── Create Notifications ──
    console.log('\n🔔 Creating notifications...');
    const notifTemplates = [
      'У вас новое предложение о сотрудничестве!',
      'Блогер принял ваш оффер!',
      'Новое сообщение в чате сделки.',
      'Контент отправлен на согласование.',
      'Сделка завершена. Оставьте отзыв!',
      'Вам оставили новый отзыв ⭐',
      'Ваш профиль был верифицирован ✅',
      'Новый оффер в вашей категории!',
    ];

    let totalNotifs = 0;
    const allUsers = [...createdBloggers, ...createdBrands];
    for (const user of allUsers) {
      const notifCount = 2 + Math.floor(Math.random() * 4); // 2-5 notifications
      for (let n = 0; n < notifCount; n++) {
        await db.Notification.create({
          message: notifTemplates[Math.floor(Math.random() * notifTemplates.length)],
          is_read: Math.random() > 0.4,
          user_id: user.id,
        });
        totalNotifs++;
      }
    }
    console.log(`  🔔 Created ${totalNotifs} notifications`);

    // ── Create Swipes ──
    console.log('\n👆 Creating swipes...');
    let totalSwipes = 0;
    for (let i = 0; i < 60; i++) {
      const brand = createdBrands[Math.floor(Math.random() * createdBrands.length)];
      const blogger = createdBloggers[Math.floor(Math.random() * createdBloggers.length)];
      await db.Swipe.create({
        brand_id: brand.id,
        blogger_id: blogger.id,
        direction: Math.random() > 0.3 ? 'right' : 'left',
      });
      totalSwipes++;
    }
    console.log(`  👆 Created ${totalSwipes} swipes`);

    // ── Summary ──
    console.log('\n' + '═'.repeat(50));
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log('═'.repeat(50));
    console.log(`  👤 Bloggers:       ${createdBloggers.length}`);
    console.log(`  🏢 Brands:         ${createdBrands.length}`);
    console.log(`  📋 Offers:         ${createdOffers.length}`);
    console.log(`  🤝 Deals:          ${createdDeals.length}`);
    console.log(`  ⭐ Reviews:        ${completedDeals.length * 2}`);
    console.log(`  💬 Messages:       ${totalMessages}`);
    console.log(`  🔔 Notifications:  ${totalNotifs}`);
    console.log(`  👆 Swipes:         ${totalSwipes}`);
    console.log(`  🖼️  Portfolio items: check uploads/portfolio/`);
    console.log('═'.repeat(50));
    console.log(`\n🔑 All users password: Test1234!\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
