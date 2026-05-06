import { useState, useEffect } from 'react'
import { useI18n } from '../../context/I18nContext'
import { useToast } from '../../context/ToastContext'
import { API } from '../../api/index.js'
import MenuCard from './MenuCard'

const CATEGORIES = ['all', 'coffee', 'tea', 'food', 'dessert', 'drinks']

export default function MenuSection({ onAddToCart }) {
  const { t, lang } = useI18n()
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await API.menu.getAll(category)
        setItems(data)
      } catch {
        showToast(t('common_error'), 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [lang, category])

  const handleAdd = (item) => {
    onAddToCart(item)
    showToast(item.name[lang] || item.name.ru, 'success')
  }

  return (
    <section id="menu">
      <div className="section-header">
        <h2>{t('menu_title')}</h2>
        <p>{t('menu_subtitle')}</p>
      </div>

      <div className="cat-filters">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`cat-btn${category === cat ? ' active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {t('cat_' + cat)}
          </button>
        ))}
      </div>

      <div className="menu-grid" id="menuGrid">
        {loading
          ? <div className="loading-spinner" />
          : items.length === 0
            ? <p className="empty-msg">{t('reviews_empty')}</p>
            : items.map(item => (
                <MenuCard key={item._id} item={item} onAddToCart={handleAdd} />
              ))
        }
      </div>
    </section>
  )
}
