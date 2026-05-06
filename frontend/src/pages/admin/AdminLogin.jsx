import { useState } from 'react'
import { API } from '../../api/index.js'

export default function AdminLogin({ onLogin }) {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await API.auth.login({ email, password })
      if (data.user.role !== 'admin') throw new Error('Доступ только для администратора')
      localStorage.setItem('coffesino_token', data.token)
      localStorage.setItem('coffesino_user', JSON.stringify(data.user))
      onLogin(data.user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div id="adminLogin">
      <div className="login-box">
        <h1>COFFESINO</h1>
        <p>Панель управления</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="email"    placeholder="Email администратора" value={email}    onChange={e => setEmail(e.target.value)}    required />
          <input type="password" placeholder="Пароль"               value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-primary">Войти</button>
        </form>
        {error && <p style={{ color: '#c62828', fontSize: '.85rem', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  )
}
