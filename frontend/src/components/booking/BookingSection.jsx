import { useState } from 'react'
import { useI18n } from '../../context/I18nContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { API } from '../../api/index.js'
import TableCard from './TableCard'
import CartSidebar from './CartSidebar'

const TIMES = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00']

export default function BookingSection({ cart, onAddToCart, onChangeQty, onRemoveFromCart, onClearCart, onBookingCreated, onOpenLogin }) {
  const { t } = useI18n()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState(2)
  const [duration, setDuration] = useState(2)
  const [tables, setTables] = useState([])
  const [tablesLoading, setTablesLoading] = useState(false)
  const [selectedTable, setSelectedTable] = useState(null)
  const [discountCode, setDiscountCode] = useState('')

  const loadTables = async (d = date, ti = time) => {
    if (!d || !ti) return
    setTablesLoading(true)
    try {
      const data = await API.tables.getAll(d, ti)
      setTables(data)
    } catch {
      showToast(t('common_error'), 'error')
    } finally {
      setTablesLoading(false)
    }
  }

  const handleDateChange = (val) => { setDate(val); loadTables(val, time) }
  const handleTimeChange = (val) => { setTime(val); loadTables(date, val) }

  const handleCheckout = async () => {
    if (!user) { showToast(t('booking_login_required'), 'warning'); onOpenLogin(); return }
    if (!selectedTable || !date || !time) { showToast(t('booking_select_first'), 'warning'); return }

    try {
      const booking = await API.bookings.create({
        tableId: selectedTable._id,
        date, time, guests, duration,
        discountCode: discountCode.trim() || undefined,
      })

      if (cart.length) {
        await API.orders.create({
          bookingId: booking._id,
          items: cart.map(c => ({ menuItemId: c.item._id, quantity: c.qty })),
        })
      }

      // Re-fetch booking so totalAmount includes the order items
      const updatedBooking = await API.bookings.get(booking._id)

      showToast('Столик успешно забронирован!', 'success')
      onClearCart()
      onBookingCreated(updatedBooking)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <section id="booking" className="section-alt">
      <div className="section-header">
        <h2>{t('booking_title')}</h2>
        <p>{t('booking_subtitle')}</p>
      </div>

      <div className="booking-layout">
        <div className="booking-form">
          <div className="form-row">
            <div className="form-group">
              <label>{t('booking_date')}</label>
              <input type="date" value={date} min={today} onChange={e => handleDateChange(e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t('booking_time')}</label>
              <select value={time} onChange={e => handleTimeChange(e.target.value)}>
                <option value="">— выберите —</option>
                {TIMES.map(ti => <option key={ti}>{ti}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('booking_guests')}</label>
              <input type="number" value={guests} min="1" max="20" onChange={e => setGuests(parseInt(e.target.value) || 2)} />
            </div>
            <div className="form-group">
              <label>{t('booking_duration')}</label>
              <select value={duration} onChange={e => setDuration(parseInt(e.target.value))}>
                {[1,2,3,4].map(h => <option key={h} value={h}>{h} ч</option>)}
              </select>
            </div>
          </div>

          <div className="tables-section">
            <h3>{t('booking_select_table')}</h3>
            <div className="tables-grid" id="tablesGrid">
              {!date || !time
                ? <p className="empty-msg" style={{ gridColumn: '1/-1' }}>Выберите дату и время для просмотра столиков</p>
                : tablesLoading
                  ? <div className="loading-spinner" />
                  : tables.length === 0
                    ? <p className="empty-msg">Нет доступных столиков</p>
                    : tables.map(table => (
                        <TableCard
                          key={table._id}
                          table={table}
                          selected={selectedTable?._id === table._id}
                          onSelect={setSelectedTable}
                        />
                      ))
              }
            </div>
            {selectedTable && (
              <div id="selectedTableInfo" style={{ display: 'block' }}>
                ✓ Выбран: <span id="selectedTableName">Стол №{selectedTable.number} ({selectedTable.seats} мест)</span>
              </div>
            )}
          </div>
        </div>

        <CartSidebar
          cart={cart}
          onChangeQty={onChangeQty}
          onRemove={onRemoveFromCart}
          onCheckout={handleCheckout}
          discountCode={discountCode}
          onDiscountChange={setDiscountCode}
        />
      </div>
    </section>
  )
}
