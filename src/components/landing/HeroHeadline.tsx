'use client'

import { useEffect, useState } from 'react'

const PAIRS: { left: string; right: string }[] = [
  { left: 'sponsorship', right: 'revenue' },
  { left: 'live activation', right: 'presence' },
  { left: 'brand pop-up', right: 'market entry' },
]

const INTERVAL_MS = 2200

export function HeroHeadline() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (PAIRS.length <= 1) return
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % PAIRS.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  const { left, right } = PAIRS[idx]

  return (
    <h1 className="mt-7 max-w-6xl text-[26px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[34px] lg:text-[44px] lg:tracking-[-0.045em]">
      <span className="block lg:whitespace-nowrap">
        Turn{' '}
        <span
          key={`l-${idx}`}
          className="altr-fade-in inline-block text-altr-mint"
        >
          {left}
        </span>{' '}
        into{' '}
        <span
          key={`r-${idx}`}
          className="altr-fade-in inline-block text-altr-mint"
        >
          {right}
        </span>
        , with us.
      </span>
    </h1>
  )
}
