import { Link } from 'react-router-dom'

const TABS = [
  { key: 'dashboard', icon: '📊', label: 'Обзор' },
  { key: 'menu',      icon: '🍽',  label: 'Меню' },
  { key: 'tables',    icon: '🪑',  label: 'Столики' },
  { key: 'bookings',  icon: '📅',  label: 'Брони' },
  { key: 'orders',    icon: '🧾',  label: 'Заказы' },
  { key: 'reviews',   icon: '💬',  label: 'Отзывы' },
]

export default function AdminLayout({ adminName, activePage, onNavigate, onLogout, children }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h1>COFFESINO</h1>
          <p>Панель управления</p>
        </div>
        <nav className="admin-nav">
          {TABS.map(tab => (
            <div
              key={tab.key}
              className={`admin-nav-item${activePage === tab.key ? ' active' : ''}`}
              onClick={() => onNavigate(tab.key)}
            >
              <span className="nav-icon">{tab.icon}</span> {tab.label}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/">← Вернуться на сайт</Link>
          <span style={{ color: 'rgba(255,255,255,.5)', fontSize: '.8rem', display: 'block', marginTop: '8px' }}>
            {adminName}
          </span>
          <button
            onClick={onLogout}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', fontSize: '.8rem', cursor: 'pointer', marginTop: '4px' }}
          >
            Выйти
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
