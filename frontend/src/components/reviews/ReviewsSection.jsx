import { useState, useEffect } from 'react'
import { useI18n } from '../../context/I18nContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { API } from '../../api/index.js'

export default function ReviewsSection({ onOpenLogin }) {
  const { t } = useI18n()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')

  const loadReviews = async () => {
    setLoading(true)
    try {
      setReviews(await API.reviews.getAll())
    } catch {
      showToast(t('common_error'), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadReviews() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { showToast(t('reviews_login'), 'warning'); onOpenLogin(); return }
    if (!rating || !text.trim()) { showToast('Выберите оценку и напишите отзыв', 'warning'); return }

    try {
      await API.reviews.create({ rating, text: text.trim() })
      showToast(t('reviews_pending'), 'success')
      setText('')
      setRating(0)
      loadReviews()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <section id="reviews">
      <div className="section-header">
        <h2>{t('reviews_title')}</h2>
      </div>
      <div className="reviews-layout">
        <div className="reviews-list" id="reviewsList">
          {loading
            ? <div className="loading-spinner" />
            : reviews.length === 0
              ? <p className="empty-msg">{t('reviews_empty')}</p>
              : reviews.map(r => (
                  <div className="review-card" key={r._id}>
                    <div className="review-header">
                      <div className="review-avatar">{r.user.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="review-name">{r.user.name}</div>
                        <div className="review-date">{new Date(r.createdAt).toLocaleDateString('ru-RU')}</div>
                      </div>
                      <div className="review-stars">
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </div>
                    </div>
                    <p className="review-text">{r.text}</p>
                  </div>
                ))
          }
        </div>

        <div className="write-review-card">
          <h3>{t('reviews_write')}</h3>
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: '.85rem', color: 'var(--muted)', marginBottom: '8px' }}>{t('reviews_rating')}</p>
            <div className="stars-input">
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  type="button"
                  className={`star-btn${rating >= n ? ' active' : ''}`}
                  onClick={() => setRating(n)}
                >★</button>
              ))}
            </div>
            <textarea
              className="review-textarea"
              placeholder={t('reviews_text')}
              rows={4}
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
              {t('reviews_submit')}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
