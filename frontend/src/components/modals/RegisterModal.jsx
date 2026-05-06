import { useState } from 'react'
import { useI18n } from '../../context/I18nContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { API } from '../../api/index.js'
import Modal from './Modal'

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const { t } = useI18n()
  const { login } = useAuth()
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await API.auth.register(form)
      login(data)
      onClose()
      showToast(t('auth_welcome') + ', ' + data.user.name + '!', 'success')
      setForm({ name: '', email: '', phone: '', password: '' })
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal id="registerModal" isOpen={isOpen} onClose={onClose}>
      <h2>{t('auth_register')}</h2>
      <p className="modal-sub">Создайте аккаунт COFFESINO</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="text"     placeholder={t('auth_name')}     value={form.name}     onChange={set('name')}     required />
        <input type="email"    placeholder={t('auth_email')}    value={form.email}    onChange={set('email')}    required />
        <input type="tel"      placeholder={t('auth_phone')}    value={form.phone}    onChange={set('phone')} />
        <input type="password" placeholder={t('auth_password')} value={form.password} onChange={set('password')} required />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '...' : t('auth_reg_btn')}
        </button>
      </form>
      <p className="auth-switch">
        <a style={{ cursor: 'pointer' }} onClick={onSwitchToLogin}>{t('auth_have_acc')}</a>
      </p>
    </Modal>
  )
}
