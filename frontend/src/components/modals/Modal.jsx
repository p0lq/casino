export default function Modal({ id, isOpen, onClose, children, large }) {
  if (!isOpen) return null

  return (
    <div className="modal active" id={id} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`modal-box${large ? ' modal-box-lg' : ''}`}>
        <button className="modal-close" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  )
}
