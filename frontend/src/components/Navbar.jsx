import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'

export default function Navbar({ onOpenLogin, onOpenRegister, onOpenMyBookings }) {
  const { user, logout, isAdmin } = useAuth()
  const { t, lang, setLang } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <a className="nav-logo" href="#home" onClick={() => scrollTo('home')}>
        COFFE<span>SINO</span>
      </a>

      <ul className={`nav-links${mobileOpen ? ' mobile-open' : ''}`}>
        <li><a href="#home"    onClick={() => scrollTo('home')}>{t('nav_home')}</a></li>
        <li><a href="#menu"    onClick={() => scrollTo('menu')}>{t('nav_menu')}</a></li>
        <li><a href="#booking" onClick={() => scrollTo('booking')}>{t('nav_booking')}</a></li>
        <li><a href="#reviews" onClick={() => scrollTo('reviews')}>{t('nav_reviews')}</a></li>
        <li><a href="#contact" onClick={() => scrollTo('contact')}>{t('nav_contact')}</a></li>
      </ul>

      <div className="nav-right">
        <div className="lang-switcher">
          {['ru', 'kz', 'en'].map(l => (
            <button
              key={l}
              className={`lang-btn${lang === l ? ' active' : ''}`}
              onClick={() => setLang(l)}
            >
              {l === 'kz' ? 'ҚЗ' : l.toUpperCase()}
            </button>
          ))}
        </div>

        {!user ? (
          <div id="authBtns">
            <button className="btn btn-outline btn-sm" onClick={onOpenLogin}>{t('auth_login')}</button>
            <button className="btn btn-primary btn-sm" onClick={onOpenRegister}>{t('auth_register')}</button>
          </div>
        ) : (
          <div id="userMenu">
            <span id="userName">{user.name.split(' ')[0]}</span>
            <button className="btn btn-sm btn-outline" onClick={onOpenMyBookings}>{t('auth_my_bookings')}</button>
            {isAdmin && (
              <Link to="/admin" className="admin-link">⚙ Админ</Link>
            )}
            <button
              className="btn btn-sm"
              style={{ background: 'transparent', color: 'var(--muted)' }}
              onClick={logout}
            >
              {t('auth_logout')}
            </button>
          </div>
        )}

        <button
          className="burger"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
