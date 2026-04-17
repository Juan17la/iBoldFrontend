import type { Plan } from '../../types/api'

interface PlanBadgeProps {
  plan: Plan
}

const PLAN_STYLES: Record<Plan, string> = {
  FREE: 'bg-sky-50 text-sky-800 border-sky-300',
  PRO: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  ENTERPRISE: 'bg-amber-50 text-amber-800 border-amber-300',
}

export const PlanBadge = ({ plan }: PlanBadgeProps) => (
  <span
    className={`inline-flex items-center gap-2 border px-3 py-1 text-xs font-semibold tracking-[0.08em] shadow-[0_10px_20px_-18px_rgba(15,23,42,0.5)] rounded-none ${PLAN_STYLES[plan]}`}
  >
    <span className="h-1.5 w-1.5 bg-current" />
    {plan}
  </span>
)
