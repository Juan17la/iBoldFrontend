export const estimateTokens = (prompt: string): number => {
  const cleaned = prompt.replace(/\s+/g, ' ').trim()
  if (!cleaned) {
    return 0
  }

  const words = cleaned.split(' ').length
  const chars = cleaned.length
  const roughFromWords = words * 1.3
  const roughFromChars = chars / 4

  return Math.max(20, Math.round((roughFromWords + roughFromChars) / 2))
}

export const PLAN_RATE_LIMIT: Record<string, number> = {
  FREE: 10,
  PRO: 60,
  ENTERPRISE: Number.POSITIVE_INFINITY,
}

export const PLAN_MONTHLY_LIMIT: Record<string, number | null> = {
  FREE: 50000,
  PRO: 500000,
  ENTERPRISE: null,
}
