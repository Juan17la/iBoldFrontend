import { CreditCard, X } from 'lucide-react'
import { useState } from 'react'

interface UpgradeModalProps {
  open: boolean
  busy: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export const UpgradeModal = ({ open, busy, onClose, onConfirm }: UpgradeModalProps) => {
  const [paid, setPaid] = useState(false)

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-[1px]">
      <div className="w-full max-w-md border border-slate-300 bg-white p-6 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.6)] rounded-none">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">Cuota agotada</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Actualizacion requerida</h2>
            <p className="mt-1 text-sm text-slate-600">
              Tu cuota mensual esta agotada. Actualiza a PRO para continuar.
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-900">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 border border-amber-200 bg-amber-50/60 p-4 rounded-none">
          <div className="flex items-center justify-between text-sm text-slate-700">
            <span>Plan</span>
            <span className="font-semibold">PRO</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-700">
            <span>Limite mensual</span>
            <span className="font-semibold">500,000 tokens</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-700">
            <span>Precio de simulacion</span>
            <span className="font-semibold">$12.99</span>
          </div>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={paid}
            onChange={(event) => setPaid(event.target.checked)}
            className="h-4 w-4 border-slate-400 accent-sky-700 rounded-none"
          />
          Confirmo el pago simulado.
        </label>

        <button
          type="button"
          disabled={!paid || busy}
          onClick={() => {
            void onConfirm()
          }}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-sky-700 bg-sky-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:border-slate-400 disabled:bg-slate-400 rounded-none"
        >
          <CreditCard className="h-4 w-4" />
          {busy ? 'Actualizando...' : 'Completar actualizacion'}
        </button>
      </div>
    </div>
  )
}
