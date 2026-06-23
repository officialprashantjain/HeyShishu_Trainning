'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/utils/storage'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = storage.getToken()
    const storedUser = storage.getUser()
    
    if (token && storedUser) {
      setUser(storedUser)
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [])

  const logout = () => {
    storage.clearAll()
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
