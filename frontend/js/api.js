const API = {
  async request(method, path, body, isForm) {
    const token = localStorage.getItem('coffesino_token');
    const opts = {
      method,
      headers: {}
    };
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
    if (body) {
      if (isForm) { opts.body = body; }
      else { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
    }
    const res = await fetch(CONFIG.API_URL + path, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },

  get:    (path)         => API.request('GET', path),
  post:   (path, body)   => API.request('POST', path, body),
  put:    (path, body)   => API.request('PUT', path, body),
  del:    (path)         => API.request('DELETE', path),
  upload: (path, form)   => API.request('POST', path, form, true),

  auth: {
    register: (d) => API.post('/auth/register', d),
    login:    (d) => API.post('/auth/login', d),
    me:       ()  => API.get('/auth/me')
  },
  menu: {
    getAll:   (cat)  => API.get('/menu' + (cat && cat !== 'all' ? `?category=${cat}` : '')),
    adminAll: ()     => API.get('/menu/admin/all'),
    create:   (form) => API.upload('/menu', form),
    update:   (id, form) => API.request('PUT', `/menu/${id}`, form, true),
    delete:   (id)   => API.del(`/menu/${id}`)
  },
  tables: {
    getAll:   (date, time) => API.get('/tables' + (date ? `?date=${date}&time=${time}` : '')),
    adminAll: ()     => API.get('/tables/admin/all'),
    create:   (form) => API.upload('/tables', form),
    update:   (id, form) => API.request('PUT', `/tables/${id}`, form, true),
    delete:   (id)   => API.del(`/tables/${id}`)
  },
  bookings: {
    create:   (d)    => API.post('/bookings', d),
    my:       ()     => API.get('/bookings/my'),
    adminAll: ()     => API.get('/bookings/admin/all'),
    get:      (id)   => API.get(`/bookings/${id}`),
    cancel:   (id)   => API.put(`/bookings/${id}/cancel`),
    setStatus:(id,s) => API.put(`/bookings/${id}/status`, { status: s }),
    spinWheel:(id)   => API.post(`/bookings/${id}/spin-wheel`)
  },
  orders: {
    create:   (d)    => API.post('/orders', d),
    adminAll: ()     => API.get('/orders/admin/all'),
    setStatus:(id,s) => API.put(`/orders/${id}/status`, { status: s })
  },
  reviews: {
    getAll:   ()     => API.get('/reviews'),
    adminAll: ()     => API.get('/reviews/admin/all'),
    create:   (d)    => API.post('/reviews', d),
    approve:  (id,a) => API.put(`/reviews/${id}/approve`, { approved: a }),
    delete:   (id)   => API.del(`/reviews/${id}`)
  },
  payments: {
    verify:  (bookingId, form) => API.upload(`/payments/verify/${bookingId}`, form),
    confirm: (bookingId, action) => API.put(`/payments/admin/confirm/${bookingId}`, { action })
  }
};
