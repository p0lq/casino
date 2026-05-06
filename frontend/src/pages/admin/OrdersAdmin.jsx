import { useState, useEffect } from 'react'
import { API } from '../../api/index.js'
import { useToast } from '../../context/ToastContext'

const STATUS_LABELS = { pending:'Ожидает', confirmed:'Принят', preparing:'Готовится', ready:'Готово', delivered:'Доставлен' }

export default function OrdersAdmin() {
  const { showToast } = useToast()
  const [orders, setOrders] = useState([])

  const load = async () => {
    try { setOrders(await API.orders.adminAll()) }
    catch (e) { showToast(e.message, 'error') }
  }

  useEffect(() => { load() }, [])

  const handleStatusChange = async (id, status) => {
    try { await API.orders.setStatus(id, status); showToast('Статус обновлён', 'success') }
    catch (e) { showToast(e.message, 'error') }
  }

  return (
    <>
      <div className="admin-header">
        <h2>Заказы</h2>
        <button className="btn btn-sm btn-outline" onClick={load}>↻ Обновить</button>
      </div>
      <div className="form-panel">
        <table className="data-table">
          <thead><tr><th>Гость</th><th>Дата заказа</th><th>Сумма</th><th>Статус</th><th>Действия</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td>{o.user?.name || '—'}</td>
                <td>{new Date(o.createdAt).toLocaleString('ru-RU')}</td>
                <td>{o.totalAmount.toLocaleString()} ₸</td>
                <td>
                  <span className={`status-badge status-${o.status === 'delivered' ? 'completed' : 'pending'}`}>
                    {STATUS_LABELS[o.status] || o.status}
                  </span>
                </td>
                <td>
                  <select
                    defaultValue={o.status}
                    onChange={e => handleStatusChange(o._id, e.target.value)}
                    style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '.8rem' }}
                  >
                    {Object.entries(STATUS_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
