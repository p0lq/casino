# COFFESINO ☕

Веб-приложение для кофейни в Астане. Онлайн-бронирование столиков, меню, оплата через Kaspi QR, колесо фортуны и панель администратора.

## Стек

| Часть | Технологии |
|-------|-----------|
| Frontend | React 18, Vite, JSX, React Router v6 |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT + bcryptjs |
| Файлы | Cloudinary + Multer |
| Оплата | Kaspi QR + AI-верификация (Anthropic Claude) |
| Deploy | Vercel (frontend) · Render (backend) |

## Структура проекта

```
casino/
├── backend/
│   ├── middleware/
│   │   ├── auth.js          # JWT middleware
│   │   └── upload.js        # Загрузка файлов (Cloudinary)
│   ├── models/
│   │   ├── User.js          # Пользователи и скидки
│   │   ├── MenuItem.js      # Позиции меню (RU/KZ/EN)
│   │   ├── Booking.js       # Брони столиков
│   │   ├── Order.js         # Заказы
│   │   ├── Table.js         # Столики
│   │   └── Review.js        # Отзывы
│   ├── routes/
│   │   ├── auth.js          # Регистрация / вход
│   │   ├── bookings.js      # Управление бронями
│   │   ├── menu.js          # CRUD меню
│   │   ├── orders.js        # Заказы
│   │   ├── payments.js      # Верификация оплаты через AI
│   │   ├── reviews.js       # Отзывы
│   │   └── tables.js        # Столики
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── main.jsx             # Точка входа
    │   ├── App.jsx              # Роутер (/ и /admin)
    │   ├── api/
    │   │   ├── config.js        # URL бэкенда
    │   │   └── index.js         # Все API-запросы
    │   ├── context/
    │   │   ├── AuthContext.jsx  # Авторизация (user, login, logout)
    │   │   ├── I18nContext.jsx  # Переводы RU / KZ / EN
    │   │   └── ToastContext.jsx # Уведомления
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Hero.jsx
    │   │   ├── Contact.jsx
    │   │   ├── Footer.jsx
    │   │   ├── menu/
    │   │   │   ├── MenuSection.jsx
    │   │   │   └── MenuCard.jsx
    │   │   ├── booking/
    │   │   │   ├── BookingSection.jsx
    │   │   │   ├── TableCard.jsx
    │   │   │   └── CartSidebar.jsx
    │   │   ├── reviews/
    │   │   │   └── ReviewsSection.jsx
    │   │   └── modals/
    │   │       ├── Modal.jsx
    │   │       ├── LoginModal.jsx
    │   │       ├── RegisterModal.jsx
    │   │       ├── PaymentModal.jsx
    │   │       ├── WheelModal.jsx
    │   │       └── MyBookingsModal.jsx
    │   └── pages/
    │       ├── Home.jsx             # Главная страница
    │       └── admin/
    │           ├── AdminPage.jsx    # Точка входа панели
    │           ├── AdminLogin.jsx
    │           ├── AdminLayout.jsx
    │           ├── Dashboard.jsx
    │           ├── MenuAdmin.jsx
    │           ├── TablesAdmin.jsx
    │           ├── BookingsAdmin.jsx
    │           ├── OrdersAdmin.jsx
    │           ├── ReviewsAdmin.jsx
    │           └── admin.css
    ├── css/
    │   └── style.css            # Глобальные стили (не менялись)
    ├── images/
    │   └── kaspi-qr.png
    ├── public/
    │   └── images/
    │       └── kaspi-qr.png
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Маршруты

| URL | Страница |
|-----|----------|
| `/` | Главная (Hero, Меню, Бронирование, Отзывы, Контакты) |
| `/admin` | Панель администратора |

## Функционал

- **Меню** — фильтрация по категориям, поддержка 3 языков
- **Бронирование** — выбор столика, даты, времени, добавление заказа из меню
- **Оплата** — Kaspi QR, загрузка скриншота, AI-верификация
- **Колесо фортуны** — при заказе от 2500₸ после оплаты
- **Отзывы** — звёздный рейтинг, модерация администратором
- **Админ-панель** — управление меню, столиками, бронями, заказами, отзывами

## Запуск

### Backend
```bash
cd backend
cp .env.example .env   # заполнить переменные
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

### Переменные окружения (backend `.env`)
```
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ANTHROPIC_API_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```
