'use client'

import { useRouter } from 'next/navigation'
import { useDemoState } from '@/components/providers/DemoStateProvider'
import { MATCH_META } from '@/lib/demo-state'

export function GoldenMatch() {
  const router = useRouter()
  const { state: { brand }, selectedMatch: match, hydrated } = useDemoState()
  const missingMatch = hydrated && !match

  if (missingMatch) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-[14px] text-altr-text-2">
          No match selected yet.
        </p>
        <button
          type="button"
          onClick={() => router.push('/match')}
          className="rounded-lg border border-white/[0.08] bg-altr-bg/40 px-5 py-2.5 text-[13.5px] font-medium text-altr-white transition hover:border-altr-mint-bright/50 hover:text-altr-mint-bright"
        >
          ← Pick a stage
        </button>
      </div>
    )
  }

  if (!match) return null

  const meta = match.meta ?? MATCH_META[match.id]
  if (!meta) return null
  const rsRate = match.roi_prediction.rs_rate
  const pillText = `${brand.brandName} × ${meta.shortName} · RS ${rsRate}% · ${brand.timeline} · USD→AED`

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-altr-mint-bright/30 bg-altr-mint/[0.06] px-6 py-7 text-center md:px-8 md:py-8">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            background: '#5DCAA5',
            boxShadow: '0 0 24px rgba(93, 202, 165, 0.4)',
          }}
        >
          <svg width="20" height="16" viewBox="0 0 22 18" fill="none" aria-hidden>
            <path
              d="M2 9.5L8 15L20 2.5"
              stroke="#0A0A0F"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="flex flex-col gap-1">
          <span
            className="font-mono text-[11px] tracking-[0.28em] uppercase"
            style={{ color: '#5DCAA5' }}
          >
            Golden Match
          </span>
          <h1 className="text-[22px] font-bold tracking-[-0.02em] text-altr-white md:text-[26px]">
            {brand.brandName} <span className="text-altr-text-3">×</span>{' '}
            {meta.shortName}
          </h1>
          <span className="font-mono text-[10.5px] tracking-[0.18em] text-altr-text-2 uppercase">
            Confirmed in 2.4h · {match.match_score}% match · {brand.timeline}
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <section className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-altr-card p-6 md:p-7">
          <span
            className="font-mono text-[10px] tracking-[0.22em] uppercase"
            style={{ color: '#5DCAA5' }}
          >
            Why this match makes sense
          </span>
          <div className="flex flex-col gap-2">
            <ScoreRow label="Audience fit" value={match.score_breakdown.audience_fit} />
            <ScoreRow label="Budget fit" value={match.score_breakdown.budget_fit} />
            <ScoreRow label="Category gap" value={match.score_breakdown.vertical_demand} />
            <ScoreRow label="Timing fit" value={match.score_breakdown.timing_fit} />
          </div>
          <p className="border-t border-white/[0.06] pt-4 text-[13.5px] leading-[1.6] text-altr-text-2">
            {match.why_this_match}
          </p>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-altr-card p-6 md:p-7">
          <span className="font-mono text-[10px] tracking-[0.22em] text-altr-text-3 uppercase">
            ROI snapshot
          </span>
          <div className="flex flex-col divide-y divide-white/[0.06]">
            <ROIRow
              label="Foot traffic"
              value={`${(match.roi_prediction.foot_traffic_min / 1000).toFixed(1)}K – ${(match.roi_prediction.foot_traffic_max / 1000).toFixed(1)}K`}
            />
            <ROIRow
              label="Projected sales"
              value={`$${(match.roi_prediction.projected_sales_min / 1000).toFixed(0)}K – $${(match.roi_prediction.projected_sales_max / 1000).toFixed(0)}K`}
            />
            <ROIRow
              label={`RS payout @ ${rsRate}%`}
              value={`$${(match.roi_prediction.rs_payout_min / 1000).toFixed(1)}K – $${(match.roi_prediction.rs_payout_max / 1000).toFixed(1)}K`}
            />
            <ROIRow
              label="Benchmark"
              value={`${match.roi_prediction.benchmark_deals} similar deals`}
            />
          </div>
          <div
            className="mt-1 rounded-lg border p-3"
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
              className="mt-1 text-[12.5px] leading-[1.55]"
              style={{ color: '#5DCAA5' }}
            >
              {match.altr_edge}
            </p>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-altr-card px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <span
          className="rounded-full border px-3.5 py-1.5 font-mono text-[10.5px] tracking-[0.18em] uppercase"
          style={{
            borderColor: '#5DCAA5',
            background: '#1A2E28',
            color: '#5DCAA5',
          }}
        >
          {pillText}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (typeof window === 'undefined') return
              const message = `We're locked in on ${brand.brandName} × ${meta.shortName}. Walk me through what's needed for the deal terms — RS%, milestones, activation window, KPIs — and flag anything I should think about before I sign.`
              window.dispatchEvent(
                new CustomEvent('altr:askAgent', {
                  detail: { stageName: meta.shortName, message, intent: 'pre-terms' },
                }),
              )
            }}
            className="inline-flex items-center justify-center rounded-lg border border-altr-mint-bright/30 bg-altr-mint/[0.08] px-4 py-2.5 text-[13px] font-medium text-altr-mint-bright transition hover:border-altr-mint hover:bg-altr-mint/[0.18]"
          >
            Ask ALTR
          </button>
          <button
            type="button"
            onClick={() => router.push('/contract')}
            className="inline-flex items-center gap-2 rounded-lg bg-altr-mint px-5 py-2.5 text-[13.5px] font-semibold text-altr-white transition hover:bg-altr-mint-bright"
          >
            Set deal terms →
          </button>
        </div>
      </div>
    </div>
  )
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 font-mono text-[10px] tracking-[0.18em] text-altr-text-3 uppercase">
        {label}
      </span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-altr-bg/60">
        <span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${value}%`, background: '#5DCAA5' }}
        />
      </div>
      <span
        className="w-9 text-right font-mono text-[11px]"
        style={{ color: '#5DCAA5' }}
      >
        {value}%
      </span>
    </div>
  )
}

function ROIRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="font-mono text-[10px] tracking-[0.18em] text-altr-text-3 uppercase">
        {label}
      </span>
      <span className="font-mono text-[13px] font-semibold text-altr-white">
        {value}
      </span>
    </div>
  )
}
