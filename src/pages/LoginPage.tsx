import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { api } from '../api/api'
import { AuthForm } from '../components/auth/AuthForm'
import { useAuth } from '../context/AuthContext'
import type { Plan } from '../types/api'
import { hashPassword } from '../utils/crypto'
import { isValidEmail, isValidPassword } from '../utils/validators'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { user, signIn } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    plan: 'FREE' as Plan,
  })
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState<
    Partial<Record<'name' | 'email' | 'password' | 'form', string>>
  >({})

  const isLoggedIn = useMemo(() => Boolean(user), [user])

  if (isLoggedIn) {
    return <Navigate to="/app" replace />
  }

  const validate = (): boolean => {
    const nextErrors: Partial<Record<'name' | 'email' | 'password' | 'form', string>> = {}

    if (!isValidEmail(form.email)) {
      nextErrors.email = 'Use a valid email address.'
    }

    if (!isValidPassword(form.password)) {
      nextErrors.password = 'Password must contain at least 6 characters.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = async () => {
    if (!validate()) {
      return
    }

    setBusy(true)
    setErrors({})

    try {
      const encryptedPassword = await hashPassword(form.password)
      const response = await api.login({
        email: form.email.trim(),
        password: encryptedPassword,
      })

      signIn({
        email: response.email,
        encryptedPassword,
        name: response.name,
        plan: response.plan,
      })

      navigate('/app', { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed.'
      setErrors({ form: message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-10 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2 lg:items-stretch">
        <section className="hidden border border-slate-300 bg-gradient-to-br from-sky-100 via-cyan-50 to-white p-8 shadow-[0_20px_60px_-35px_rgba(2,132,199,0.45)] lg:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">AI Consumption Platform</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-900">
            Consume AI with transparent limits and live quota tracking.
          </h2>
          <div className="mt-6 space-y-3 text-sm text-slate-700">
            <p className="border-l-2 border-sky-400 pl-3">Per-minute rate limiting by plan.</p>
            <p className="border-l-2 border-cyan-400 pl-3">Monthly token quotas with real-time status.</p>
            <p className="border-l-2 border-teal-400 pl-3">Integrated upgrade flow when quota is exhausted.</p>
          </div>
        </section>

        <div className="flex items-center">
        <AuthForm
          mode="login"
          form={form}
          errors={errors}
          busy={busy}
          onFieldChange={(field, value) =>
            setForm((prev) => ({
              ...prev,
              [field]: value,
            }))
          }
          onPlanChange={(plan) =>
            setForm((prev) => ({
              ...prev,
              plan,
            }))
          }
          onSubmit={onSubmit}
        />
        </div>
      </div>
    </main>
  )
}
