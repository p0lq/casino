import { useState, useEffect } from 'react'
import { API } from '../../api/index.js'
import { useToast } from '../../context/ToastContext'

const EMPTY = { number:'', seats:'', available:'true', descRu:'', descKz:'', descEn:'', image: null }

export default function TablesAdmin() {
  const { showToast } = useToast()
  const [tables, setTables] = useState([])
  const [form,   setForm]   = useState(EMPTY)
  const [editId, setEditId] = useState('')
  const [msg,    setMsg]    = useState('')

  const load = async () => {
    try { setTables(await API.tables.adminAll()) }
    catch (e) { showToast(e.message, 'error') }
  }

  useEffect(() => { load() }, [])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg('Сохраняем...')
    const fd = new FormData()
    fd.append('number', form.number); fd.append('seats', form.seats); fd.append('available', form.available)
    fd.append('desc_ru', form.descRu); fd.append('desc_kz', form.descKz); fd.append('desc_en', form.descEn)
    if (form.image) fd.append('image', form.image)
    try {
      if (editId) await API.tables.update(editId, fd); else await API.tables.create(fd)
      setMsg('✓ Сохранено!'); reset(); load()
    } catch (err) { setMsg('✗ ' + err.message) }
  }

  const reset = () => { setEditId(''); setForm(EMPTY); setMsg('') }

  const handleEdit = (t) => {
    setEditId(t._id)
    setForm({ number: t.number, seats: t.seats, available: t.available.toString(),
      descRu: t.description?.ru||'', descKz: t.description?.kz||'', descEn: t.description?.en||'', image: null })
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить столик?')) return
    try { await API.tables.delete(id); load(); showToast('Удалено', 'success') }
    catch (e) { showToast(e.message, 'error') }
  }

  return (
    <>
      <div className="admin-header"><h2>Управление столиками</h2></div>
      <div className="form-panel">
        <h3>{editId ? 'Редактировать столик' : 'Добавить столик'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="admin-form">
            <div className="form-field"><label>Номер *</label><input type="number" value={form.number} onChange={set('number')} min="1" required /></div>
            <div className="form-field"><label>Мест *</label><input type="number" value={form.seats} onChange={set('seats')} min="1" max="20" required /></div>
            <div className="form-field">
              <label>Доступен</label>
              <select value={form.available} onChange={set('available')}>
                <option value="true">Да</option><option value="false">Нет</option>
              </select>
            </div>
            <div className="form-field"><label>Описание (RU)</label><input value={form.descRu} onChange={set('descRu')} /></div>
            <div className="form-field"><label>Описание (KZ)</label><input value={form.descKz} onChange={set('descKz')} /></div>
            <div className="form-field"><label>Описание (EN)</label><input value={form.descEn} onChange={set('descEn')} /></div>
            <div className="form-field"><label>Фото</label><input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, image: e.target.files[0] }))} /></div>
          </div>
          <div className="form-actions" style={{ marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary">Сохранить</button>
            <button type="button" className="btn btn-outline" onClick={reset}>Отмена</button>
            <span style={{ fontSize: '.85rem', color: 'var(--muted)', marginLeft: '8px' }}>{msg}</span>
          </div>
        </form>
      </div>

      <div className="form-panel">
        <h3>Столики</h3>
        <table className="data-table">
          <thead><tr><th>Фото</th><th>№</th><th>Мест</th><th>Описание</th><th>Статус</th><th>Действия</th></tr></thead>
          <tbody>
            {tables.map(t => (
              <tr key={t._id}>
                <td>{t.image ? <img src={t.image} alt="" /> : '—'}</td>
                <td><strong>№{t.number}</strong></td>
                <td>{t.seats}</td>
                <td>{t.description?.ru || '—'}</td>
                <td><span className={`status-badge ${t.available ? 'status-confirmed' : 'status-cancelled'}`}>{t.available ? 'Доступен' : 'Закрыт'}</span></td>
                <td>
                  <button className="tbl-btn tbl-btn-edit" onClick={() => handleEdit(t)}>Изменить</button>
                  <button className="tbl-btn tbl-btn-del"  onClick={() => handleDelete(t._id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
