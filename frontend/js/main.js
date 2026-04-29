// ─── State ───────────────────────────────────────────────────────────────────
const STATE = {
  user:          null,
  cart:          [],       // { item, qty }
  selectedTable: null,
  activeBooking: null,
  bookingDate:   '',
  bookingTime:   '',
  bookingGuests: 2
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
function saveUser(data) {
  STATE.user = data.user;
  localStorage.setItem('coffesino_token', data.token);
  localStorage.setItem('coffesino_user',  JSON.stringify(data.user));
  updateAuthUI();
}

function loadStoredUser() {
  const stored = localStorage.getItem('coffesino_user');
  if (stored) { STATE.user = JSON.parse(stored); updateAuthUI(); }
}

function logout() {
  STATE.user = null;
  localStorage.removeItem('coffesino_token');
  localStorage.removeItem('coffesino_user');
  updateAuthUI();
}

function updateAuthUI() {
  const u = STATE.user;
  document.getElementById('authBtns').style.display     = u ? 'none'  : 'flex';
  document.getElementById('userMenu').style.display      = u ? 'flex'  : 'none';
  if (u) document.getElementById('userName').textContent = u.name.split(' ')[0];
  if (u?.role === 'admin') {
    document.getElementById('adminLink').style.display = 'block';
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.disabled = true;
  try {
    const data = await API.auth.login({
      email:    document.getElementById('loginEmail').value,
      password: document.getElementById('loginPassword').value
    });
    saveUser(data);
    closeModal('loginModal');
    showToast(t('auth_welcome') + ', ' + data.user.name + '!', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  } finally { btn.disabled = false; }
}

async function handleRegister(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.disabled = true;
  try {
    const data = await API.auth.register({
      name:     document.getElementById('regName').value,
      email:    document.getElementById('regEmail').value,
      phone:    document.getElementById('regPhone').value,
      password: document.getElementById('regPassword').value
    });
    saveUser(data);
    closeModal('registerModal');
    showToast(t('auth_welcome') + ', ' + data.user.name + '!', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  } finally { btn.disabled = false; }
}

// ─── Menu ─────────────────────────────────────────────────────────────────────
async function loadMenu(category = 'all') {
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = `<div class="loading-spinner"></div>`;
  try {
    const items = await API.menu.getAll(category);
    if (!items.length) { grid.innerHTML = `<p class="empty-msg">${t('reviews_empty')}</p>`; return; }
    grid.innerHTML = items.map(item => menuCard(item)).join('');
  } catch { grid.innerHTML = `<p class="empty-msg">${t('auth_welcome')}</p>`; }
}

function menuCard(item) {
  const lang = currentLang;
  const name = item.name[lang] || item.name.ru;
  const desc = item.description?.[lang] || item.description?.ru || '';
  const img  = item.image || `https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop`;
  return `
  <div class="menu-card" data-id="${item._id}">
    <div class="menu-card-img">
      <img src="${img}" alt="${name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'">
      <span class="menu-cat-badge">${t('cat_' + item.category) || item.category}</span>
    </div>
    <div class="menu-card-body">
      <h3>${name}</h3>
      ${desc ? `<p>${desc}</p>` : ''}
      <div class="menu-card-footer">
        <span class="price">${item.price.toLocaleString()} ₸</span>
        ${item.available
          ? `<button class="btn btn-sm btn-primary" onclick="addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">${t('menu_add')}</button>`
          : `<span class="unavailable">${t('menu_unavailable')}</span>`}
      </div>
    </div>
  </div>`;
}

function addToCart(item) {
  const existing = STATE.cart.find(c => c.item._id === item._id);
  if (existing) { existing.qty++; }
  else { STATE.cart.push({ item, qty: 1 }); }
  updateCart();
  showToast(item.name[currentLang] || item.name.ru, 'success');
}

function removeFromCart(id) {
  STATE.cart = STATE.cart.filter(c => c.item._id !== id);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');

  if (!STATE.cart.length) {
    cartItems.innerHTML = `<p class="cart-empty">${t('booking_cart_empty')}</p>`;
    cartTotal.textContent = '0 ₸';
    if (cartCount) { cartCount.style.display = 'none'; }
    return;
  }

  let total = 0;
  cartItems.innerHTML = STATE.cart.map(({ item, qty }) => {
    const name = item.name[currentLang] || item.name.ru;
    const sub  = item.price * qty;
    total += sub;
    return `
    <div class="cart-item">
      <div class="cart-item-info">
        <span class="cart-item-name">${name}</span>
        <span class="cart-item-price">${item.price.toLocaleString()} ₸</span>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty('${item._id}', -1)">−</button>
        <span>${qty}</span>
        <button class="qty-btn" onclick="changeQty('${item._id}', 1)">+</button>
        <button class="remove-btn" onclick="removeFromCart('${item._id}')">✕</button>
      </div>
    </div>`;
  }).join('');

  cartTotal.textContent = total.toLocaleString() + ' ₸';
  if (cartCount) { cartCount.textContent = STATE.cart.length; cartCount.style.display = 'flex'; }
}

function changeQty(id, delta) {
  const entry = STATE.cart.find(c => c.item._id === id);
  if (!entry) return;
  entry.qty += delta;
  if (entry.qty <= 0) STATE.cart = STATE.cart.filter(c => c.item._id !== id);
  updateCart();
}

// ─── Booking ──────────────────────────────────────────────────────────────────
async function loadTables() {
  const grid    = document.getElementById('tablesGrid');
  const date    = document.getElementById('bookingDate').value;
  const time    = document.getElementById('bookingTime').value;
  STATE.bookingDate   = date;
  STATE.bookingTime   = time;
  STATE.bookingGuests = parseInt(document.getElementById('bookingGuests').value) || 2;

  grid.innerHTML = `<div class="loading-spinner"></div>`;
  try {
    const tables = await API.tables.getAll(date, time);
    if (!tables.length) { grid.innerHTML = `<p class="empty-msg">Нет доступных столиков</p>`; return; }
    grid.innerHTML = tables.map(table => tableCard(table)).join('');
  } catch { grid.innerHTML = `<p class="empty-msg">${t('common_error')}</p>`; }
}

function tableCard(table) {
  const lang = currentLang;
  const desc = table.description?.[lang] || table.description?.ru || '';
  const img  = table.image || `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop`;
  const busy = table.isBooked;
  return `
  <div class="table-card ${busy ? 'booked' : 'free'} ${STATE.selectedTable?._id === table._id ? 'selected' : ''}"
       onclick="${!busy ? `selectTable(${JSON.stringify(table).replace(/"/g, '&quot;')})` : ''}">
    <img src="${img}" alt="Стол ${table.number}" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop'">
    <div class="table-card-info">
      <div class="table-number">Стол №${table.number}</div>
      <div class="table-seats">👥 ${table.seats} ${t('booking_seats')}</div>
      ${desc ? `<div class="table-desc">${desc}</div>` : ''}
      <div class="table-status ${busy ? 'status-busy' : 'status-free'}">
        ${busy ? t('booking_booked') : t('booking_available')}
      </div>
    </div>
  </div>`;
}

function selectTable(table) {
  STATE.selectedTable = table;
  document.querySelectorAll('.table-card').forEach(el => el.classList.remove('selected'));
  event?.currentTarget?.classList.add('selected');
  loadTables();
  document.getElementById('selectedTableInfo').style.display = 'block';
  document.getElementById('selectedTableName').textContent = `Стол №${table.number} (${table.seats} мест)`;
}

async function createBooking() {
  if (!STATE.user) { showToast(t('booking_login_required'), 'warning'); openModal('loginModal'); return; }
  if (!STATE.selectedTable || !STATE.bookingDate || !STATE.bookingTime) {
    showToast(t('booking_select_first'), 'warning'); return;
  }

  const discountCode = document.getElementById('discountCode')?.value?.trim();
  try {
    const booking = await API.bookings.create({
      tableId:      STATE.selectedTable._id,
      date:         STATE.bookingDate,
      time:         STATE.bookingTime,
      guests:       STATE.bookingGuests,
      duration:     parseInt(document.getElementById('bookingDuration').value) || 2,
      discountCode: discountCode || undefined
    });
    STATE.activeBooking = booking;

    if (STATE.cart.length) {
      await API.orders.create({
        bookingId: booking._id,
        items:     STATE.cart.map(c => ({ menuItemId: c.item._id, quantity: c.qty }))
      });
    }

    showToast('Столик успешно забронирован!', 'success');
    openPaymentModal(booking);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ─── Payment ──────────────────────────────────────────────────────────────────
function openPaymentModal(booking) {
  const modal = document.getElementById('paymentModal');
  document.getElementById('paymentAmount').textContent = booking.totalAmount.toLocaleString() + ' ₸';
  document.getElementById('paymentBookingId').value = booking._id;
  document.getElementById('paymentStatus').textContent = '';
  document.getElementById('paymentStatus').className = 'payment-status';
  document.getElementById('verifyBtn').disabled = false;
  document.getElementById('screenshotFile').value = '';
  modal.classList.add('active');
}

async function verifyPayment() {
  const bookingId = document.getElementById('paymentBookingId').value;
  const file      = document.getElementById('screenshotFile').files[0];
  if (!file) { showToast('Выберите скриншот оплаты', 'warning'); return; }

  const statusEl = document.getElementById('paymentStatus');
  const btn      = document.getElementById('verifyBtn');
  btn.disabled = true;
  statusEl.textContent  = t('payment_verifying');
  statusEl.className    = 'payment-status verifying';

  const form = new FormData();
  form.append('screenshot', file);

  try {
    const result = await API.payments.verify(bookingId, form);

    if (result.status === 'confirmed') {
      statusEl.textContent = t('payment_confirmed');
      statusEl.className   = 'payment-status confirmed';
      showToast(t('payment_confirmed'), 'success');
      STATE.cart = []; updateCart();

      if (result.wheelEligible) {
        setTimeout(() => {
          closeModal('paymentModal');
          WHEEL.show(bookingId);
        }, 1500);
      }
    } else if (result.status === 'failed') {
      statusEl.textContent = t('payment_failed');
      statusEl.className   = 'payment-status failed';
      btn.disabled = false;
    } else {
      statusEl.textContent = t('payment_uploaded');
      statusEl.className   = 'payment-status uploaded';
    }
  } catch (err) {
    statusEl.textContent = err.message;
    statusEl.className   = 'payment-status failed';
    btn.disabled = false;
  }
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
async function loadReviews() {
  const container = document.getElementById('reviewsList');
  container.innerHTML = `<div class="loading-spinner"></div>`;
  try {
    const reviews = await API.reviews.getAll();
    if (!reviews.length) { container.innerHTML = `<p class="empty-msg">${t('reviews_empty')}</p>`; return; }
    container.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-header">
        <div class="review-avatar">${r.user.name.charAt(0).toUpperCase()}</div>
        <div>
          <div class="review-name">${r.user.name}</div>
          <div class="review-date">${new Date(r.createdAt).toLocaleDateString('ru-RU')}</div>
        </div>
        <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      </div>
      <p class="review-text">${r.text}</p>
    </div>`).join('');
  } catch { container.innerHTML = `<p class="empty-msg">Ошибка загрузки</p>`; }
}

async function submitReview(e) {
  e.preventDefault();
  if (!STATE.user) { showToast(t('reviews_login'), 'warning'); openModal('loginModal'); return; }
  const rating = document.querySelector('.star-btn.active')?.dataset.rating;
  const text   = document.getElementById('reviewText').value.trim();
  if (!rating || !text) { showToast('Выберите оценку и напишите отзыв', 'warning'); return; }

  try {
    await API.reviews.create({ rating: parseInt(rating), text });
    showToast(t('reviews_pending'), 'success');
    document.getElementById('reviewText').value = '';
    document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
    loadReviews();
  } catch (err) { showToast(err.message, 'error'); }
}

// ─── My Bookings ──────────────────────────────────────────────────────────────
async function openMyBookings() {
  if (!STATE.user) { openModal('loginModal'); return; }
  const modal = document.getElementById('myBookingsModal');
  const list  = document.getElementById('myBookingsList');
  list.innerHTML = `<div class="loading-spinner"></div>`;
  modal.classList.add('active');

  try {
    const bookings = await API.bookings.my();
    if (!bookings.length) { list.innerHTML = `<p class="empty-msg">${t('my_bookings_empty')}</p>`; return; }
    list.innerHTML = bookings.map(b => {
      const payBtn = (b.status === 'pending' && b.payment.status !== 'confirmed')
        ? `<button class="btn btn-sm btn-primary" onclick="openPaymentModal(${JSON.stringify(b).replace(/"/g, '&quot;')})">${t('btn_pay')}</button>` : '';
      const wheelBtn = (b.payment.status === 'confirmed' && b.totalAmount >= 2500 && !b.wheelSpun)
        ? `<button class="btn btn-sm btn-accent" onclick="closeModal('myBookingsModal');WHEEL.show('${b._id}')">${t('btn_spin')}</button>` : '';
      const cancelBtn = (b.status === 'pending')
        ? `<button class="btn btn-sm btn-outline" onclick="cancelBooking('${b._id}')">${t('btn_cancel')}</button>` : '';
      return `
      <div class="my-booking-card">
        <div class="my-booking-header">
          <strong>Стол №${b.table?.number} · ${b.date} ${b.time}</strong>
          <span class="status-badge status-${b.status}">${t('status_' + b.status)}</span>
        </div>
        <div class="my-booking-details">
          👥 ${b.guests} гостей · 💰 ${b.totalAmount.toLocaleString()} ₸
          · Оплата: <strong>${payStatusLabel(b.payment.status)}</strong>
        </div>
        <div class="my-booking-actions">${payBtn}${wheelBtn}${cancelBtn}</div>
      </div>`;
    }).join('');
  } catch { list.innerHTML = `<p class="empty-msg">Ошибка загрузки</p>`; }
}

function payStatusLabel(s) {
  return { pending: 'Ожидает', uploaded: 'На проверке', verifying: 'Проверяем', confirmed: '✓ Оплачено', failed: '✗ Не оплачено' }[s] || s;
}

async function cancelBooking(id) {
  if (!confirm('Отменить бронь?')) return;
  try {
    await API.bookings.cancel(id);
    showToast('Бронь отменена', 'success');
    openMyBookings();
  } catch (err) { showToast(err.message, 'error'); }
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function openModal(id)  { document.getElementById(id)?.classList.add('active'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3500);
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function initStars() {
  document.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.rating);
      document.querySelectorAll('.star-btn').forEach((b, i) => {
        b.classList.toggle('active', i < val);
      });
    });
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadStoredUser();
  loadMenu();
  loadReviews();
  initStars();

  // Set min date for booking
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  // Lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLang(btn.dataset.lang);
      loadMenu();
      loadReviews();
    });
  });

  // Menu category filter
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadMenu(btn.dataset.cat);
    });
  });

  // Login/Register form submit
  document.getElementById('loginForm')?.addEventListener('submit',    handleLogin);
  document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
  document.getElementById('reviewForm')?.addEventListener('submit',   submitReview);

  // Modal close on backdrop click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });

  // Switch login ↔ register
  document.getElementById('toRegister')?.addEventListener('click', () => { closeModal('loginModal'); openModal('registerModal'); });
  document.getElementById('toLogin')?.addEventListener('click',    () => { closeModal('registerModal'); openModal('loginModal'); });

  // Navbar scroll effect
  const nav = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const el = document.querySelector(a.getAttribute('href'));
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); closeModal('mobileMenu'); }
    });
  });

  // Lang change → reload dynamic content
  document.addEventListener('langChange', () => { loadMenu(); loadReviews(); });
});
