'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LOADING_MESSAGES } from '@/lib/match-fallback'
import {
  type BrandProfile,
  type MatchResponse,
  type MatchResult,
  loadDemoState,
  MATCH_META,
  patchDemoState,
} from '@/lib/demo-state'

type Phase = 'loading' | 'ready' | 'error'

export function MatchPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('loading')
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [source, setSource] = useState<MatchResponse['source']>('fallback')
  const [messageIdx, setMessageIdx] = useState(0)
  const [revealedCount, setRevealedCount] = useState(0)
  const fetchedRef = useRef(false)

  const runMatch = useCallback(async (brand: BrandProfile) => {
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(brand),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as MatchResponse
      setMatches(data.matches)
      setSource(data.source)
      patchDemoState({ matches: data.matches })
      setPhase('ready')
    } catch {
      setPhase('error')
    }
  }, [])

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    const state = loadDemoState()
    if (state.matches && state.matches.length > 0) {
      setMatches(state.matches)
      setPhase('ready')
      return
    }
    void runMatch(state.brand)
  }, [runMatch])

  useEffect(() => {
    if (phase !== 'loading') return
    const id = setInterval(() => {
      setMessageIdx((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 1500)
    return () => clearInterval(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'ready' || matches.length === 0) return
    setRevealedCount(0)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setRevealedCount(i)
      if (i >= matches.length) clearInterval(id)
    }, 200)
    return () => clearInterval(id)
  }, [phase, matches.length])

  const handleSelect = (m: MatchResult) => {
    patchDemoState({ selectedMatchId: m.id, matchedAt: new Date().toISOString() })
    router.push('/confirm')
  }

  if (phase === 'loading') return <LoadingState messageIdx={messageIdx} />

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span
          className="font-mono text-[10.5px] tracking-[0.22em] uppercase"
          style={{ color: '#5DCAA5' }}
        >
          Step 02 · Intelligence
        </span>
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-demo-text md:text-[28px]">
          3 stages match your brief.
        </h1>
        <p className="text-[14px] leading-[1.55] text-demo-text-dim">
          Ranked by fit. Top match is highlighted — click any card to confirm and
          enter the deal flow.
        </p>
        {source === 'fallback' && (
          <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-full border border-demo-border bg-demo-bg/40 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.18em] text-demo-text-faint uppercase">
            ⚠ Static fallback · ANTHROPIC_API_KEY not configured
          </span>
        )}
      </header>

      <div className="flex flex-col gap-5">
        {matches.map((m, idx) => (
          <MatchCard
            key={m.id}
            match={m}
            isTop={idx === 0}
            visible={idx < revealedCount}
            onSelect={() => handleSelect(m)}
          />
        ))}
      </div>
    </div>
  )
}

function LoadingState({ messageIdx }: { messageIdx: number }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-6 py-16 text-center">
      <span className="relative flex h-3 w-3 items-center justify-center">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
          style={{ background: '#5DCAA5' }}
        />
        <span
          className="relative inline-flex h-3 w-3 rounded-full"
          style={{ background: '#5DCAA5' }}
        />
      </span>
      <div className="flex flex-col gap-2">
        <span
          className="font-mono text-[12px] tracking-[0.18em]"
          style={{ color: '#5DCAA5' }}
        >
          {LOADING_MESSAGES[messageIdx]}
        </span>
        <span className="font-mono text-[10px] tracking-[0.22em] text-demo-text-faint uppercase">
          ALTR Intelligence
        </span>
      </div>
    </div>
  )
}

