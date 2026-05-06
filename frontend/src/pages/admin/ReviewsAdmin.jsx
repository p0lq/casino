import { useState, useEffect } from 'react'
import { API } from '../../api/index.js'
import { useToast } from '../../context/ToastContext'

export default function ReviewsAdmin() {
  const { showToast } = useToast()
  const [reviews, setReviews] = useState([])

  const load = async () => {
    try { setReviews(await API.reviews.adminAll()) }
    catch (e) { showToast(e.message, 'error') }
  }

  useEffect(() => { load() }, [])

  const handleApprove = async (id) => {
    try { await API.reviews.approve(id, true); showToast('Одобрено', 'success'); load() }
    catch (e) { showToast(e.message, 'error') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить отзыв?')) return
    try { await API.reviews.delete(id); load(); showToast('Удалено', 'success') }
    catch (e) { showToast(e.message, 'error') }
  }

  return (
    <>
      <div className="admin-header">
        <h2>Отзывы</h2>
        <button className="btn btn-sm btn-outline" onClick={load}>↻ Обновить</button>
      </div>
      <div className="form-panel">
        <table className="data-table">
          <thead><tr><th>Автор</th><th>Оценка</th><th>Текст</th><th>Дата</th><th>Статус</th><th>Действия</th></tr></thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r._id}>
                <td>{r.user?.name || '—'}</td>
                <td>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                <td style={{ maxWidth: '280px' }}>{r.text}</td>
                <td>{new Date(r.createdAt).toLocaleDateString('ru-RU')}</td>
                <td>
                  <span className={`status-badge ${r.approved ? 'status-confirmed' : 'status-pending'}`}>
                    {r.approved ? 'Опубликован' : 'На модерации'}
                  </span>
                </td>
                <td>
                  {!r.approved && (
                    <button className="tbl-btn tbl-btn-ok" onClick={() => handleApprove(r._id)}>✓ Одобрить</button>
                  )}
                  <button className="tbl-btn tbl-btn-del" onClick={() => handleDelete(r._id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
