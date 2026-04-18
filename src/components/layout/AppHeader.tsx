import { LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PlanBadge } from '../ui/PlanBadge'

export const AppHeader = () => {
  const { user, signOut } = useAuth()

  return (
    <header className="border-b border-slate-300 bg-white/80 backdrop-blur">
      <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500" />
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
            Plataforma Proxy IA de iBold
          </p>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Panel de Cuotas en Tiempo Real</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Uso en vivo, limites y control de generacion en un solo espacio de trabajo.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden border border-slate-200 bg-slate-50 px-3 py-2 text-right sm:block">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Sesion iniciada</p>
            <p className="max-w-44 truncate text-xs font-medium text-slate-700">{user?.email}</p>
          </div>
          {user ? <PlanBadge plan={user.plan} /> : null}
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 border border-slate-400 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 rounded-none"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesion
          </button>
        </div>
      </div>
    </header>
  )
}
