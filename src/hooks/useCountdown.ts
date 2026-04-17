import { useEffect, useState } from 'react'

export const useCountdown = (targetEpochMs: number | null): number => {
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (!targetEpochMs) {
      return
    }

    const updateRemaining = () => {
      const secondsLeft = Math.max(0, Math.ceil((targetEpochMs - Date.now()) / 1000))
      setRemaining(secondsLeft)
    }

    const kickoff = window.setTimeout(() => {
      updateRemaining()
    }, 0)

    const timer = window.setInterval(() => {
      updateRemaining()
    }, 1000)

    return () => {
      window.clearTimeout(kickoff)
      window.clearInterval(timer)
    }
  }, [targetEpochMs])

  if (!targetEpochMs) {
    return 0
  }

  return remaining
}
