import { useState, useEffect } from 'react'
import './admin.css'
import { useToast } from '../../context/ToastContext'
import { API } from '../../api/index.js'
import AdminLogin from './AdminLogin'
import AdminLayout from './AdminLayout'
import Dashboard from './Dashboard'
import MenuAdmin from './MenuAdmin'
import TablesAdmin from './TablesAdmin'
import BookingsAdmin from './BookingsAdmin'
import OrdersAdmin from './OrdersAdmin'
import ReviewsAdmin from './ReviewsAdmin'

export default function AdminPage() {
  const { showToast } = useToast()
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('coffesino_user'))
      return u?.role === 'admin' ? u : null
    } catch { return null }
  })
  const [page, setPage] = useState('dashboard')

  const handleLogin = (user) => setAdminUser(user)

  const handleLogout = () => {
    localStorage.removeItem('coffesino_token')
    localStorage.removeItem('coffesino_user')
    setAdminUser(null)
  }

  const confirmPayment = async (bookingId, action, reload) => {
    try {
      await API.payments.confirm(bookingId, action)
      showToast(action === 'confirm' ? '✓ Оплата подтверждена' : 'Отклонено', 'success')
      reload?.()
    } catch (e) { showToast(e.message, 'error') }
  }

  if (!adminUser) return <AdminLogin onLogin={handleLogin} />

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onConfirmPayment={confirmPayment} />
      case 'menu':      return <MenuAdmin />
      case 'tables':    return <TablesAdmin />
      case 'bookings':  return <BookingsAdmin onConfirmPayment={confirmPayment} />
      case 'orders':    return <OrdersAdmin />
      case 'reviews':   return <ReviewsAdmin />
      default:          return <Dashboard onConfirmPayment={confirmPayment} />
    }
  }

  return (
    <AdminLayout
      adminName={adminUser.name}
      activePage={page}
      onNavigate={setPage}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AdminLayout>
  )
}
