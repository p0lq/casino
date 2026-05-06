import { useI18n } from '../../context/I18nContext'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'

export default function MenuCard({ item, onAddToCart }) {
  const { t, lang } = useI18n()

  const name = item.name[lang] || item.name.ru
  const desc = item.description?.[lang] || item.description?.ru || ''
  const img  = item.image || FALLBACK_IMG

  return (
    <div className="menu-card">
      <div className="menu-card-img">
        <img src={img} alt={name} loading="lazy" onError={e => { e.target.src = FALLBACK_IMG }} />
        <span className="menu-cat-badge">{t('cat_' + item.category) || item.category}</span>
      </div>
      <div className="menu-card-body">
        <h3>{name}</h3>
        {desc && <p>{desc}</p>}
        <div className="menu-card-footer">
          <span className="price">{item.price.toLocaleString()} ₸</span>
          {item.available
            ? <button className="btn btn-sm btn-primary" onClick={() => onAddToCart(item)}>{t('menu_add')}</button>
            : <span className="unavailable">{t('menu_unavailable')}</span>
          }
        </div>
      </div>
    </div>
  )
}
