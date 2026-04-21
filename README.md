


Вот подробная памятка для запуска проекта и тестирования функционала:

### 1. Запуск Backend-сервера
Откройте первый терминал и выполните команды:
```bash
# Перейдите в папку бекенда
cd /Users/billionare/Documents/DEVELOPMENT/InsaBlogger

# Убедитесь, что база данных запущена через docker (если еще не запущена)
docker-compose up -d

# Запустите Node.js сервер
npm run dev
```

### 2. Запуск Мобильного приложения (Expo)
Откройте второй терминал и выполните команды:
```bash
# Перейдите в исходную папку Expo-приложения
cd /Users/billionare/Documents/DEVELOPMENT/InsaBloggerExpo/my-app

# Запустите Expo
npx expo start
```
*Нажмите `i` для запуска в iOS-симуляторе или используйте приложение Expo Go на реальном устройстве, отсканировав QR-код.*

---

### Данные для входа (Пароль для **всех** аккаунтов одинаковый)
🔑 **Пароль везде:** `Test1234!`

#### 3. Тестовые аккаунты Рекламодателей (Брендов)
Они создают Офферы (кампании) и свайпают блогеров в поиске (Discover). Выберите любой:

Chocofamily: marketing@choco.kz
Kaspi.kz: pr@kaspi.kz
Sulpak: brand@sulpak.kz
Magnum: smm@magnum.kz
Air Astana: smm@air.astana.kz
Dodo Pizza: smm@dodo.pizza.kz
Lamoda: brand@lamoda.kz

#### 4. Тестовые аккаунты Блогеров
Они откликаются на офферы брендов и видят свои новые метрики (Подписчики, охват, ER). Выберите любой:

* **Бьюти-блогер (@alina_beauty_kz):** `alina.beauty@gmail.com`
* **Тревел-блогер (@damir_explores):** `damir.travel@gmail.com`
* **Фуд-блогер (@madina_foodie):** `madina.food@gmail.com`
* **Фитнес-тренер (@arman_fit):** `arman.fitness@gmail.com`
* **Fashion-блогер (@assel_style):** `assel.fashion@gmail.com` 

> 💡 **Совет по тестированию:** Откройте симулятор за бренд (например Zara), перейдите во вкладку "Поиск" (Discover) — вы сразу увидите карточки (BloggerCard) блогеров с их метриками. А если зайти с аккаунта блогера во вкладку `Профиль`, вы увидите новый блок «Instagram Статистика» и сможете редактировать её через кнопку "Редактировать профиль".