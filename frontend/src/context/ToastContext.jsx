import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((msg, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 3800)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toastContainer">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type} show`}>
            {toast.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
