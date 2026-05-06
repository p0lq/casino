import { useState, useEffect } from 'react'
import { API } from '../../api/index.js'
import { useToast } from '../../context/ToastContext'

const EMPTY = { nameRu:'', nameKz:'', nameEn:'', descRu:'', descKz:'', descEn:'', category:'', price:'', available:'true', image: null }

export default function MenuAdmin() {
  const { showToast } = useToast()
  const [items,   setItems]   = useState([])
  const [form,    setForm]    = useState(EMPTY)
  const [editId,  setEditId]  = useState('')
  const [msg,     setMsg]     = useState('')

  const load = async () => {
    try { setItems(await API.menu.adminAll()) }
    catch (e) { showToast(e.message, 'error') }
  }

  useEffect(() => { load() }, [])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('Сохраняем...')
    const fd = new FormData()
    fd.append('name_ru', form.nameRu); fd.append('name_kz', form.nameKz); fd.append('name_en', form.nameEn)
    fd.append('desc_ru', form.descRu); fd.append('desc_kz', form.descKz); fd.append('desc_en', form.descEn)
    fd.append('category', form.category); fd.append('price', form.price); fd.append('available', form.available)
    if (form.image) fd.append('image', form.image)
    try {
      if (editId) await API.menu.update(editId, fd); else await API.menu.create(fd)
      setMsg('✓ Сохранено!'); reset(); load()
    } catch (err) { setMsg('✗ ' + err.message) }
  }

  const reset = () => { setEditId(''); setForm(EMPTY); setMsg('') }

  const handleEdit = (item) => {
    setEditId(item._id)
    setForm({ nameRu: item.name.ru, nameKz: item.name.kz, nameEn: item.name.en,
      descRu: item.description?.ru||'', descKz: item.description?.kz||'', descEn: item.description?.en||'',
      category: item.category, price: item.price, available: item.available.toString(), image: null })
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить позицию?')) return
    try { await API.menu.delete(id); load(); showToast('Удалено', 'success') }
    catch (e) { showToast(e.message, 'error') }
  }

  return (
    <>
      <div className="admin-header"><h2>Управление меню</h2></div>
      <div className="form-panel">
        <h3>{editId ? 'Редактировать позицию' : 'Добавить позицию'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="admin-form">
            <div className="form-field"><label>Название (RU) *</label><input value={form.nameRu} onChange={set('nameRu')} required /></div>
            <div className="form-field"><label>Название (KZ) *</label><input value={form.nameKz} onChange={set('nameKz')} required /></div>
            <div className="form-field"><label>Название (EN) *</label><input value={form.nameEn} onChange={set('nameEn')} required /></div>
            <div className="form-field"><label>Описание (RU)</label><textarea value={form.descRu} onChange={set('descRu')} /></div>
            <div className="form-field"><label>Описание (KZ)</label><textarea value={form.descKz} onChange={set('descKz')} /></div>
            <div className="form-field"><label>Описание (EN)</label><textarea value={form.descEn} onChange={set('descEn')} /></div>
            <div className="form-field">
              <label>Категория *</label>
              <select value={form.category} onChange={set('category')} required>
                <option value="">— выберите —</option>
                {['coffee','tea','food','dessert','drinks','other'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field"><label>Цена (₸) *</label><input type="number" value={form.price} onChange={set('price')} min="0" step="10" required /></div>
            <div className="form-field"><label>Фото</label><input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, image: e.target.files[0] }))} /></div>
            <div className="form-field">
              <label>Доступно</label>
              <select value={form.available} onChange={set('available')}>
                <option value="true">Да</option><option value="false">Нет</option>
              </select>
            </div>
          </div>
          <div className="form-actions" style={{ marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary">Сохранить</button>
            <button type="button" className="btn btn-outline" onClick={reset}>Отмена</button>
            <span style={{ fontSize: '.85rem', color: 'var(--muted)', marginLeft: '8px' }}>{msg}</span>
          </div>
        </form>
      </div>

      <div className="form-panel">
        <h3>Позиции меню</h3>
        <table className="data-table">
          <thead><tr><th>Фото</th><th>Название</th><th>Категория</th><th>Цена</th><th>Статус</th><th>Действия</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                <td>{item.image ? <img src={item.image} alt="" /> : '—'}</td>
                <td><strong>{item.name.ru}</strong><br /><span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{item.name.en}</span></td>
                <td>{item.category}</td>
                <td>{item.price.toLocaleString()} ₸</td>
                <td><span className={`status-badge ${item.available ? 'status-confirmed' : 'status-cancelled'}`}>{item.available ? 'Доступно' : 'Скрыто'}</span></td>
                <td>
                  <button className="tbl-btn tbl-btn-edit" onClick={() => handleEdit(item)}>Изменить</button>
                  <button className="tbl-btn tbl-btn-del"  onClick={() => handleDelete(item._id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
