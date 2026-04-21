# 🚀 InsaBlogger: Платформа для инфлюенс-маркетинга

Инновационная мобильная платформа (iOS/Android), объединяющая рекламодателей и блогеров через систему взаимной авторизации ("Handshake").

---

### 🌟 Ключевые бизнес-процессы

1. **Взаимный Match (Handshake):**
   - Бренды и Блогеры могут свайпать друг друга в поиске.
   - Чат открывается только при обоюдном согласии (мэтче).
   - Это гарантирует высокий уровень вовлеченности обеих сторон.

2. **Push-уведомления:**
   - Мгновенные уведомления о новых лайках, запросах и мэтчах.
   - Real-time уведомления о новых сообщениях в чате.

3. **Аналитика для блогеров:**
   - Подробная Instagram-статистика прямо в профиле (охваты, ER, аудитория).
   - Портфолио с поддержкой Reels и Фото.

4. **Панель Администратора:**
   - Полный контроль над платформой: статистика пользователей, сделок и категорий.
   - Мониторинг вовлеченности в реальном времени.

---

### 🛠 Как запустить проект

**Backend-сервер:**
```bash
cd InsaBlogger
docker-compose up -d  # Запуск PostgreSQL
npm run dev           # Запуск Node.js сервера (Порт 3000)
```

**Expo Приложение:**
```bash
cd InsaBloggerExpo/my-app
npx expo start --clear
```

---

### 🔑 Тестовые доступы

**Общий пароль:** `Test1234!`

#### 📊 Панель Администратора (Dashboard)
- **Логин:** `admin@insablogger.kz`
- **Пароль:** `Admin123!`

#### 🏢 Бренды (Рекламодатели)
- **Chocofamily:** `marketing@choco.kz`
- **Kaspi.kz:** `pr@kaspi.kz`
- **Dodo Pizza:** `smm@dodo.pizza.kz`

#### 🤳 Блогеры
- **Beauty (@alina_beauty_kz):** `alina.beauty@gmail.com`
- **Travel (@damir_explores):** `damir.travel@gmail.com`
- **Food (@madina_foodie):** `madina.food@gmail.com`

---

### 📈 Стек технологий
- **Mobile:** React Native, Expo SDK 53, Lucide Icons.
- **Backend:** Node.js, Express, Sequelize ORM.
- **Database:** PostgreSQL, Docker.
- **Infrastrucure:** Expo Push API for Notifications.