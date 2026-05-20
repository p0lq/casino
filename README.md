# COFFESINO — Система бронирования и управления кафе

Полнофункциональное веб-приложение для кафе в Астане: бронирование столиков, меню, заказы, оплата через Kaspi с **AI-верификацией** скриншотов (Claude от Anthropic), колесо фортуны с промокодами и полная админ-панель.

---

## Возможности

### Для клиентов
- **Регистрация и вход** — JWT-авторизация, личный кабинет
- **Просмотр меню** — карточки блюд с фото, категориями и ценами (RU / KZ / EN)
- **Бронирование столиков** — выбор стола, даты, времени, количества гостей и длительности; система проверки пересечений бронирований
- **Заказ еды** — добавление блюд к бронированию через корзину
- **Оплата через Kaspi** — загрузка скриншота оплаты, автоматическая проверка через AI (Claude Haiku)
- **Колесо фортуны** — доступно после подтверждённой оплаты от 2 500 ₸; выигрыш = промокод на скидку 10%
- **Промокоды** — скидки на следующее бронирование (действуют 30 дней)
- **Мои бронирования** — просмотр истории, статус оплаты, возможность отмены
- **Отзывы** — оставить и прочитать отзывы о кафе
- **Мультиязычность** — интерфейс на русском / казахском / английском

### Для администраторов (`/admin`)
- **Дашборд** — последние бронирования, ожидающие подтверждения оплаты
- **Меню** — добавить / редактировать / удалить блюда, загрузка фото через Cloudinary
- **Столики** — управление столиками (вместимость, депозит, тип)
- **Бронирования** — просмотр всех броней, ручное подтверждение / отклонение оплаты
- **Заказы** — управление заказами клиентов
- **Отзывы** — модерация отзывов

---

## Стек технологий

| Слой | Технологии |
|------|------------|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express |
| База данных | MongoDB (Mongoose) |
| AI-верификация | Anthropic Claude Haiku (`@anthropic-ai/sdk`) |
| Хранение файлов | Cloudinary |
| Авторизация | JWT (jsonwebtoken + bcryptjs) |
| Деплой backend | Render |
| Деплой frontend | Vercel |

---

## Требования перед установкой

Убедитесь, что у вас установлено:

