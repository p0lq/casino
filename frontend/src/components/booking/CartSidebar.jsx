import { useI18n } from '../../context/I18nContext'

export default function CartSidebar({ cart, onChangeQty, onRemove, onCheckout, discountCode, onDiscountChange }) {
  const { t, lang } = useI18n()

  const total = cart.reduce((s, { item, qty }) => s + item.price * qty, 0)

  const scrollToMenu = () => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="order-sidebar">
      <div className="order-card">
        <h3>{t('booking_cart_title')}</h3>
        <div id="cartItems">
          {cart.length === 0
            ? <p className="cart-empty">{t('booking_cart_empty')}</p>
            : cart.map(({ item, qty }) => (
                <div className="cart-item" key={item._id}>
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name[lang] || item.name.ru}</span>
                    <span className="cart-item-price">{item.price.toLocaleString()} ₸</span>
                  </div>
                  <div className="cart-item-controls">
                    <button className="qty-btn" onClick={() => onChangeQty(item._id, -1)}>−</button>
                    <span>{qty}</span>
                    <button className="qty-btn" onClick={() => onChangeQty(item._id, 1)}>+</button>
                    <button className="remove-btn" onClick={() => onRemove(item._id)}>✕</button>
                  </div>
                </div>
              ))
          }
        </div>
        <div className="cart-total">
          <span>{t('booking_total')}</span>
          <span className="cart-total-amount">{total.toLocaleString()} ₸</span>
        </div>
        <div className="discount-input">
          <input
            type="text"
            value={discountCode}
            onChange={e => onDiscountChange(e.target.value)}
            placeholder={t('discount_placeholder')}
          />
        </div>
        <div className="booking-actions">
          <button className="btn btn-primary" onClick={onCheckout}>
            {t('booking_pay')}
          </button>
        </div>
      </div>

      <div className="order-card" style={{ marginTop: '20px' }}>
        <h3>{t('booking_order_title')}</h3>
        <p style={{ fontSize: '.85rem', color: 'var(--muted)', marginBottom: '16px' }}>
          Прокрутите вверх к меню и нажмите «Добавить в заказ»
        </p>
        <button className="btn btn-outline btn-sm" onClick={scrollToMenu}>↑ К меню</button>
      </div>
    </div>
  )
}
