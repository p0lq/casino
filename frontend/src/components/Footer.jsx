import { useI18n } from '../context/I18nContext'

export default function Footer() {
  const { t } = useI18n()

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="nav-logo">COFFE<span>SINO</span></div>
          <p>{t('footer_tagline')}</p>
        </div>
        <div className="footer-col">
          <h4>Навигация</h4>
          <ul>
            <li onClick={() => scrollTo('home')} style={{ cursor: 'pointer' }}>{t('nav_home')}</li>
            <li onClick={() => scrollTo('menu')} style={{ cursor: 'pointer' }}>{t('nav_menu')}</li>
            <li onClick={() => scrollTo('booking')} style={{ cursor: 'pointer' }}>{t('nav_booking')}</li>
            <li onClick={() => scrollTo('reviews')} style={{ cursor: 'pointer' }}>{t('nav_reviews')}</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Контакты</h4>
          <ul>
            <li>📞 +7 778 728 65 67</li>
            <li>
              <a href="https://wa.me/77787286567" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,.7)' }}>
                💬 WhatsApp
              </a>
            </li>
            <li>📍 г. Астана</li>
            <li>🕐 08:00 – 22:00</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>{t('footer_rights')}</p>
      </div>
    </footer>
  )
}