- **Node.js** >= 18.x — скачать: [nodejs.org](https://nodejs.org)
- **npm** >= 9.x (идёт вместе с Node.js)
- Аккаунт **MongoDB Atlas** — [mongodb.com/atlas](https://www.mongodb.com/atlas) (бесплатный tier M0 подходит)
- Аккаунт **Cloudinary** — [cloudinary.com](https://cloudinary.com) (бесплатный plan)
- **Anthropic API Key** — [console.anthropic.com](https://console.anthropic.com)

---

## Установка и запуск локально

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/Alik1338/aiagent.git
cd aiagent
```

### 2. Настройте Backend

```bash
cd backend
npm install
```

Скопируйте файл переменных окружения:

```bash
# Windows (PowerShell)
copy .env.example .env

# Mac / Linux
cp .env.example .env
```

Откройте `.env` и заполните все поля:

```env
PORT=5000
MONGODB_URI=mongodb+srv://ВАШ_ПОЛЬЗОВАТЕЛЬ:ВАШ_ПАРОЛЬ@cluster.mongodb.net/coffesino
JWT_SECRET=придумайте_длинный_случайный_секрет_минимум_32_символа
CLOUDINARY_CLOUD_NAME=ваш_cloud_name
CLOUDINARY_API_KEY=ваш_api_key
CLOUDINARY_API_SECRET=ваш_api_secret
ANTHROPIC_API_KEY=sk-ant-ваш_ключ
ADMIN_EMAIL=admin@coffesino.kz
ADMIN_PASSWORD=ВашПарольАдмина
KASPI_RECIPIENT_NAME=COFFESINO
CLIENT_URL=http://localhost:5173
```

Запустите сервер:

```bash
# Режим разработки (авто-перезагрузка при изменениях)
npm run dev

# Или production-режим
npm start
```

Backend запустится на `http://localhost:5000`.  
При первом запуске автоматически создаётся аккаунт администратора с email и паролем из `.env`.

### 3. Настройте Frontend

В **новом терминале**:

```bash
cd frontend
npm install
npm run dev
```

Frontend откроется на `http://localhost:5173`.

---

## Где получить ключи

### MongoDB Atlas
1. Зарегистрируйтесь на [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Создайте бесплатный кластер (M0 Free)
3. Создайте пользователя БД в разделе **Database Access** (запомните логин и пароль)
4. В **Network Access** добавьте `0.0.0.0/0` (разрешить все IP)
5. Нажмите **Connect → Drivers**, скопируйте строку подключения в `MONGODB_URI`

### Cloudinary
1. Зарегистрируйтесь на [cloudinary.com](https://cloudinary.com)
2. В Dashboard скопируйте **Cloud Name**, **API Key**, **API Secret**
3. Вставьте в соответствующие поля `.env`

### Anthropic API Key
1. Перейдите на [console.anthropic.com](https://console.anthropic.com)
2. В разделе **API Keys** создайте новый ключ
3. Вставьте в `ANTHROPIC_API_KEY`

> **Важно:** AI используется только для верификации скриншотов Kaspi-оплаты. Если ключ не указан или AI недоступен — оплата сохраняется как "uploaded" и администратор подтверждает вручную из панели.

---

## Что устанавливает npm install

### Backend (`cd backend && npm install`)

| Пакет | Назначение |
|-------|-----------|
| `express` | HTTP-сервер и роутинг |
| `mongoose` | ORM для MongoDB |
| `jsonwebtoken` | JWT-токены авторизации |
| `bcryptjs` | Хэширование паролей |
| `cors` | CORS-заголовки |
| `dotenv` | Чтение `.env` файла |
| `cloudinary` | Загрузка изображений в облако |
| `multer` | Обработка загружаемых файлов |
| `multer-storage-cloudinary` | Прямая загрузка файлов в Cloudinary |
| `express-rate-limit` | Защита от брутфорса (200 запросов / 15 мин) |
| `@anthropic-ai/sdk` | AI-верификация скриншотов оплаты |
| `nodemon` (devDependency) | Авто-перезагрузка сервера при изменениях |

### Frontend (`cd frontend && npm install`)

| Пакет | Назначение |
|-------|-----------|
| `react` + `react-dom` | UI-библиотека |
| `react-router-dom` | Клиентский роутинг (`/` и `/admin/*`) |
| `vite` | Сборщик и dev-сервер |
| `@vitejs/plugin-react` | Поддержка JSX/React в Vite |

---

## Структура проекта

```
aiagent/
├── backend/
│   ├── middleware/
│   │   ├── auth.js          # JWT-проверка, adminOnly
│   │   └── upload.js        # Multer + Cloudinary
│   ├── models/
│   │   ├── Booking.js       # Бронирование (статус, оплата, колесо, скидки)
│   │   ├── MenuItem.js      # Позиция меню
│   │   ├── Order.js         # Заказ блюд
│   │   ├── Review.js        # Отзыв
│   │   ├── Table.js         # Столик (вместимость, депозит)
│   │   └── User.js          # Пользователь (роли, промокоды)
│   ├── routes/
│   │   ├── auth.js          # POST /register, /login, GET /me
│   │   ├── bookings.js      # CRUD броней + spin-wheel
│   │   ├── menu.js          # CRUD меню
│   │   ├── orders.js        # CRUD заказов
│   │   ├── payments.js      # Загрузка скриншота + AI-верификация
│   │   ├── reviews.js       # CRUD отзывов
│   │   └── tables.js        # CRUD столиков
│   ├── .env.example         # Шаблон переменных окружения
│   ├── render.yaml          # Конфиг деплоя на Render
│   └── server.js            # Точка входа, подключение к MongoDB
│
└── frontend/
    ├── public/
    │   └── images/
    │       └── kaspi-qr.png # QR-код для оплаты Kaspi
    ├── src/
    │   ├── api/
    │   │   ├── config.js    # BASE_URL бэкенда
    │   │   └── index.js     # Все функции API-запросов
    │   ├── context/
    │   │   ├── AuthContext.jsx   # Глобальный стейт авторизации
    │   │   ├── I18nContext.jsx   # Переводы RU / KZ / EN
    │   │   └── ToastContext.jsx  # Всплывающие уведомления
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Hero.jsx
    │   │   ├── Contact.jsx
    │   │   ├── Footer.jsx
    │   │   ├── booking/
    │   │   │   ├── BookingSection.jsx  # Список столиков + форма брони
    │   │   │   ├── TableCard.jsx
    │   │   │   └── CartSidebar.jsx     # Корзина с блюдами
    │   │   ├── menu/
    │   │   │   ├── MenuSection.jsx
    │   │   │   └── MenuCard.jsx
    │   │   ├── reviews/
    │   │   │   └── ReviewsSection.jsx
    │   │   └── modals/
    │   │       ├── LoginModal.jsx
    │   │       ├── RegisterModal.jsx
    │   │       ├── PaymentModal.jsx    # Kaspi QR + загрузка скриншота
    │   │       ├── WheelModal.jsx      # Колесо фортуны (Canvas)
    │   │       └── MyBookingsModal.jsx # История броней
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   └── admin/
    │   │       ├── AdminPage.jsx       # Роутинг внутри панели
    │   │       ├── AdminLogin.jsx
    │   │       ├── AdminLayout.jsx
    │   │       ├── Dashboard.jsx       # Брони с ожидающей оплатой
    │   │       ├── MenuAdmin.jsx
    │   │       ├── TablesAdmin.jsx
    │   │       ├── BookingsAdmin.jsx
    │   │       ├── OrdersAdmin.jsx
    │   │       └── ReviewsAdmin.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── vercel.json          # Конфиг деплоя на Vercel
    └── vite.config.js
```

---

## Маршруты приложения

| URL | Страница |
|-----|----------|
| `/` | Главная (Hero, Меню, Бронирование, Отзывы, Контакты) |
| `/admin` | Панель администратора (требует логин с ролью admin) |

---

## API — основные эндпоинты

```
POST   /api/auth/register              Регистрация нового пользователя
POST   /api/auth/login                 Вход, возвращает JWT
GET    /api/auth/me                    Данные текущего пользователя (auth)

GET    /api/menu                       Список всех позиций меню
GET    /api/tables                     Список всех столиков
GET    /api/reviews                    Список отзывов

POST   /api/bookings                   Создать бронирование (auth)
GET    /api/bookings/my                Мои бронирования (auth)
PUT    /api/bookings/:id/cancel        Отменить бронь (auth)
POST   /api/bookings/:id/spin-wheel    Крутить колесо фортуны (auth, оплата >= 2500₸)

POST   /api/orders                     Создать заказ к брони (auth)

POST   /api/payments/verify/:id        Загрузить скриншот + AI-верификация (auth)

GET    /api/bookings/admin/all         Все бронирования (admin)
PUT    /api/payments/admin/confirm/:id Подтвердить / отклонить оплату вручную (admin)
```

---

## Как работает AI-верификация оплаты

1. Клиент оплачивает через Kaspi и загружает скриншот в форму
2. Скриншот сохраняется в **Cloudinary**
3. Backend отправляет изображение в **Claude Haiku** с запросом: проверить успешность оплаты, сумму и получателя
4. AI возвращает JSON: `{ valid, amount, recipient, confidence, reason }`
5. Если `valid = true` и сумма не меньше 95% от требуемой — бронь **автоматически подтверждается**
6. Если AI не уверен — статус `"uploaded"`, администратор подтверждает вручную из **Dashboard**

---

## Деплой в продакшн

### Backend → Render
1. Загрузите репозиторий на GitHub
2. Создайте новый **Web Service** на [render.com](https://render.com)
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Добавьте все переменные из `.env` в раздел **Environment Variables** на Render

### Frontend → Vercel
1. Импортируйте репозиторий на [vercel.com](https://vercel.com)
2. Root Directory: `frontend`
3. Framework Preset: **Vite**
4. В файле `frontend/src/api/config.js` замените URL на адрес вашего Render-сервиса
5. Деплойте — Vercel автоматически запустит `npm run build`

---

## Лицензия

MIT
