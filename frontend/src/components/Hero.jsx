import { useI18n } from '../context/I18nContext'

export default function Hero() {
  const { t } = useI18n()

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" className="hero">
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-badge">☕ Astana, Kazakhstan</div>
        <h1>COFFESINO</h1>
        <p className="hero-sub">{t('hero_subtitle')}</p>
        <div className="hero-btns">
          <button className="btn btn-secondary" onClick={() => scrollTo('booking')}>
            {t('hero_btn_book')}
          </button>
          <button
            className="btn btn-outline"
            style={{ color: '#fff', borderColor: 'rgba(255,255,255,.5)' }}
            onClick={() => scrollTo('menu')}
          >
            {t('hero_btn_menu')}
          </button>
        </div>
      </div>
      <div className="hero-scroll">scroll</div>
    </section>
  )
}
