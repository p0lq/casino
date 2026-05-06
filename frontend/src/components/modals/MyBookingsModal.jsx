import { useState, useEffect } from 'react'
import { useI18n } from '../../context/I18nContext'
import { useToast } from '../../context/ToastContext'
import { API } from '../../api/index.js'
import Modal from './Modal'

const PAY_LABELS = {
  pending: 'Ожидает', uploaded: 'На проверке',
  verifying: 'Проверяем', confirmed: '✓ Оплачено', failed: '✗ Не оплачено'
}

export default function MyBookingsModal({ isOpen, onClose, onOpenPayment, onOpenWheel }) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const load = async () => {
      setLoading(true)
      try { setBookings(await API.bookings.my()) }
      catch { showToast(t('common_error'), 'error') }
      finally { setLoading(false) }
    }
    load()
  }, [isOpen])

  const handleCancel = async (id) => {
    if (!confirm('Отменить бронь?')) return
    try {
      await API.bookings.cancel(id)
      showToast('Бронь отменена', 'success')
      setBookings(b => b.filter(x => x._id !== id))
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <Modal id="myBookingsModal" isOpen={isOpen} onClose={onClose} large>
      <h2>{t('my_bookings_title')}</h2>
      <div id="myBookingsList" style={{ marginTop: '20px' }}>
        {loading
          ? <div className="loading-spinner" />
          : bookings.length === 0
            ? <p className="empty-msg">{t('my_bookings_empty')}</p>
            : bookings.map(b => (
                <div className="my-booking-card" key={b._id}>
                  <div className="my-booking-header">
                    <strong>Стол №{b.table?.number} · {b.date} {b.time}</strong>
                    <span className={`status-badge status-${b.status}`}>{t('status_' + b.status)}</span>
                  </div>
                  <div className="my-booking-details">
                    👥 {b.guests} гостей · 💰 {b.totalAmount.toLocaleString()} ₸
                    · Оплата: <strong>{PAY_LABELS[b.payment.status] || b.payment.status}</strong>
                  </div>
                  <div className="my-booking-actions">
                    {b.status === 'pending' && b.payment.status !== 'confirmed' && (
                      <button className="btn btn-sm btn-primary" onClick={() => { onClose(); onOpenPayment(b) }}>
                        {t('btn_pay')}
                      </button>
                    )}
                    {b.payment.status === 'confirmed' && b.totalAmount >= 2500 && !b.wheelSpun && (
                      <button className="btn btn-sm btn-accent" onClick={() => { onClose(); onOpenWheel(b._id) }}>
                        {t('btn_spin')}
                      </button>
                    )}
                    {b.status === 'pending' && (
                      <button className="btn btn-sm btn-outline" onClick={() => handleCancel(b._id)}>
                        {t('btn_cancel')}
                      </button>
                    )}
                  </div>
                </div>
              ))
        }
      </div>
    </Modal>
  )
}
