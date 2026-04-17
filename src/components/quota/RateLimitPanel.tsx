interface RateLimitPanelProps {
  requestsThisWindow: number
  rateLimit: number
  windowResetInSeconds: number
  blockedForSeconds: number
}

export const RateLimitPanel = ({
  requestsThisWindow,
  rateLimit,
  windowResetInSeconds,
  blockedForSeconds,
}: RateLimitPanelProps) => {
  const isUnlimited = !Number.isFinite(rateLimit)

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="border border-sky-200 bg-sky-50/70 p-3 shadow-[0_10px_22px_-20px_rgba(3,105,161,0.55)] rounded-none">
        <p className="text-xs uppercase tracking-wide text-sky-700">Requests this minute</p>
        <p className="mt-1 text-xl font-semibold text-slate-900">
          {requestsThisWindow}
          {!isUnlimited ? <span className="text-sm font-normal text-slate-600"> / {rateLimit}</span> : null}
        </p>
        {!isUnlimited ? (
          <p className="mt-1 text-xs font-medium text-slate-600">Window resets in {windowResetInSeconds}s</p>
        ) : (
          <p className="mt-1 text-xs font-medium text-slate-600">Unlimited requests per minute</p>
        )}
      </div>

      <div className="border border-amber-200 bg-amber-50/70 p-3 shadow-[0_10px_22px_-20px_rgba(180,83,9,0.6)] rounded-none">
        <p className="text-xs uppercase tracking-wide text-amber-700">Send status</p>
        <p className="mt-1 text-xl font-semibold text-slate-900">
          {blockedForSeconds > 0 ? 'Blocked' : 'Available'}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-600">
          {blockedForSeconds > 0
            ? `Rate limit reached. Retry in ${blockedForSeconds}s.`
            : 'You can send prompts now.'}
        </p>
      </div>
    </div>
  )
}
