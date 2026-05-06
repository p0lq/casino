import API_URL from './config.js'

async function request(method, path, body, isForm) {
  const token = localStorage.getItem('coffesino_token')
  const opts = { method, headers: {} }
  if (token) opts.headers['Authorization'] = `Bearer ${token}`
  if (body) {
    if (isForm) { opts.body = body }
    else { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body) }
  }
  const res = await fetch(API_URL + path, opts)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

const get    = (path)       => request('GET',    path)
const post   = (path, body) => request('POST',   path, body)
const put    = (path, body) => request('PUT',    path, body)
const del    = (path)       => request('DELETE', path)
const upload = (path, form) => request('POST',   path, form, true)

export const API = {
  auth: {
    register: (d) => post('/auth/register', d),
    login:    (d) => post('/auth/login', d),
    me:       ()  => get('/auth/me'),
  },
  menu: {
    getAll:   (cat)       => get('/menu' + (cat && cat !== 'all' ? `?category=${cat}` : '')),
    adminAll: ()          => get('/menu/admin/all'),
    create:   (form)      => upload('/menu', form),
    update:   (id, form)  => request('PUT', `/menu/${id}`, form, true),
    delete:   (id)        => del(`/menu/${id}`),
  },
  tables: {
    getAll:   (date, time) => get('/tables' + (date ? `?date=${date}&time=${time}` : '')),
    adminAll: ()           => get('/tables/admin/all'),
    create:   (form)       => upload('/tables', form),
    update:   (id, form)   => request('PUT', `/tables/${id}`, form, true),
    delete:   (id)         => del(`/tables/${id}`),
  },
  bookings: {
    create:    (d)    => post('/bookings', d),
    my:        ()     => get('/bookings/my'),
    adminAll:  ()     => get('/bookings/admin/all'),
    get:       (id)   => get(`/bookings/${id}`),
    cancel:    (id)   => put(`/bookings/${id}/cancel`),
    setStatus: (id,s) => put(`/bookings/${id}/status`, { status: s }),
    spinWheel: (id)   => post(`/bookings/${id}/spin-wheel`),
  },
  orders: {
    create:    (d)    => post('/orders', d),
    adminAll:  ()     => get('/orders/admin/all'),
    setStatus: (id,s) => put(`/orders/${id}/status`, { status: s }),
  },
  reviews: {
    getAll:   ()       => get('/reviews'),
    adminAll: ()       => get('/reviews/admin/all'),
    create:   (d)      => post('/reviews', d),
    approve:  (id, a)  => put(`/reviews/${id}/approve`, { approved: a }),
    delete:   (id)     => del(`/reviews/${id}`),
  },
  payments: {
    verify:  (bookingId, form)   => upload(`/payments/verify/${bookingId}`, form),
    confirm: (bookingId, action) => put(`/payments/admin/confirm/${bookingId}`, { action }),
  },
}
