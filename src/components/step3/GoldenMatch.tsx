'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  type BrandProfile,
  type MatchResult,
  DEFAULT_BRAND,
  loadDemoState,
  MATCH_META,
  selectedMatch,
} from '@/lib/demo-state'

const CHECKLIST_LINES = [
  { label: 'K-brand confirmed', value: 'accepted' },
  { label: 'Live IP confirmed', value: 'accepted' },
  { label: 'Audience fit verified', value: 'AI validated' },
  { label: 'RS model agreed', value: 'Revenue share deal' },
  { label: 'Settlement rail assigned', value: 'XRPL · cross-border ready' },
]

export function GoldenMatch() {
  const router = useRouter()
  const [brand, setBrand] = useState<BrandProfile>(DEFAULT_BRAND)
  const [match, setMatch] = useState<MatchResult | null>(null)
  const [missingMatch, setMissingMatch] = useState(false)
  const [phase, setPhase] = useState(0)
  const [revealedLines, setRevealedLines] = useState(0)

  useEffect(() => {
    const s = loadDemoState()
    setBrand(s.brand)
    const m = selectedMatch(s)
    if (!m) {
      setMissingMatch(true)
      return
    }
    setMatch(m)
  }, [])

  useEffect(() => {
    if (missingMatch || !match) return
    const phases = [200, 700, 1100, 1700]
    const timers = phases.map((delay, i) =>
      setTimeout(() => setPhase(i + 1), delay),
    )
    return () => timers.forEach(clearTimeout)
  }, [missingMatch, match])

  useEffect(() => {
    if (phase < 4) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setRevealedLines(i)
      if (i >= CHECKLIST_LINES.length) clearInterval(id)
    }, 300)
    return () => clearInterval(id)
  }, [phase])

  if (missingMatch) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-[14px] text-demo-text-dim">
          No match selected yet.
        </p>
        <button
          type="button"
          onClick={() => router.push('/match')}
          className="rounded-lg border border-demo-border bg-demo-bg/40 px-5 py-2.5 text-[13.5px] font-medium text-demo-text transition hover:border-demo-teal/50 hover:text-demo-teal"
        >
          ← Pick a stage
        </button>
      </div>
    )
  }

  if (!match) return null

  const meta = MATCH_META[match.id]
  const rsRate = match.roi_prediction.rs_rate
  const pillText = `${brand.brandName} × ${meta.shortName} · RS ${rsRate}% · ${brand.timeline} · USD→AED`

  return (
    <div className="flex flex-col items-center gap-10 py-12 md:py-16">
      <div className="flex w-full max-w-3xl flex-col items-center gap-8">
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8">
          <SideCard
            visible={phase >= 1}
            from="left"
            title={brand.brandName}
            subtitle={`${brand.vertical} · ${brand.currentMarkets[0] ?? 'Korea'}`}
            tagFromRight={false}
          />
          <span
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border text-[20px] font-bold transition-all duration-500 md:h-14 md:w-14 ${
              phase >= 2
                ? 'border-demo-teal text-demo-teal opacity-100'
                : 'border-demo-border text-demo-text-faint opacity-30'
            }`}
            style={{
              boxShadow: phase >= 2 ? '0 0 24px rgba(93, 202, 165, 0.35)' : undefined,
            }}
          >
            ×
          </span>
          <SideCard
            visible={phase >= 1}
            from="right"
            title={meta.shortName}
            subtitle={`${meta.category} · ${meta.location.split(',')[0] ?? meta.location}`}
            tagFromRight
          />
        </div>

        <div
          className={`flex flex-col items-center gap-3 transition-all duration-700 ${
            phase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              background: '#5DCAA5',
              boxShadow: '0 0 36px rgba(93, 202, 165, 0.45)',
            }}
          >
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden>
              <path
                d="M2 9.5L8 15L20 2.5"
                stroke="#0A0A0F"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span
            className="font-mono text-[12px] tracking-[0.28em] uppercase"
            style={{ color: '#5DCAA5' }}
          >
            Golden Match
          </span>
          <span className="text-[13.5px] text-demo-text-dim">
            Both sides confirmed interest
          </span>
          <span className="font-mono text-[11px] tracking-[0.18em] text-demo-text-faint uppercase">
            Matched in 2.4 hours
          </span>
        </div>
      </div>

      <ul
        className={`w-full max-w-xl rounded-2xl border bg-demo-surface px-6 py-5 transition-all duration-500 md:px-8 md:py-6 ${
          phase >= 4 ? 'border-demo-border opacity-100' : 'border-transparent opacity-0'
        }`}
      >
        {CHECKLIST_LINES.map((line, i) => (
          <li
            key={line.label}
            className={`flex items-center gap-3 border-b border-demo-border/40 py-2.5 last:border-0 ${
              i < revealedLines ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
            } transition-all duration-300`}
          >
            <span
              className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
              style={{ background: '#5DCAA5' }}
            >
              <svg
                width="11"
                height="9"
                viewBox="0 0 11 9"
                fill="none"
                aria-hidden
              >
                <path
                  d="M1.5 4.5L4.25 7.25L9.5 1.75"
                  stroke="#0A0A0F"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="flex-1 text-[13px] text-demo-text-dim md:text-[13.5px]">
              {line.label}
            </span>
            <span className="font-mono text-[10.5px] tracking-[0.15em] text-demo-text uppercase">
              {i === 0 ? brand.brandName : i === 1 ? meta.shortName : line.value}
            </span>
          </li>
        ))}
      </ul>

      <div
        className={`flex flex-col items-center gap-5 transition-all duration-500 ${
          phase >= 4 && revealedLines >= CHECKLIST_LINES.length
            ? 'translate-y-0 opacity-100'
            : 'translate-y-3 opacity-0'
        }`}
      >
        <span
          className="rounded-full border px-4 py-2 font-mono text-[11px] tracking-[0.18em] uppercase"
          style={{
            borderColor: '#5DCAA5',
            background: '#1A2E28',
            color: '#5DCAA5',
          }}
        >
          {pillText}
        </span>

        <button
          type="button"
          onClick={() => router.push('/contract')}
          className="inline-flex items-center gap-2 rounded-lg bg-demo-teal px-6 py-3 text-[14px] font-semibold text-demo-bg transition hover:bg-demo-success"
        >
          Set deal terms →
        </button>
      </div>
    </div>
  )
}

function SideCard({
  visible,
  from,
  title,
  subtitle,
  tagFromRight,
}: {
  visible: boolean
  from: 'left' | 'right'
  title: string
  subtitle: string
  tagFromRight: boolean
}) {
  return (
    <div
      className={`flex flex-col rounded-xl border border-demo-border bg-demo-surface p-4 transition-all duration-700 md:p-5 ${
        visible
          ? 'translate-x-0 opacity-100'
          : from === 'left'
            ? '-translate-x-4 opacity-0'
            : 'translate-x-4 opacity-0'
      } ${tagFromRight ? 'text-right' : 'text-left'}`}
    >
      <span className="text-[15px] font-bold text-demo-text md:text-[17px]">
        {title}
      </span>
      <span className="mt-1 font-mono text-[10px] tracking-[0.15em] text-demo-text-faint uppercase">
        {subtitle}
      </span>
    </div>
  )
}
