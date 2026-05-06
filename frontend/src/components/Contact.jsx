import { useI18n } from '../context/I18nContext'

export default function Contact() {
  const { t } = useI18n()

  return (
    <section id="contact" className="section-alt">
      <div className="section-header">
        <h2>{t('contact_title')}</h2>
      </div>
      <div className="contact-layout">
        <div className="contact-info">
          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div>
              <h4>{t('contact_address_label')}</h4>
              <p>{t('contact_address')}</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <div>
              <h4>{t('contact_phone')}</h4>
              <p>
                <a href="tel:+77787286567">+7 778 728 65 67</a><br />
                <a href="https://wa.me/77787286567" target="_blank" rel="noopener">
                  💬 Написать в WhatsApp
                </a>
              </p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">🕐</div>
            <div>
              <h4>{t('contact_hours')}</h4>
              <p>{t('contact_hours_val')}</p>
            </div>
          </div>
        </div>
        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d185006.0!2d71.3!3d51.18!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424585a023ee7c0f%3A0xab5e52e788fa2c0a!2z0JDRgdGC0LDQvdCw!5e0!3m2!1sru!2skz!4v1"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Карта"
          />
        </div>
      </div>
    </section>
  )
}