function MatchCard({
  match: m,
  isTop,
  visible,
  onSelect,
}: {
  match: MatchResult
  isTop: boolean
  visible: boolean
  onSelect: () => void
}) {
  const meta = MATCH_META[m.id]

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border bg-demo-surface transition-all duration-500 ${
        isTop ? 'border-demo-teal/50' : 'border-demo-border'
      } ${visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
      style={{
        boxShadow: isTop ? '0 0 0 1px rgba(93, 202, 165, 0.15)' : undefined,
      }}
    >
      <div className="relative aspect-[16/7] w-full overflow-hidden">
        <Image
          src={meta.image}
          alt={meta.name}
          fill
          sizes="(min-width: 1024px) 720px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-demo-surface from-5% via-demo-surface/65 via-55% to-demo-surface/0 to-100%" />
        <span
          className="absolute top-3 right-3 inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] tracking-wider backdrop-blur uppercase"
          style={{
            borderColor: isTop ? '#5DCAA5' : 'rgba(255,255,255,0.2)',
            background: isTop ? 'rgba(26,46,40,0.85)' : 'rgba(10,10,15,0.7)',
            color: isTop ? '#5DCAA5' : '#E8E6F0',
          }}
        >
          {m.match_score}% match
        </span>
        <div className="absolute bottom-3 left-4 right-4 flex flex-col gap-1">
          <h3 className="text-[17px] font-bold tracking-[-0.01em] text-demo-text drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] md:text-[19px]">
            {meta.name}
          </h3>
          <span className="font-mono text-[10px] tracking-[0.15em] text-demo-text-dim uppercase">
            {meta.category} · {meta.location} · {meta.timing}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-demo-border/60 border-b border-demo-border/60">
        <StatTile label="Visitors" value={meta.visitors} />
        <StatTile
          label="Audience"
          value={meta.audienceProfile}
          mono={false}
          small
        />
        <StatTile
          label="Past benchmark"
          value={meta.pastDealAvgROI}
          mono={false}
          small
        />
      </div>

      <div className="flex flex-col gap-5 p-5 md:p-6">
        <div className="grid gap-2">
          <ScoreBar label="Audience fit" value={m.score_breakdown.audience_fit} />
          <ScoreBar label="Budget fit" value={m.score_breakdown.budget_fit} />
          <ScoreBar
            label="Category gap"
            value={m.score_breakdown.vertical_demand}
          />
          <ScoreBar label="Timing fit" value={m.score_breakdown.timing_fit} />
        </div>

        <p className="text-[14px] leading-[1.6] text-demo-text">
          {m.why_this_match}
        </p>

        <ul className="flex flex-col gap-1.5 border-y border-demo-border/60 py-4">
          {m.key_signals.map((s) => (
            <li
              key={s}
              className="flex items-start gap-2 text-[13px] leading-[1.5] text-demo-text-dim"
            >
              <span
                className="mt-[7px] inline-block h-1 w-1 flex-shrink-0 rounded-[1px]"
                style={{ background: '#5DCAA5' }}
              />
              <span>{s}</span>
            </li>
          ))}
        </ul>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="font-mono text-[10px] tracking-[0.2em] text-demo-text-faint uppercase">
              ROI prediction
            </span>
            <span className="font-mono text-[10px] tracking-[0.15em] text-demo-text-faint uppercase">
              {m.roi_prediction.benchmark_deals} similar deals
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <ROIPill
              label="Foot traffic"
              value={`${(m.roi_prediction.foot_traffic_min / 1000).toFixed(1)}K–${(m.roi_prediction.foot_traffic_max / 1000).toFixed(1)}K`}
            />
            <ROIPill
              label="Sales"
              value={`$${(m.roi_prediction.projected_sales_min / 1000).toFixed(0)}–${(m.roi_prediction.projected_sales_max / 1000).toFixed(0)}K`}
            />
            <ROIPill
              label={`RS @ ${m.roi_prediction.rs_rate}%`}
              value={`$${(m.roi_prediction.rs_payout_min / 1000).toFixed(1)}–${(m.roi_prediction.rs_payout_max / 1000).toFixed(1)}K`}
            />
          </div>
        </div>

        <div
          className="rounded-lg border p-3.5"
          style={{
            borderColor: 'rgba(93,202,165,0.3)',
            background: 'rgba(93,202,165,0.05)',
          }}
        >
          <span
            className="font-mono text-[9.5px] tracking-[0.2em] uppercase"
            style={{ color: '#5DCAA5' }}
          >
            ALTR edge
          </span>
          <p
            className="mt-1.5 text-[13px] leading-[1.55]"
            style={{ color: '#5DCAA5' }}
          >
            {m.altr_edge}
          </p>
        </div>

        {m.risk_flags && m.risk_flags.length > 0 && (
          <div
            className="rounded-lg border px-3.5 py-3"
            style={{
              borderColor: 'rgba(248, 113, 113, 0.3)',
              background: 'rgba(248, 113, 113, 0.06)',
            }}
          >
            {m.risk_flags.map((r) => (
              <p
                key={r}
                className="flex items-start gap-2 text-[12.5px] leading-[1.5]"
                style={{ color: '#F87171' }}
              >
                <span aria-hidden>⚠</span>
                <span>{r}</span>
              </p>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onSelect}
          className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-[13.5px] font-semibold transition ${
            isTop
              ? 'bg-demo-teal text-demo-bg hover:bg-demo-success'
              : 'border border-demo-border bg-demo-bg/40 text-demo-text-dim hover:border-demo-teal/50 hover:text-demo-teal'
          }`}
          style={{ borderWidth: isTop ? 0 : '0.5px' }}
        >
          Select this stage →
        </button>
      </div>
    </article>
  )
}

function StatTile({
  label,
  value,
  mono = true,
  small = false,
}: {
  label: string
  value: string
  mono?: boolean
  small?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 px-3 py-3 md:px-4 md:py-3.5">
      <span className="font-mono text-[9px] tracking-[0.2em] text-demo-text-faint uppercase">
        {label}
      </span>
      <span
        className={`${mono ? 'font-mono' : ''} ${small ? 'text-[11.5px]' : 'text-[16px] font-bold'} leading-[1.35] text-demo-text`}
      >
        {value}
      </span>
    </div>
  )
}

function ROIPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-demo-border bg-demo-bg/40 px-3 py-2.5">
      <span className="font-mono text-[9px] tracking-[0.18em] text-demo-text-faint uppercase">
        {label}
      </span>
      <span
        className="font-mono text-[13px] font-bold"
        style={{ color: '#5DCAA5' }}
      >
        {value}
      </span>
    </div>
  )
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 font-mono text-[10.5px] tracking-[0.15em] text-demo-text-faint uppercase">
        {label}
      </span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-demo-bg/60">
        <span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${value}%`, background: '#5DCAA5' }}
        />
      </div>
      <span
        className="w-10 text-right font-mono text-[11px]"
        style={{ color: '#5DCAA5' }}
      >
        {value}%
      </span>
    </div>
  )
}

function Section({
  title,
  accent,
  children,
}: {
  title: string
  accent?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="font-mono text-[10px] tracking-[0.2em] uppercase"
        style={{ color: accent ? '#5DCAA5' : '#5A5A6A' }}
      >
        {title}
      </span>
      {children}
    </div>
  )
}

function ROIRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-demo-border/40 pb-2 last:border-0 last:pb-0">
      <span className="text-demo-text-dim">{label}:</span>
      <span className="text-right font-medium text-demo-text">{value}</span>
    </div>
  )
}
