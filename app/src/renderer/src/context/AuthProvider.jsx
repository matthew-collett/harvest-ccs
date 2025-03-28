import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '@/utils/firebase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          try {
            const token = await user.getIdToken(true)
            await window.context.setToken(token)
            setUser(user)
          } catch (err) {
            await window.context.clearToken()
            await signOut(auth)
            setUser(null)
          }
        } else {
          await window.context.clearToken()
          setUser(null)
        }
      } catch (err) {
        console.error('Auth state change error:', err)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const token = await userCredential.user.getIdToken()
    await window.context.setToken(token)
    return userCredential.user
  }

  const logout = async () => {
    await signOut(auth)
    await window.context.clearToken()
  }

  const refreshToken = async () => {
    if (user) {
      const token = await user.getIdToken(true)
      await window.context.setToken(token)
      return token
    }
    return null
  }

  const value = {
    user,
    loading,
    login,
    logout,
    refreshToken
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
