import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api/api'
import { ChatWindow, type ChatMessage } from '../components/chat/ChatWindow'
import { AppHeader } from '../components/layout/AppHeader'
import { QuotaProgress } from '../components/quota/QuotaProgress'
import { RateLimitPanel } from '../components/quota/RateLimitPanel'
import { UpgradeModal } from '../components/quota/UpgradeModal'
import { UsageHistoryChart } from '../components/quota/UsageHistoryChart'
import { SectionCard } from '../components/ui/SectionCard'
import { useAuth } from '../context/AuthContext'
import { useCountdown } from '../hooks/useCountdown'
import type { ApiClientError, DailyUsageItem, QuotaStatusResponse } from '../types/api'
import { estimateTokens, PLAN_RATE_LIMIT } from '../utils/tokens'

const toUiTime = (date: Date): string =>
  date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

const sanitizeGeneratedText = (text: string): string => {
  // Backend mock responses may append "Prompt: ..."; hide that echoed input in UI.
  return text.replace(/\s*Prompt:\s*[\s\S]*$/i, '').trim()
}

export const DashboardPage = () => {
  const { user, updatePlan } = useAuth()

  const [prompt, setPrompt] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [quota, setQuota] = useState<QuotaStatusResponse | null>(null)
  const [history, setHistory] = useState<DailyUsageItem[]>([])
  const [error, setError] = useState<string | null>(null)

  const [windowStartMs, setWindowStartMs] = useState<number | null>(null)
  const [requestsThisWindow, setRequestsThisWindow] = useState(0)
  const [blockedUntilMs, setBlockedUntilMs] = useState<number | null>(null)

  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [upgradeBusy, setUpgradeBusy] = useState(false)

  const blockedForSeconds = useCountdown(blockedUntilMs)
  const windowResetInSeconds = useCountdown(
    windowStartMs ? windowStartMs + 60_000 : null,
  )

  const estimatedTokens = useMemo(() => estimateTokens(prompt), [prompt])

  const activePlan = quota?.currentPlan ?? user?.plan ?? 'FREE'
  const rateLimit = PLAN_RATE_LIMIT[activePlan]

  const loadQuota = useCallback(async () => {
    if (!user) {
      return
    }

    const [status, usage] = await Promise.all([
      api.getQuotaStatus(user.email, user.encryptedPassword),
      api.getQuotaHistory(user.email, user.encryptedPassword),
    ])

    setQuota(status)
    setHistory(usage.dailyUsage)
    updatePlan(status.currentPlan)
  }, [updatePlan, user])

  useEffect(() => {
    if (!user) {
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadQuota().catch((caughtError: unknown) => {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Could not load quota state.'
      setError(message)
    })
  }, [loadQuota, user])

  const incrementRequestWindow = () => {
    const now = Date.now()

    if (!windowStartMs || windowResetInSeconds === 0) {
      setWindowStartMs(now)
      setRequestsThisWindow(1)
      return
    }

    setRequestsThisWindow((current) => current + 1)
  }

  const handleSend = async () => {
    if (!user || !prompt.trim() || busy || blockedForSeconds > 0) {
      return
    }

    const submittedPrompt = prompt.trim()
    const requestedTokens = Math.max(estimatedTokens, 100)

    setError(null)
    setBusy(true)
    setPrompt('')

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: submittedPrompt,
      timestamp: toUiTime(new Date()),
    }
    setMessages((prev) => [...prev, userMessage])

    incrementRequestWindow()

    try {
      const { data, retryAfterSeconds } = await api.generate({
        email: user.email,
        password: user.encryptedPassword,
        prompt: submittedPrompt,
        requestedTokens,
      })

      if (retryAfterSeconds && retryAfterSeconds > 0) {
        setBlockedUntilMs(Date.now() + retryAfterSeconds * 1000)
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: sanitizeGeneratedText(data.generatedText),
        timestamp: toUiTime(new Date(data.generatedAt)),
        tokens: data.tokensConsumed,
      }

      setMessages((prev) => [...prev, assistantMessage])
      await loadQuota()
    } catch (caughtError) {
      const apiError = caughtError as ApiClientError
      const status = apiError.status
      const retryAfter = apiError.retryAfterSeconds

      if (retryAfter && retryAfter > 0) {
        setBlockedUntilMs(Date.now() + retryAfter * 1000)
      }

      if (status === 429) {
        const fallbackRetry =
          (apiError.data?.details?.retryAfterSeconds as number | undefined) ?? 15
        setBlockedUntilMs(Date.now() + fallbackRetry * 1000)
      }

      if (status === 402) {
        setUpgradeOpen(true)
      }

      const message = apiError.data?.message ?? apiError.message ?? 'Could not send prompt.'
      setError(message)

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: `Error: ${message}`,
        timestamp: toUiTime(new Date()),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } finally {
      setBusy(false)
    }
  }

  const handleUpgrade = async () => {
    if (!user) {
      return
    }

    setUpgradeBusy(true)
    setError(null)

    try {
      await api.upgradePlan({
        email: user.email,
        password: user.encryptedPassword,
        targetPlan: 'PRO',
      })

      setUpgradeOpen(false)
      await loadQuota()
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Upgrade failed. Try again.'
      setError(message)
    } finally {
      setUpgradeBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <AppHeader />

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-5 lg:items-start">
        <section className="space-y-5 lg:col-span-3">
          <ChatWindow
            messages={messages}
            prompt={prompt}
            estimatedTokens={estimatedTokens}
            blockedForSeconds={blockedForSeconds}
            onPromptChange={setPrompt}
            onSend={handleSend}
            busy={busy}
          />

          {error ? (
            <div className="border border-rose-300 bg-rose-50/90 px-4 py-3 text-sm font-medium text-rose-700 shadow-[0_8px_20px_-18px_rgba(190,24,93,0.6)] rounded-none">
              {error}
            </div>
          ) : null}
        </section>

        <aside className="space-y-5 lg:sticky lg:top-6 lg:col-span-2">
          <SectionCard title="Quota status" description="Updated after each request.">
            <div className="space-y-4">
              <QuotaProgress
                usedTokens={quota?.usedTokens ?? 0}
                remainingTokens={quota?.remainingTokens ?? null}
              />
              <p className="border-l-2 border-sky-300 pl-3 text-xs text-slate-600">
                Reset date: {quota?.resetDate ?? '--'}
              </p>
            </div>
          </SectionCard>

          <SectionCard title="Rate limit tracker" description="Request counter + countdown.">
            <RateLimitPanel
              requestsThisWindow={windowResetInSeconds > 0 ? requestsThisWindow : 0}
              rateLimit={rateLimit}
              windowResetInSeconds={windowResetInSeconds}
              blockedForSeconds={blockedForSeconds}
            />
          </SectionCard>

          <SectionCard title="Usage history" description="Last 7 days token consumption.">
            <UsageHistoryChart data={history} />
          </SectionCard>
        </aside>
      </main>

      <UpgradeModal
        open={upgradeOpen}
        busy={upgradeBusy}
        onClose={() => setUpgradeOpen(false)}
        onConfirm={handleUpgrade}
      />
    </div>
  )
}
