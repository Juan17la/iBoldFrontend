import { Link } from 'react-router-dom'

export const NotFoundPage = () => (
  <main className="min-h-screen bg-transparent px-4 py-14">
    <div className="mx-auto max-w-xl border border-slate-300 bg-white/95 p-8 text-center shadow-[0_20px_60px_-35px_rgba(15,23,42,0.55)] rounded-none">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">404</p>
      <h1 className="mt-1 text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">The route does not exist in this application.</p>
      <Link
        to="/app"
        className="mt-6 inline-flex border border-sky-700 bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800 rounded-none"
      >
        Go to app
      </Link>
    </div>
  </main>
)
