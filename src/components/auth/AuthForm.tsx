import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Plan } from '../../types/api'
import { FieldError } from '../ui/FieldError'

interface AuthFormProps {
  mode: 'login' | 'register'
  form: {
    name: string
    email: string
    password: string
    plan: Plan
  }
  errors: Partial<Record<'name' | 'email' | 'password' | 'form', string>>
  busy: boolean
  onFieldChange: (field: 'name' | 'email' | 'password', value: string) => void
  onPlanChange: (plan: Plan) => void
  onSubmit: () => void
}

export const AuthForm = ({
  mode,
  form,
  errors,
  busy,
  onFieldChange,
  onPlanChange,
  onSubmit,
}: AuthFormProps) => {
  const isRegister = mode === 'register'

  return (
    <div className="mx-auto w-full max-w-md border border-slate-300 bg-white/95 p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.55)] sm:p-8 rounded-none">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
        {isRegister ? 'New account' : 'Secure login'}
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-slate-900">
        {isRegister ? 'Create account' : 'Welcome back'}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {isRegister
          ? 'Start consuming AI through quota-aware proxies.'
          : 'Sign in to continue with your plan limits and usage.'}
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        {isRegister ? (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-800">Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => onFieldChange('name', event.target.value)}
              className="w-full border border-slate-300 bg-slate-50/60 px-3 py-2 text-sm outline-none transition focus:border-sky-600 focus:bg-white rounded-none"
              placeholder="Juan Diego"
            />
            <FieldError message={errors.name} />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-800">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => onFieldChange('email', event.target.value)}
            className="w-full border border-slate-300 bg-slate-50/60 px-3 py-2 text-sm outline-none transition focus:border-sky-600 focus:bg-white rounded-none"
            placeholder="juan@mail.com"
          />
          <FieldError message={errors.email} />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-800">Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => onFieldChange('password', event.target.value)}
            className="w-full border border-slate-300 bg-slate-50/60 px-3 py-2 text-sm outline-none transition focus:border-sky-600 focus:bg-white rounded-none"
            placeholder="At least 6 characters"
          />
          <FieldError message={errors.password} />
        </label>

        {isRegister ? (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-800">Plan</span>
            <select
              value={form.plan}
              onChange={(event) => onPlanChange(event.target.value as Plan)}
              className="w-full border border-slate-300 bg-slate-50/60 px-3 py-2 text-sm outline-none transition focus:border-sky-600 focus:bg-white rounded-none"
            >
              <option value="FREE">FREE</option>
              <option value="PRO">PRO</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </select>
          </label>
        ) : null}

        <FieldError message={errors.form} />

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 border border-sky-700 bg-sky-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:border-slate-400 disabled:bg-slate-400 rounded-none"
          disabled={busy}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isRegister ? 'Create account' : 'Login'}
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-600">
        {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
        <Link
          to={isRegister ? '/login' : '/register'}
          className="font-semibold text-slate-900 underline"
        >
          {isRegister ? 'Login' : 'Register'}
        </Link>
      </p>
    </div>
  )
}
