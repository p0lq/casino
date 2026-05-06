import { useI18n } from '../../context/I18nContext'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop'

export default function TableCard({ table, selected, onSelect }) {
  const { t, lang } = useI18n()

  const desc = table.description?.[lang] || table.description?.ru || ''
  const img  = table.image || FALLBACK_IMG
  const busy = table.isBooked

  return (
    <div
      className={`table-card ${busy ? 'booked' : 'free'}${selected ? ' selected' : ''}`}
      onClick={() => !busy && onSelect(table)}
    >
      <img src={img} alt={`Стол ${table.number}`} onError={e => { e.target.src = FALLBACK_IMG }} />
      <div className="table-card-info">
        <div className="table-number">Стол №{table.number}</div>
        <div className="table-seats">👥 {table.seats} {t('booking_seats')}</div>
        {desc && <div className="table-desc">{desc}</div>}
        <div className={`table-status ${busy ? 'status-busy' : 'status-free'}`}>
          {busy ? t('booking_booked') : t('booking_available')}
        </div>
      </div>
    </div>
  )
}
