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
        setUser(user)

        if (user) {
          const token = await user.getIdToken()
          await window.context.setToken(token)
        } else {
          await window.context.clearToken()
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
    await window.context.clearToken()
    await signOut(auth)
  }

  const refreshToken = async () => {
    if (user) {
      try {
        const token = await user.getIdToken(true)
        await window.context.setToken(token)
        return token
      } catch (err) {
        console.error('Token refresh error:', err)
        throw err
      }
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
