import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../../context/I18nContext'
import { API } from '../../api/index.js'
import Modal from './Modal'

const SEGMENTS = [
  { label: '🚗 Автомобиль', color: '#C8956C', textColor: '#fff' },
  { label: '10%\nСкидка',   color: '#6B3A2A', textColor: '#F5F0E8' },
  { label: '☕ Напиток',    color: '#D4A76A', textColor: '#2C1810' },
  { label: '50%\nСкидка',   color: '#C8956C', textColor: '#fff' },
  { label: 'Ещё раз',       color: '#E8DDD0', textColor: '#6B3A2A' },
  { label: '20%\nСкидка',   color: '#6B3A2A', textColor: '#F5F0E8' },
  { label: '🍰 Десерт',     color: '#D4A76A', textColor: '#2C1810' },
  { label: '🎁 Сюрприз',   color: '#C8956C', textColor: '#fff' },
]

function drawWheel(ctx, canvas, angle) {
  const n   = SEGMENTS.length
  const arc = (2 * Math.PI) / n
  const cx  = canvas.width / 2
  const cy  = canvas.height / 2
  const r   = cx - 10

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  SEGMENTS.forEach((seg, i) => {
    const start = angle + i * arc - Math.PI / 2
    const end   = start + arc

    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, start, end)
    ctx.closePath()
    ctx.fillStyle = seg.color
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(start + arc / 2)
    ctx.textAlign = 'right'
    ctx.fillStyle = seg.textColor
    const lines    = seg.label.split('\n')
    const fontSize = r < 150 ? 11 : 13
    ctx.font = `bold ${fontSize}px Poppins, sans-serif`
    lines.forEach((line, li) => {
      ctx.fillText(line, r - 12, (li - (lines.length - 1) / 2) * (fontSize + 2))
    })
    ctx.restore()
  })

  ctx.beginPath()
  ctx.arc(cx, cy, 28, 0, 2 * Math.PI)
  ctx.fillStyle = '#6B3A2A'
  ctx.fill()
  ctx.strokeStyle = '#D4A76A'
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.fillStyle = '#F5F0E8'
  ctx.font = 'bold 9px Poppins'
  ctx.textAlign = 'center'
  ctx.fillText('COFFESINO', cx, cy + 3)

  ctx.beginPath()
  ctx.moveTo(cx, 30)
  ctx.lineTo(cx - 10, 8)
  ctx.lineTo(cx + 10, 8)
  ctx.closePath()
  ctx.fillStyle = '#6B3A2A'
  ctx.fill()
  ctx.strokeStyle = '#D4A76A'
  ctx.lineWidth = 2
  ctx.stroke()
}

function easeWithHesitation(t) {
  if (t < 0.75)      return 1 - Math.pow(1 - t / 0.75, 3)
  else if (t < 0.88) return (1 - Math.pow(1 - 1, 3)) + ((t - 0.75) / 0.13) * 0.08
  else               return 0.97 + ((t - 0.88) / 0.12) * 0.03
}

export default function WheelModal({ isOpen, onClose, bookingId }) {
  const { t } = useI18n()
  const canvasRef  = useRef(null)
  const angleRef   = useRef(0)
  const spinningRef = useRef(false)
  const [result, setResult] = useState(null)
  const [spinning, setSpinning] = useState(false)

  useEffect(() => {
    if (!isOpen) { setResult(null); setSpinning(false); spinningRef.current = false; angleRef.current = 0; return }
    const timer = setTimeout(() => {
      if (canvasRef.current) drawWheel(canvasRef.current.getContext('2d'), canvasRef.current, 0)
    }, 100)
    return () => clearTimeout(timer)
  }, [isOpen])

  const handleSpin = async () => {
    if (spinningRef.current || !canvasRef.current) return
    spinningRef.current = true
    setSpinning(true)
    setResult(null)

    const arc          = (2 * Math.PI) / SEGMENTS.length
    const targetAngle  = 5 * 2 * Math.PI + arc * 1.5 + arc * 0.78
    const duration     = 6500
    const startTime    = performance.now()
    const startAngle   = angleRef.current

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased    = easeWithHesitation(progress)
      angleRef.current = startAngle + targetAngle * eased
      drawWheel(canvasRef.current.getContext('2d'), canvasRef.current, angleRef.current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        spinningRef.current = false
        setSpinning(false)
        fetchResult()
      }
    }

    requestAnimationFrame(animate)
  }

  const fetchResult = async () => {
    try {
      const res = await API.bookings.spinWheel(bookingId)
      setResult({ code: res.code, msg: t('wheel_win') })
    } catch (e) {
      setResult({ error: e.message })
    }
  }

  return (
    <Modal id="wheelModal" isOpen={isOpen} onClose={onClose}>
      <div className="wheel-container">
        <h2>{t('wheel_title')}</h2>
        <p style={{ color: 'var(--muted)', margin: '8px 0 24px' }}>{t('wheel_subtitle')}</p>
        <canvas ref={canvasRef} id="wheelCanvas" width={320} height={320} />

        {result && (
          <div id="wheelResult" style={{ display: 'block' }}>
            {!result.error && <div id="wheelAlmost">{t('wheel_almost')}</div>}
            <div id="wheelResultMsg">{result.error || result.msg}</div>
            {result.code && (
              <>
                <p style={{ fontSize: '.88rem', color: 'var(--muted)' }}>{t('wheel_code')}</p>
                <div className="wheel-code-display" id="wheelCode">{result.code}</div>
                <p style={{ fontSize: '.82rem', color: 'var(--muted)', marginTop: '8px' }}>{t('wheel_valid')}</p>
                <p style={{ fontSize: '.88rem', fontWeight: 600, color: 'var(--primary)', marginTop: '4px' }}>{t('wheel_next')}</p>
              </>
            )}
          </div>
        )}

        <button
          id="wheelSpinBtn"
          className="btn btn-primary"
          style={{ marginTop: '24px', padding: '14px 48px', fontSize: '1.1rem' }}
          onClick={handleSpin}
          disabled={spinning || !!result}
        >
          {t('wheel_spin')}
        </button>
      </div>
    </Modal>
  )
}
