import { useState } from 'react'
import { useI18n } from '../../context/I18nContext'
import { useToast } from '../../context/ToastContext'
import { API } from '../../api/index.js'
import Modal from './Modal'

export default function PaymentModal({ isOpen, onClose, booking, onWheelEligible }) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setFile(null); setFileName(''); setStatus(null); setLoading(false)
    onClose()
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    setFile(f)
    setFileName(f?.name || '')
  }

  const handleVerify = async () => {
    if (!file) { showToast('Выберите скриншот оплаты', 'warning'); return }
    setLoading(true)
    setStatus({ type: 'verifying', msg: t('payment_verifying') })

    const form = new FormData()
    form.append('screenshot', file)

    try {
      const result = await API.payments.verify(booking._id, form)

      if (result.status === 'confirmed') {
        setStatus({ type: 'confirmed', msg: t('payment_confirmed') })
        showToast(t('payment_confirmed'), 'success')
        if (result.wheelEligible) {
          setTimeout(() => { handleClose(); onWheelEligible(booking._id) }, 1500)
        }
      } else if (result.status === 'failed') {
        setStatus({ type: 'failed', msg: t('payment_failed') })
        setLoading(false)
      } else {
        setStatus({ type: 'uploaded', msg: t('payment_uploaded') })
        setLoading(false)
      }
    } catch (err) {
      setStatus({ type: 'failed', msg: err.message })
      setLoading(false)
    }
  }

  if (!booking) return null

  return (
    <Modal id="paymentModal" isOpen={isOpen} onClose={handleClose}>
      <h2>{t('payment_title')}</h2>
      <div className="kaspi-qr-wrap">
        <img src="/images/kaspi-qr.png" alt="Kaspi QR" onError={e => { e.target.style.display = 'none' }} />
        <p className="qr-label">Kaspi QR</p>
      </div>
      <div className="payment-amount-display">
        {booking.totalAmount?.toLocaleString()} ₸
      </div>
      <p className="payment-instruction">{t('payment_instruction')}</p>

      <div className="upload-area" onClick={() => document.getElementById('screenshotFile').click()}>
        <input type="file" id="screenshotFile" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
        <p>📸 <span>{t('payment_upload')}</span></p>
        {fileName && <label>{fileName}</label>}
        <p style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: '6px' }}>{t('payment_choose')}</p>
      </div>

      {status && (
        <div className={`payment-status ${status.type}`}>{status.msg}</div>
      )}

      <button
        className="btn btn-primary"
        style={{ width: '100%' }}
        onClick={handleVerify}
        disabled={loading || status?.type === 'confirmed'}
      >
        {t('payment_verify')}
      </button>
    </Modal>
  )
}
