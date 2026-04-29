const TRANSLATIONS = {
  en: {
    nav_home: 'Home', nav_menu: 'Menu', nav_booking: 'Booking', nav_reviews: 'Reviews', nav_contact: 'Contact',
    hero_subtitle: 'Where every cup tells a story',
    hero_btn_book: 'Book a Table', hero_btn_menu: 'Our Menu',
    menu_title: 'Our Menu', menu_subtitle: 'Crafted with love, served with passion',
    cat_all: 'All', cat_coffee: 'Coffee', cat_tea: 'Tea', cat_food: 'Food', cat_dessert: 'Desserts', cat_drinks: 'Drinks',
    menu_add: 'Add to Order', menu_unavailable: 'Unavailable',
    booking_title: 'Reserve a Table', booking_subtitle: 'Book your perfect moment',
    booking_select_table: 'Choose a Table', booking_date: 'Date', booking_time: 'Time',
    booking_guests: 'Guests', booking_duration: 'Duration', booking_hours: 'hrs',
    booking_order_title: 'Add to Your Order', booking_cart_title: 'Your Order',
    booking_cart_empty: 'Nothing added yet', booking_total: 'Total',
    booking_pay: 'Proceed to Payment', booking_book: 'Book Table',
    booking_seats: 'seats', booking_booked: 'Occupied', booking_available: 'Available',
    booking_login_required: 'Please sign in to make a booking',
    booking_select_first: 'Select table, date and time first',
    payment_title: 'Payment via Kaspi QR',
    payment_amount: 'Amount to pay', payment_instruction: 'Open Kaspi app → Scan QR → Pay the exact amount',
    payment_upload: 'Upload screenshot of payment', payment_choose: 'Choose File',
    payment_verify: 'Confirm Payment', payment_verifying: 'Verifying...',
    payment_confirmed: '✓ Payment confirmed!', payment_failed: '✗ Payment not confirmed. Try again or contact us.',
    payment_uploaded: 'Screenshot saved. Admin will verify shortly.',
    wheel_title: '🎰 Wheel of Fortune!', wheel_subtitle: 'Your order is over 2500₸ — Try your luck!',
    wheel_spin: 'SPIN!', wheel_almost: 'SO CLOSE! Almost won! 😱',
    wheel_win: 'You won a 10% discount!', wheel_code: 'Your promo code:',
    wheel_valid: 'Valid for 30 days', wheel_next: 'Use on your next visit!',
    reviews_title: "What Our Guests Say", reviews_write: 'Write a Review',
    reviews_rating: 'Rating', reviews_text: 'Your review', reviews_submit: 'Submit',
    reviews_pending: 'Review submitted! Awaiting moderation.', reviews_empty: 'Be the first to leave a review!',
    reviews_login: 'Sign in to leave a review',
    contact_title: 'Find Us', contact_address: 'Astana, Kazakhstan (address coming soon)',
    contact_phone: 'Phone / WhatsApp', contact_hours: 'Hours', contact_hours_val: 'Mon–Sun: 08:00 – 22:00',
    auth_login: 'Sign In', auth_register: 'Sign Up', auth_logout: 'Sign Out',
    auth_name: 'Full Name', auth_email: 'Email', auth_phone: 'Phone (optional)', auth_password: 'Password',
    auth_login_btn: 'Sign In', auth_reg_btn: 'Create Account',
    auth_have_acc: 'Already have an account?', auth_no_acc: "Don't have an account?",
    auth_my_bookings: 'My Bookings', auth_welcome: 'Welcome',
    my_bookings_title: 'My Bookings', my_bookings_empty: 'No bookings yet',
    status_pending: 'Pending', status_confirmed: 'Confirmed', status_cancelled: 'Cancelled', status_completed: 'Completed',
    btn_cancel: 'Cancel', btn_close: 'Close', btn_pay: 'Pay', btn_spin: 'Spin Wheel',
    discount_placeholder: 'Promo code (optional)',
    footer_tagline: 'Where every cup tells a story', footer_rights: '© 2025 COFFESINO. All rights reserved.'
  },
  ru: {
    nav_home: 'Главная', nav_menu: 'Меню', nav_booking: 'Бронирование', nav_reviews: 'Отзывы', nav_contact: 'Контакты',
    hero_subtitle: 'Где каждая чашка рассказывает историю',
    hero_btn_book: 'Забронировать столик', hero_btn_menu: 'Наше меню',
    menu_title: 'Наше Меню', menu_subtitle: 'Приготовлено с любовью, подано с душой',
    cat_all: 'Всё', cat_coffee: 'Кофе', cat_tea: 'Чай', cat_food: 'Еда', cat_dessert: 'Десерты', cat_drinks: 'Напитки',
    menu_add: 'Добавить в заказ', menu_unavailable: 'Недоступно',
    booking_title: 'Забронировать Столик', booking_subtitle: 'Зарезервируйте свой идеальный момент',
    booking_select_table: 'Выбрать столик', booking_date: 'Дата', booking_time: 'Время',
    booking_guests: 'Гости', booking_duration: 'Длительность', booking_hours: 'ч',
    booking_order_title: 'Добавить к заказу', booking_cart_title: 'Ваш заказ',
    booking_cart_empty: 'Пока ничего не добавлено', booking_total: 'Итого',
    booking_pay: 'Перейти к оплате', booking_book: 'Забронировать',
    booking_seats: 'мест', booking_booked: 'Занят', booking_available: 'Свободен',
    booking_login_required: 'Войдите, чтобы забронировать столик',
    booking_select_first: 'Сначала выберите столик, дату и время',
    payment_title: 'Оплата через Kaspi QR',
    payment_amount: 'Сумма к оплате', payment_instruction: 'Откройте Kaspi → Сканируйте QR → Оплатите точную сумму',
    payment_upload: 'Загрузите скриншот оплаты', payment_choose: 'Выбрать файл',
    payment_verify: 'Подтвердить оплату', payment_verifying: 'Проверяем...',
    payment_confirmed: '✓ Оплата подтверждена!', payment_failed: '✗ Оплата не подтверждена. Попробуйте снова или свяжитесь с нами.',
    payment_uploaded: 'Скриншот сохранён. Администратор проверит в ближайшее время.',
    wheel_title: '🎰 Колесо Фортуны!', wheel_subtitle: 'Ваш заказ превысил 2500₸ — Испытайте удачу!',
    wheel_spin: 'КРУТИТЬ!', wheel_almost: 'ТАК БЛИЗКО! Почти повезло! 😱',
    wheel_win: 'Вы выиграли скидку 10%!', wheel_code: 'Ваш промокод:',
    wheel_valid: 'Действует 30 дней', wheel_next: 'Используйте при следующем визите!',
    reviews_title: 'Отзывы Наших Гостей', reviews_write: 'Написать отзыв',
    reviews_rating: 'Оценка', reviews_text: 'Ваш отзыв', reviews_submit: 'Отправить',
    reviews_pending: 'Отзыв отправлен! Ожидает модерации.', reviews_empty: 'Будьте первым, кто оставит отзыв!',
    reviews_login: 'Войдите, чтобы оставить отзыв',
    contact_title: 'Найдите Нас', contact_address: 'г. Астана, Казахстан (адрес уточняется)',
    contact_phone: 'Телефон / WhatsApp', contact_hours: 'Режим работы', contact_hours_val: 'Пн–Вс: 08:00 – 22:00',
    auth_login: 'Войти', auth_register: 'Регистрация', auth_logout: 'Выйти',
    auth_name: 'Полное имя', auth_email: 'Email', auth_phone: 'Телефон (необязательно)', auth_password: 'Пароль',
    auth_login_btn: 'Войти', auth_reg_btn: 'Создать аккаунт',
    auth_have_acc: 'Уже есть аккаунт?', auth_no_acc: 'Нет аккаунта?',
    auth_my_bookings: 'Мои брони', auth_welcome: 'Добро пожаловать',
    my_bookings_title: 'Мои Брони', my_bookings_empty: 'У вас пока нет броней',
    status_pending: 'Ожидает', status_confirmed: 'Подтверждено', status_cancelled: 'Отменено', status_completed: 'Завершено',
    btn_cancel: 'Отменить', btn_close: 'Закрыть', btn_pay: 'Оплатить', btn_spin: 'Крутить колесо',
    discount_placeholder: 'Промокод (необязательно)',
    footer_tagline: 'Где каждая чашка рассказывает историю', footer_rights: '© 2025 COFFESINO. Все права защищены.'
  },
  kz: {
    nav_home: 'Басты', nav_menu: 'Мәзір', nav_booking: 'Брондау', nav_reviews: 'Пікірлер', nav_contact: 'Байланыс',
    hero_subtitle: 'Әр кесе өз тарихын айтады',
    hero_btn_book: 'Үстел брондау', hero_btn_menu: 'Біздің мәзір',
    menu_title: 'Біздің Мәзір', menu_subtitle: 'Сүйіспеншілікпен дайындалған',
    cat_all: 'Барлығы', cat_coffee: 'Кофе', cat_tea: 'Шай', cat_food: 'Тағам', cat_dessert: 'Десерттер', cat_drinks: 'Сусындар',
    menu_add: 'Тапсырысқа қосу', menu_unavailable: 'Қол жетімсіз',
    booking_title: 'Үстел Брондау', booking_subtitle: 'Өз сәтіңізді резервтеңіз',
    booking_select_table: 'Үстел таңдау', booking_date: 'Күн', booking_time: 'Уақыт',
    booking_guests: 'Қонақтар', booking_duration: 'Ұзақтығы', booking_hours: 'сағ',
    booking_order_title: 'Тапсырысқа қосу', booking_cart_title: 'Тапсырысыңыз',
    booking_cart_empty: 'Әлі ештеңе қосылмаған', booking_total: 'Барлығы',
    booking_pay: 'Төлемге өту', booking_book: 'Брондау',
    booking_seats: 'орын', booking_booked: 'Бос емес', booking_available: 'Бос',
    booking_login_required: 'Брондау үшін жүйеге кіріңіз',
    booking_select_first: 'Алдымен үстел, күн және уақытты таңдаңыз',
    payment_title: 'Kaspi QR арқылы төлем',
    payment_amount: 'Төлем сомасы', payment_instruction: 'Kaspi ашыңыз → QR сканерлеңіз → Дәл соманы төлеңіз',
    payment_upload: 'Төлем скриншотын жүктеңіз', payment_choose: 'Файл таңдау',
    payment_verify: 'Төлемді растау', payment_verifying: 'Тексерілуде...',
    payment_confirmed: '✓ Төлем расталды!', payment_failed: '✗ Төлем расталмады. Қайталап көріңіз.',
    payment_uploaded: 'Скриншот сақталды. Әкімші жақын арада тексереді.',
    wheel_title: '🎰 Бақыт Дөңгелегі!', wheel_subtitle: 'Тапсырысыңыз 2500₸ асты — Сәтіңізді сынаңыз!',
    wheel_spin: 'АЙНАЛДЫРУ!', wheel_almost: 'ОСЫ ЖАҚЫН! Жазықтай болды! 😱',
    wheel_win: 'Сіз 10% жеңілдік ұтып алдыңыз!', wheel_code: 'Промокодыңыз:',
    wheel_valid: '30 күн жарамды', wheel_next: 'Келесі келгенде қолданыңыз!',
    reviews_title: 'Қонақтарымыздың Пікірлері', reviews_write: 'Пікір жазу',
    reviews_rating: 'Баға', reviews_text: 'Пікіріңіз', reviews_submit: 'Жіберу',
    reviews_pending: 'Пікір жіберілді! Модерацияны күтіңіз.', reviews_empty: 'Алғашқы пікір қалдырыңыз!',
    reviews_login: 'Пікір қалдыру үшін жүйеге кіріңіз',
    contact_title: 'Бізді Табыңыз', contact_address: 'Астана қ., Қазақстан (мекенжай нақтылануда)',
    contact_phone: 'Телефон / WhatsApp', contact_hours: 'Жұмыс уақыты', contact_hours_val: 'Дс–Жс: 08:00 – 22:00',
    auth_login: 'Кіру', auth_register: 'Тіркелу', auth_logout: 'Шығу',
    auth_name: 'Толық аты', auth_email: 'Email', auth_phone: 'Телефон (міндетті емес)', auth_password: 'Құпия сөз',
    auth_login_btn: 'Кіру', auth_reg_btn: 'Аккаунт жасау',
    auth_have_acc: 'Аккаунтыңыз бар ма?', auth_no_acc: 'Аккаунт жоқ па?',
    auth_my_bookings: 'Брондауларым', auth_welcome: 'Қош келдіңіз',
    my_bookings_title: 'Менің Брондауларым', my_bookings_empty: 'Брондаулар жоқ',
    status_pending: 'Күтуде', status_confirmed: 'Расталды', status_cancelled: 'Болдырылмады', status_completed: 'Аяқталды',
    btn_cancel: 'Болдырмау', btn_close: 'Жабу', btn_pay: 'Төлеу', btn_spin: 'Дөңгелек айналдыру',
    discount_placeholder: 'Промокод (міндетті емес)',
    footer_tagline: 'Әр кесе өз тарихын айтады', footer_rights: '© 2025 COFFESINO. Барлық құқықтар қорғалған.'
  }
};

let currentLang = localStorage.getItem('coffesino_lang') || 'ru';

function t(key) {
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.ru[key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('coffesino_lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = t(key);
    else el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  document.dispatchEvent(new CustomEvent('langChange', { detail: { lang } }));
}

document.addEventListener('DOMContentLoaded', () => setLang(currentLang));
