import { useEffect, useState } from 'react'
import { API } from '../../api/index.js'
import { useToast } from '../../context/ToastContext'

const PAY_LABEL = { pending:'Ожидает', uploaded:'На проверке', verifying:'Проверяется', confirmed:'✓ Оплачено', failed:'✗ Не оплачено' }

export default function Dashboard({ onConfirmPayment }) {
  const { showToast } = useToast()
  const [bookings,  setBookings]  = useState([])
  const [menuCount, setMenuCount] = useState(0)
  const [pending,   setPending]   = useState(0)
  const [reviewPending, setReviewPending] = useState(0)

  const load = async () => {
    try {
      const [b, m, r] = await Promise.all([API.bookings.adminAll(), API.menu.adminAll(), API.reviews.adminAll()])
      setBookings(b.slice(0, 10))
      setMenuCount(m.length)
      setPending(b.filter(x => x.payment.status === 'uploaded' || x.payment.status === 'verifying').length)
      setReviewPending(r.filter(x => !x.approved).length)
    } catch (e) { showToast(e.message, 'error') }
  }

  useEffect(() => { load() }, [])

  return (
    <>
      <div className="admin-header">
        <h2>Обзор</h2>
        <button className="btn btn-sm btn-outline" onClick={load}>↻ Обновить</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-val">{bookings.length}</div><div className="stat-label">Всего броней</div></div>
        <div className="stat-card"><div className="stat-val">{pending}</div><div className="stat-label">Ожидают оплаты</div></div>
        <div className="stat-card"><div className="stat-val">{menuCount}</div><div className="stat-label">Позиций в меню</div></div>
        <div className="stat-card"><div className="stat-val">{reviewPending}</div><div className="stat-label">Отзывов на модерации</div></div>
      </div>

      <div className="form-panel">
        <h3>Последние брони</h3>
        <table className="data-table">
          <thead><tr><th>Гость</th><th>Стол</th><th>Дата/Время</th><th>Сумма</th><th>Оплата</th><th>Статус</th><th>Действия</th></tr></thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>{b.user?.name || '—'}<br /><span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{b.user?.phone || ''}</span></td>
                <td>Стол №{b.table?.number || '?'}</td>
                <td>{b.date} {b.time}</td>
                <td><strong>{b.totalAmount.toLocaleString()} ₸</strong></td>
                <td>
                  <span className={`status-badge ${b.payment.status === 'confirmed' ? 'status-confirmed' : b.payment.status === 'failed' ? 'status-cancelled' : 'status-pending'}`}>
                    {PAY_LABEL[b.payment.status] || b.payment.status}
                  </span>
                </td>
                <td><span className={`status-badge status-${b.status}`}>{b.status}</span></td>
                <td>
                  {(b.payment.status === 'uploaded' || b.payment.status === 'verifying' || b.payment.status === 'failed') && (
                    <>
                      <button className="tbl-btn tbl-btn-ok"     onClick={() => onConfirmPayment(b._id, 'confirm', load)}>✓</button>
                      <button className="tbl-btn tbl-btn-reject" onClick={() => onConfirmPayment(b._id, 'reject',  load)}>✗</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
