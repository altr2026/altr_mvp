'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useStageState } from '@/components/providers/StageStateProvider'
import type {
  StageProfile,
  StageScreening,
  StageScreeningResponse,
} from '@/lib/stage-state'
import { STAGE_LOADING_MESSAGES } from '@/lib/stage-fallback'

type Phase = 'loading' | 'ready' | 'error'

const DEMAND_COLOR: Record<
  StageScreening['sponsor_recommendations'][number]['estimated_demand'],
  string
> = {
  low: '#9F9FA9',
  medium: '#A8E6CF',
  high: '#41B888',
  'top-tier': '#5DCAA5',
}

export function StageScreenPage() {
  const { state: stageCtx, hydrated, setScreening: commitScreening } = useStageState()
  const [phase, setPhase] = useState<Phase>('loading')
  const [screening, setScreening] = useState<StageScreening | null>(null)
  const [source, setSource] = useState<StageScreeningResponse['source']>('fallback')
  const [messageIdx, setMessageIdx] = useState(0)
  const fetchedRef = useRef(false)
  const stageName = stageCtx.stage.stageName

  const run = useCallback(
    async (stage: StageProfile) => {
      try {
        const res = await fetch('/api/screen-stage', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(stage),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as StageScreeningResponse
        setScreening(data.screening)
        setSource(data.source)
        commitScreening(data.screening)
        setPhase('ready')
      } catch {
        setPhase('error')
      }
    },
    [commitScreening],
  )

  useEffect(() => {
    if (!hydrated || fetchedRef.current) return
    fetchedRef.current = true
    if (stageCtx.screening) {
      setScreening(stageCtx.screening)
      setPhase('ready')
      return
    }
    void run(stageCtx.stage)
  }, [hydrated, stageCtx.stage, stageCtx.screening, run])

  useEffect(() => {
    if (phase !== 'loading') return
    const id = setInterval(() => {
      setMessageIdx((i) => (i + 1) % STAGE_LOADING_MESSAGES.length)
    }, 1500)
    return () => clearInterval(id)
  }, [phase])

  if (phase === 'loading') {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-6 py-20 text-center">
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
            {STAGE_LOADING_MESSAGES[messageIdx]}
          </span>
          <span className="font-mono text-[10px] tracking-[0.22em] text-altr-text-3 uppercase">
            ALTR PRE Intelligence · {stageName}
          </span>
        </div>
      </div>
    )
  }

  if (phase === 'error' || !screening) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-[14px] text-altr-text-2">
          Screening failed. Resubmit your stage profile or email
          hello@altr.haus.
        </p>
        <Link
          href="/list-stage"
          className="rounded-lg border border-altr-mint-bright/30 bg-altr-mint/[0.08] px-5 py-2.5 text-[13.5px] font-medium text-altr-mint-bright transition hover:border-altr-mint hover:bg-altr-mint/[0.18]"
        >
          ← Back to form
        </Link>
      </div>
    )
  }

  const bench = screening.pricing_benchmark
  const fmtBench = (n: number) =>
    n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(1)}M`
      : `$${Math.round(n / 1_000)}K`

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="font-mono text-[10.5px] tracking-[0.22em] text-altr-mint-bright uppercase">
          ALTR PRE Intelligence · screened
        </span>
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-altr-white md:text-[28px]">
          {stageName} — market readout
        </h1>
        <p className="text-[14px] leading-[1.55] text-altr-text-2">
          Audience signal, category whitespace, sponsor verticals that fit you,
          and rough pricing benchmarks. ALTR uses this to surface brand matches.
        </p>
        {source === 'fallback' && (
          <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.1] bg-altr-bg/40 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.18em] text-altr-text-3 uppercase">
            ⚠ Static fallback · ANTHROPIC_API_KEY not configured
          </span>
        )}
      </header>

      <section className="rounded-2xl border border-altr-mint-bright/30 bg-altr-mint/[0.04] p-6 md:p-7">
        <span className="font-mono text-[10px] tracking-[0.22em] text-altr-mint-bright uppercase">
          Positioning
        </span>
        <p className="mt-3 text-[15px] leading-[1.6] text-altr-white md:text-[16px]">
          {screening.positioning}
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-2xl border border-white/[0.06] bg-altr-card p-6 md:p-7">
          <span className="font-mono text-[10px] tracking-[0.22em] text-altr-text-3 uppercase">
            Audience strength
          </span>
          <p className="mt-3 text-[13.5px] leading-[1.6] text-altr-text-2">
            {screening.audience_strength}
          </p>
        </section>
        <section className="rounded-2xl border border-white/[0.06] bg-altr-card p-6 md:p-7">
          <span className="font-mono text-[10px] tracking-[0.22em] text-altr-text-3 uppercase">
            Category whitespace
          </span>
          <p className="mt-3 text-[13.5px] leading-[1.6] text-altr-text-2">
            {screening.category_whitespace}
          </p>
        </section>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-altr-white md:text-[20px]">
            Sponsor verticals that fit
          </h2>
          <span className="font-mono text-[10.5px] tracking-[0.18em] text-altr-text-3 uppercase">
            {screening.sponsor_recommendations.length} recommended
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {screening.sponsor_recommendations.map((rec) => (
            <article
              key={rec.vertical}
              className="rounded-2xl border border-white/[0.07] bg-altr-card p-5 md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-[16px] font-bold text-altr-white md:text-[17px]">
                  {rec.vertical}
                </h3>
                <span
                  className="inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase"
                  style={{
                    borderColor: `${DEMAND_COLOR[rec.estimated_demand]}55`,
                    background: `${DEMAND_COLOR[rec.estimated_demand]}14`,
                    color: DEMAND_COLOR[rec.estimated_demand],
                  }}
                >
                  {rec.estimated_demand} demand
                </span>
              </div>
              <p className="mt-3 text-[13.5px] leading-[1.55] text-altr-text-2">
                {rec.rationale}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.06] bg-altr-card p-6 md:p-7">
        <span className="font-mono text-[10px] tracking-[0.22em] text-altr-text-3 uppercase">
          Pricing benchmark · {bench.currency}
        </span>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <BenchTile
            label="Booth"
            range={`${fmtBench(bench.booth_low)} – ${fmtBench(bench.booth_high)}`}
          />
          <BenchTile
            label="Pop-up"
            range={`${fmtBench(bench.pop_up_low)} – ${fmtBench(bench.pop_up_high)}`}
          />
          <BenchTile
            label="Title / Naming"
            range={`${fmtBench(bench.title_low)} – ${fmtBench(bench.title_high)}`}
          />
        </div>
      </section>

      {screening.risk_flags.length > 0 && (
        <section className="rounded-2xl border border-pending/30 p-6 md:p-7" style={{ borderColor: 'rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.04)' }}>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: '#F87171' }}>
            Risk flags
          </span>
          <ul className="mt-3 flex flex-col gap-2">
            {screening.risk_flags.map((r) => (
              <li
                key={r}
                className="flex items-start gap-2 text-[13.5px] leading-[1.55]"
                style={{ color: '#F87171' }}
              >
                <span aria-hidden>⚠</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-altr-mint-bright/30 bg-altr-mint/[0.06] p-6 md:p-7">
        <span
          className="font-mono text-[10px] tracking-[0.22em] uppercase"
          style={{ color: '#5DCAA5' }}
        >
          ALTR edge
        </span>
        <p
          className="mt-3 text-[14.5px] leading-[1.6]"
          style={{ color: '#5DCAA5' }}
        >
          {screening.altr_edge}
        </p>
      </section>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-6">
        <Link
          href="/list-stage"
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-altr-bg/40 px-4 py-2 text-[13px] font-medium text-altr-text-2 transition hover:border-white/[0.2] hover:text-altr-white"
        >
          ← Edit profile
        </Link>
        <Link
          href="/live-ip"
          className="inline-flex items-center gap-2 rounded-lg bg-altr-mint px-5 py-2.5 text-[13.5px] font-semibold text-altr-white transition hover:bg-altr-mint-bright"
        >
          Browse other stages →
        </Link>
      </div>
    </div>
  )
}

function BenchTile({ label, range }: { label: string; range: string }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-white/[0.06] bg-altr-bg/40 px-4 py-3">
      <span className="font-mono text-[9.5px] tracking-[0.18em] text-altr-text-3 uppercase">
        {label}
      </span>
      <span className="font-mono text-[16px] font-bold text-altr-mint-bright md:text-[17px]">
        {range}
      </span>
    </div>
  )
}
