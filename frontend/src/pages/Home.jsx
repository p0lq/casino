import { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import MenuSection from '../components/menu/MenuSection'
import BookingSection from '../components/booking/BookingSection'
import ReviewsSection from '../components/reviews/ReviewsSection'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import LoginModal from '../components/modals/LoginModal'
import RegisterModal from '../components/modals/RegisterModal'
import PaymentModal from '../components/modals/PaymentModal'
import WheelModal from '../components/modals/WheelModal'
import MyBookingsModal from '../components/modals/MyBookingsModal'

export default function Home() {
  const [cart, setCart] = useState([])
  const [activeBooking, setActiveBooking] = useState(null)
  const [wheelBookingId, setWheelBookingId] = useState(null)

  const [loginOpen,      setLoginOpen]      = useState(false)
  const [registerOpen,   setRegisterOpen]   = useState(false)
  const [paymentOpen,    setPaymentOpen]    = useState(false)
  const [wheelOpen,      setWheelOpen]      = useState(false)
  const [myBookingsOpen, setMyBookingsOpen] = useState(false)

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.item._id === item._id)
      if (existing) return prev.map(c => c.item._id === item._id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { item, qty: 1 }]
    })
  }

  const changeQty = (id, delta) => {
    setCart(prev => {
      const updated = prev.map(c => c.item._id === id ? { ...c, qty: c.qty + delta } : c)
      return updated.filter(c => c.qty > 0)
    })
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.item._id !== id))
  const clearCart = () => setCart([])

  const handleBookingCreated = (booking) => {
    setActiveBooking(booking)
    setPaymentOpen(true)
  }

  const handleWheelEligible = (bookingId) => {
    setWheelBookingId(bookingId)
    setWheelOpen(true)
  }

  const openPayment = (booking) => { setActiveBooking(booking); setPaymentOpen(true) }
  const openWheel   = (id)      => { setWheelBookingId(id);    setWheelOpen(true) }

  return (
    <>
      <Navbar
        onOpenLogin={()      => setLoginOpen(true)}
        onOpenRegister={()   => setRegisterOpen(true)}
        onOpenMyBookings={()  => setMyBookingsOpen(true)}
      />

      <Hero />

      <MenuSection onAddToCart={addToCart} />

      <BookingSection
        cart={cart}
        onAddToCart={addToCart}
        onChangeQty={changeQty}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
        onBookingCreated={handleBookingCreated}
        onOpenLogin={() => setLoginOpen(true)}
      />

      <ReviewsSection onOpenLogin={() => setLoginOpen(true)} />

      <Contact />
      <Footer />

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => { setLoginOpen(false); setRegisterOpen(true) }}
      />
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => { setRegisterOpen(false); setLoginOpen(true) }}
      />
      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        booking={activeBooking}
        onWheelEligible={handleWheelEligible}
      />
      <WheelModal
        isOpen={wheelOpen}
        onClose={() => setWheelOpen(false)}
        bookingId={wheelBookingId}
      />
      <MyBookingsModal
        isOpen={myBookingsOpen}
        onClose={() => setMyBookingsOpen(false)}
        onOpenPayment={openPayment}
        onOpenWheel={openWheel}
      />
    </>
  )
}
