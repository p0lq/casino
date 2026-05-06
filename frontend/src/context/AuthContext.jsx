import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('coffesino_user')) } catch { return null }
  })

  const login = useCallback((data) => {
    setUser(data.user)
    localStorage.setItem('coffesino_token', data.token)
    localStorage.setItem('coffesino_user', JSON.stringify(data.user))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('coffesino_token')
    localStorage.removeItem('coffesino_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
