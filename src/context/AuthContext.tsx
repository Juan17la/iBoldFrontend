/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import type { Plan } from '../types/api'

interface AuthState {
  email: string
  encryptedPassword: string
  name: string
  plan: Plan
}

interface AuthContextValue {
  user: AuthState | null
  signIn: (state: AuthState) => void
  signOut: () => void
  updatePlan: (plan: Plan) => void
}

const AUTH_STORAGE_KEY = 'ibold.auth.session'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const loadStoredUser = (): AuthState | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthState
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthState | null>(loadStoredUser)

  const signIn = useCallback((state: AuthState) => {
    setUser(state)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state))
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [])

  const updatePlan = useCallback((plan: Plan) => {
    setUser((prev) => {
      if (!prev) {
        return prev
      }

      const next = { ...prev, plan }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      signIn,
      signOut,
      updatePlan,
    }),
    [signIn, signOut, updatePlan, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
