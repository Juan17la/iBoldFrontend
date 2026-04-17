import type { PropsWithChildren, ReactNode } from 'react'

interface SectionCardProps {
  title: string
  description?: string
  action?: ReactNode
}

export const SectionCard = ({
  title,
  description,
  action,
  children,
}: PropsWithChildren<SectionCardProps>) => (
  <section className="border border-slate-300 bg-white/95 p-4 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.45)] sm:p-6 rounded-none">
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      </div>
      {action}
    </div>
    {children}
  </section>
)
