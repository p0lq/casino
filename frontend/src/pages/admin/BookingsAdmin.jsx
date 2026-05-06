import { useState, useEffect } from 'react'
import { API } from '../../api/index.js'
import { useToast } from '../../context/ToastContext'

const PAY_LABEL = { pending:'Ожидает', uploaded:'На проверке', verifying:'Проверяется', confirmed:'✓ Оплачено', failed:'✗ Не оплачено' }

export default function BookingsAdmin({ onConfirmPayment }) {
  const { showToast } = useToast()
  const [bookings, setBookings] = useState([])

  const load = async () => {
    try { setBookings(await API.bookings.adminAll()) }
    catch (e) { showToast(e.message, 'error') }
  }

  useEffect(() => { load() }, [])

  return (
    <>
      <div className="admin-header">
        <h2>Брони</h2>
        <button className="btn btn-sm btn-outline" onClick={load}>↻ Обновить</button>
      </div>
      <div className="form-panel">
        <table className="data-table">
          <thead>
            <tr><th>Гость</th><th>Стол</th><th>Дата/Время</th><th>Гостей</th><th>Сумма</th><th>Оплата</th><th>Скриншот</th><th>Статус</th><th>Действия</th></tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>{b.user?.name || '—'}<br /><span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{b.user?.phone || ''}</span></td>
                <td>Стол №{b.table?.number || '?'}</td>
                <td>{b.date} {b.time}</td>
                <td>{b.guests}</td>
                <td><strong>{b.totalAmount.toLocaleString()} ₸</strong></td>
                <td>
                  <span className={`status-badge ${b.payment.status === 'confirmed' ? 'status-confirmed' : b.payment.status === 'failed' ? 'status-cancelled' : 'status-pending'}`}>
                    {PAY_LABEL[b.payment.status] || b.payment.status}
                  </span>
                </td>
                <td>
                  {b.payment.screenshotUrl
                    ? <a href={b.payment.screenshotUrl} target="_blank" rel="noopener" style={{ color: 'var(--primary)', fontWeight: 600 }}>Смотреть</a>
                    : '—'}
                </td>
                <td><span className={`status-badge status-${b.status}`}>{b.status}</span></td>
                <td>
                  {(b.payment.status === 'uploaded' || b.payment.status === 'verifying' || b.payment.status === 'failed') && (
                    <>
                      <button className="tbl-btn tbl-btn-ok"     onClick={() => onConfirmPayment(b._id, 'confirm', load)}>✓ Подтвердить</button>
                      <button className="tbl-btn tbl-btn-reject" onClick={() => onConfirmPayment(b._id, 'reject',  load)}>✗ Отклонить</button>
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
