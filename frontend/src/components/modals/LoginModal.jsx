import { useState } from 'react'
import { useI18n } from '../../context/I18nContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { API } from '../../api/index.js'
import Modal from './Modal'

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const { t } = useI18n()
  const { login } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await API.auth.login({ email, password })
      login(data)
      onClose()
      showToast(t('auth_welcome') + ', ' + data.user.name + '!', 'success')
      setEmail(''); setPassword('')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal id="loginModal" isOpen={isOpen} onClose={onClose}>
      <h2>{t('auth_login')}</h2>
      <p className="modal-sub">COFFESINO — добро пожаловать</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="email" placeholder={t('auth_email')} value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder={t('auth_password')} value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '...' : t('auth_login_btn')}
        </button>
      </form>
      <p className="auth-switch">
        {t('auth_no_acc')} <a style={{ cursor: 'pointer' }} onClick={onSwitchToRegister}>Зарегистрироваться</a>
      </p>
    </Modal>
  )
}
