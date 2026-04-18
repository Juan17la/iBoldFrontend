interface QuotaProgressProps {
  usedTokens: number
  remainingTokens: number | null
}

export const QuotaProgress = ({ usedTokens, remainingTokens }: QuotaProgressProps) => {
  const total = remainingTokens === null ? null : usedTokens + remainingTokens
  const percentage = total && total > 0 ? Math.min(100, Math.round((usedTokens / total) * 100)) : 0

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
        <span className="font-medium">Cuota mensual de tokens</span>
        <span className="font-semibold text-slate-700">
          {remainingTokens === null
            ? `${usedTokens.toLocaleString()} usados (ilimitado)`
            : `${usedTokens.toLocaleString()} / ${total?.toLocaleString()}`}
        </span>
      </div>
      {remainingTokens === null ? (
        <div className="border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 rounded-none">
          Plan ilimitado
        </div>
      ) : (
        <div className="h-3 border border-slate-300 bg-slate-100 rounded-none">
          <div
            className="h-full bg-gradient-to-r from-sky-600 to-cyan-500 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      {remainingTokens !== null ? (
        <p className="mt-2 text-xs font-medium text-slate-500">Has usado {percentage}% de la cuota mensual</p>
      ) : null}
    </div>
  )
}
