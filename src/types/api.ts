export type Plan = 'FREE' | 'PRO' | 'ENTERPRISE'

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
  details?: Record<string, unknown>
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  plan?: Plan
}

export interface RegisterResponse {
  email: string
  name: string
  plan: Plan
  createdAt: string
  message: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  email: string
  name: string
  plan: Plan
  message: string
}

export interface GenerateRequest {
  email: string
  password: string
  prompt: string
  requestedTokens?: number
}

export interface GenerateResponse {
  email: string
  generatedText: string
  tokensConsumed: number
  generatedAt: string
  model: string
}

export interface QuotaStatusResponse {
  email: string
  currentPlan: Plan
  usedTokens: number
  remainingTokens: number | null
  resetDate: string
}

export interface DailyUsageItem {
  date: string
  usedTokens: number
}

export interface QuotaHistoryResponse {
  email: string
  dailyUsage: DailyUsageItem[]
}

export interface UpgradeRequest {
  email: string
  password: string
  targetPlan?: Exclude<Plan, 'FREE'>
}

export interface UpgradeResponse {
  email: string
  previousPlan: Plan
  currentPlan: Plan
  message: string
}

export interface ApiClientError extends Error {
  status: number
  data?: ApiError
  retryAfterSeconds?: number
}
