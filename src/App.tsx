import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/layout/ProtectedRoute'

const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((module) => ({ default: module.RegisterPage })))

const RouteFallback = () => (
  <main className="min-h-screen px-4 py-10 sm:px-8">
    <div className="mx-auto max-w-6xl border border-slate-300 bg-white px-6 py-10 text-sm text-slate-600 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.45)]">
      Loading page...
    </div>
  </main>
)

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/app" replace />} />
    <Route
      path="/login"
      element={
        <Suspense fallback={<RouteFallback />}>
          <LoginPage />
        </Suspense>
      }
    />
    <Route
      path="/register"
      element={
        <Suspense fallback={<RouteFallback />}>
          <RegisterPage />
        </Suspense>
      }
    />

    <Route element={<ProtectedRoute />}>
      <Route
        path="/app"
        element={
          <Suspense fallback={<RouteFallback />}>
            <DashboardPage />
          </Suspense>
        }
      />
    </Route>

    <Route
      path="*"
      element={
        <Suspense fallback={<RouteFallback />}>
          <NotFoundPage />
        </Suspense>
      }
    />
  </Routes>
)

export default App
