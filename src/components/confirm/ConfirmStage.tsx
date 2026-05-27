'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDemoState } from '@/components/providers/DemoStateProvider'
import { MATCH_META, type BrandProfile } from '@/lib/demo-state'
import type { WaitlistRole } from '@/types'

const ROLE_STORAGE_KEY = 'altr_demo_role'

type Auto = 'auto' | 'input' | 'manual'

const BADGE: Record<
  Auto,
  { label: string; color: string; bg: string; border: string }
> = {
  auto: {
    label: 'AUTO',
    color: '#5DCAA5',
    bg: 'rgba(93,202,165,0.15)',
    border: 'rgba(93,202,165,0.35)',
  },
  input: {
    label: 'INPUT',
    color: '#EF9F27',
    bg: 'rgba(239,159,39,0.14)',
    border: 'rgba(239,159,39,0.35)',
  },
  manual: {
    label: 'MANUAL',
    color: '#9CA3AF',
    bg: 'rgba(156,163,175,0.08)',
    border: 'rgba(156,163,175,0.30)',
  },
}

type Block = {
  title: string
  auto: Auto
  rows: Array<{ label: string; value: string }>
  note: string
}

type SideContent = {
  badge: string
  type: string
  location: string
  blocks: Block[]
}

type Set = {
  rh: SideContent
  brand: SideContent
}

function buildSet(slug: string, brand: BrandProfile): Set {
  const homeMarket = brand.currentMarkets[0] ?? 'Korea'
  const targetMarket = brand.targetMarket

  // GITEX Global 2026 — Tech/AI · Dubai
  if (slug === 'gitex-global-2026') {
    return {
      rh: {
        badge: 'RIGHT HOLDER · SELLER',
        type: 'Live Event · Tech/AI · GCC',
        location: 'Dubai, UAE · Dec 7–11, 2026',
        blocks: [
          {
            title: 'Stage Access',
            auto: 'input',
            rows: [
              { label: 'Slot', value: 'Hall 7, Booth Zone B' },
              { label: 'Size', value: '12 sqm · corner position' },
              { label: 'Duration', value: '5 days (Dec 7–11)' },
              { label: 'Foot traffic', value: '200K (self-reported)' },
              { label: 'Peak hours', value: '10am–2pm daily' },
            ],
            note: 'Right Holder provides slot details at onboarding.',
          },
          {
            title: 'Audience Profile',
            auto: 'input',
            rows: [
              { label: 'Total reach', value: '200,000' },
              { label: 'Beauty segment', value: '~40,000 (20%)' },
              { label: 'Gender', value: '60% M / 40% F' },
              { label: 'Age', value: '25–45' },
              { label: 'Purchasing power', value: 'High' },
            ],
            note: 'Right Holder provides. Phase 2+: ALTR verifies via 3rd-party data.',
          },
          {
            title: 'Execution Package',
            auto: 'manual',
            rows: [
              { label: 'Booth setup + teardown', value: 'Included' },
              { label: 'Power + wifi', value: 'Included' },
              { label: 'On-site staff (×2)', value: 'Included' },
              { label: 'Storage space', value: 'Included' },
              { label: 'Local compliance', value: 'Handled' },
            ],
            note: 'RIGHT HOLDER ONLY. ALTR does not execute. ALTR tracks milestone completion.',
          },
          {
            title: 'Settlement Triggers',
            auto: 'input',
            rows: [
              { label: 'Milestone sign-off', value: 'Day 1 / Day 3 / Day 5' },
              { label: 'POS environment', value: 'Provided ✓' },
              { label: 'ALTR API access', value: 'Authorized ✓' },
              { label: 'RS payout', value: '30% of verified sales' },
            ],
            note: 'Right Holder signs off each milestone. ALTR auto-triggers settlement.',
          },
        ],
      },
      brand: {
        badge: 'BRAND · BUYER + CONTENT',
        type: `${brand.vertical}`,
        location: `${targetMarket} (first activation)`,
        blocks: [
          {
            title: 'Product + Inventory',
            auto: 'input',
            rows: [
              { label: 'Hero SKU', value: 'Adv. Snail 96 Essence' },
              { label: 'Sampling', value: '500 units' },
              { label: 'Full-size', value: '50 units' },
              { label: 'Merch', value: 'Brand-provided' },
              { label: 'Demo kit', value: 'Brand-provided' },
            ],
            note: 'Brand provides product list at onboarding.',
          },
          {
            title: 'On-site Presence',
            auto: 'manual',
            rows: [
              { label: 'Brand staff', value: '2 persons' },
              { label: 'Demo station', value: '×1' },
              { label: 'Sampling table', value: '×1' },
              { label: 'Brand assets', value: 'Logo, banner, digital screen' },
            ],
            note: 'BRAND ONLY. ALTR does not staff or manage brand-side ops.',
          },
          {
            title: 'Financial Terms',
            auto: 'auto',
            rows: [
              { label: 'Model', value: 'Revenue Share' },
              { label: 'Upfront fee', value: '$0' },
              { label: 'Brand share', value: '70% of verified sales' },
              { label: 'Venue share', value: '30% of verified sales' },
              { label: 'Deposit', value: 'Not required' },
            ],
            note: 'Auto-calculated by ALTR from POS data. No manual invoice.',
          },
          {
            title: 'Data + Settlement',
            auto: 'auto',
            rows: [
              { label: 'POS system', value: 'Square' },
              { label: 'API connect', value: 'Authorized ✓' },
              { label: 'Sales report', value: 'Real-time auto' },
              { label: 'RS payout', value: 'Auto-split on XRPL' },
              { label: 'Settlement', value: '3 sec · <2%' },
              { label: 'Data sharing', value: 'Post-event ✓' },
            ],
            note: 'Once authorized, fully automated. Brand receives 70% auto on each milestone.',
          },
        ],
      },
    }
  }

  // Generic fallback for any other slug — uses match metadata cosmetically
  return {
    rh: {
      badge: 'RIGHT HOLDER · SELLER',
      type: 'Live IP · venue + audience',
      location: 'See match meta',
      blocks: [
        {
          title: 'Stage Access',
          auto: 'input',
          rows: [
            { label: 'Slot', value: 'Main floor placement' },
            { label: 'Duration', value: 'Activation window' },
            { label: 'Foot traffic', value: 'Self-reported' },
          ],
          note: 'Right Holder provides slot details at onboarding.',
        },
        {
          title: 'Audience Profile',
          auto: 'input',
          rows: [
            { label: 'Reach', value: 'See benchmark' },
            { label: 'Profile', value: 'See match meta' },
          ],
          note: 'Right Holder provides. Phase 2+: ALTR verifies.',
        },
        {
          title: 'Execution Package',
          auto: 'manual',
          rows: [
            { label: 'Setup + teardown', value: 'Included' },
            { label: 'Utilities', value: 'Included' },
            { label: 'Local compliance', value: 'Handled' },
          ],
          note: 'RIGHT HOLDER ONLY. ALTR tracks milestone completion.',
        },
        {
          title: 'Settlement Triggers',
          auto: 'input',
          rows: [
            { label: 'Milestone schedule', value: '3 checkpoints' },
            { label: 'POS environment', value: 'Provided' },
            { label: 'RS payout', value: 'Per terms' },
          ],
          note: 'Right Holder signs off each milestone. ALTR auto-settles.',
        },
      ],
    },
    brand: {
      badge: 'BRAND · BUYER + CONTENT',
      type: `${brand.vertical}`,
      location: `${targetMarket} (from ${homeMarket})`,
      blocks: [
        {
          title: 'Product + Inventory',
          auto: 'input',
          rows: [
            { label: 'Hero SKU', value: 'Brand-provided' },
            { label: 'Sampling', value: 'Brand-provided' },
            { label: 'Merch', value: 'Brand-provided' },
          ],
          note: 'Brand provides product list at onboarding.',
        },
        {
          title: 'On-site Presence',
          auto: 'manual',
          rows: [
            { label: 'Brand staff', value: '2 persons' },
            { label: 'Brand assets', value: 'Logo, banner, screen' },
          ],
          note: 'BRAND ONLY. ALTR does not staff brand-side ops.',
        },
        {
          title: 'Financial Terms',
          auto: 'auto',
          rows: [
            { label: 'Model', value: 'See contract' },
            { label: 'Upfront fee', value: 'Per terms' },
            { label: 'RS rate', value: 'Per terms' },
          ],
          note: 'Auto-calculated by ALTR from POS data.',
        },
        {
          title: 'Data + Settlement',
          auto: 'auto',
          rows: [
            { label: 'POS system', value: 'Square / equiv.' },
            { label: 'Sales report', value: 'Real-time auto' },
            { label: 'Settlement', value: '3 sec · <2%' },
          ],
          note: 'Once authorized, fully automated.',
        },
      ],
    },
  }
}

export function ConfirmStage() {
  const router = useRouter()
  const {
    state: { brand },
    selectedMatch: match,
    hydrated,
  } = useDemoState()
  const [role, setRole] = useState<WaitlistRole | null>(null)
  const [rhAck, setRhAck] = useState(false)
  const [brandAck, setBrandAck] = useState(false)

  // Pull the role the user picked at sign-in (Brand vs LIVE IP).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(
        ROLE_STORAGE_KEY,
      ) as WaitlistRole | null
      if (stored === 'brand' || stored === 'live-ip') setRole(stored)
    } catch {
      /* ignore */
    }
  }, [])

  // Once the user acknowledges their own side, simulate the counterparty
  // acknowledging shortly after. Keeps the demo moving without needing
  // two browsers/sessions.
  useEffect(() => {
    if (role === 'live-ip' && rhAck && !brandAck) {
      const t = window.setTimeout(() => setBrandAck(true), 900)
      return () => window.clearTimeout(t)
    }
    if (role === 'brand' && brandAck && !rhAck) {
      const t = window.setTimeout(() => setRhAck(true), 900)
      return () => window.clearTimeout(t)
    }
  }, [role, rhAck, brandAck])

  if (hydrated && !match) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-[14px] text-altr-text-2">No match selected yet.</p>
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

  const set = buildSet(match.id, brand)

  return (
    <div className="flex flex-col gap-6">
      <Hero brand={brand} matchScore={match.match_score} meta={meta} />

      <div className="grid gap-4 lg:grid-cols-[1fr_minmax(260px,0.85fr)_1fr]">
        <SideCard side="rh" content={set.rh} title={meta.name} />
        <AltrCenter match={match} brand={brand} meta={meta} />
        <SideCard side="brand" content={set.brand} title={brand.brandName} />
      </div>

      <RoiBlock brand={brand} match={match} meta={meta} />

      <OfflineNote />

      <RoleAckPanel
        role={role}
        rhAck={rhAck}
        brandAck={brandAck}
        onAck={(side) => {
          if (side === 'rh') setRhAck(true)
          else setBrandAck(true)
        }}
        onContinue={() => router.push('/contract')}
      />
    </div>
  )
}

function Hero({
  brand,
  matchScore,
  meta,
}: {
  brand: BrandProfile
  matchScore: number
  meta: { shortName: string; name: string }
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-altr-mint-bright/30 bg-altr-mint/[0.06] px-6 py-7 text-center md:px-8 md:py-8">
      <span
        className="font-mono text-[10.5px] tracking-[0.28em] uppercase"
        style={{ color: '#5DCAA5' }}
      >
        Golden Match — Mutual role check
      </span>
      <h1 className="text-[22px] font-bold tracking-[-0.02em] text-altr-white md:text-[26px]">
        {brand.brandName}{' '}
        <span className="text-altr-text-3">×</span> {meta.shortName}
      </h1>
      <p className="text-[12.5px] leading-[1.5] text-altr-text-2">
        Audience fit verified. Deliverables drafted. Each side acknowledges its own
        role before contract terms.
      </p>
      <span className="mt-1 font-mono text-[10.5px] tracking-[0.18em] text-altr-text-3 uppercase">
        {matchScore}% match · {brand.timeline}
      </span>
    </div>
  )
}

function SideCard({
  side,
  content,
  title,
}: {
  side: 'rh' | 'brand'
  content: SideContent
  title: string
}) {
  const accent = side === 'rh' ? '#5DCAA5' : '#A8E6CF'
  const borderColor = side === 'rh' ? 'rgba(93,202,165,0.35)' : 'rgba(168,230,207,0.30)'
  return (
    <section
      className="flex flex-col gap-3 rounded-2xl border bg-altr-card p-5 md:p-6"
      style={{ borderColor }}
    >
      <div className="flex flex-col gap-1.5">
        <span
          className="self-start rounded-full border px-2.5 py-1 font-mono text-[9.5px] tracking-[0.18em] uppercase"
          style={{ borderColor, color: accent, background: 'rgba(93,202,165,0.06)' }}
        >
          {content.badge}
        </span>
        <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-altr-white">
          {title}
        </h2>
        <p className="text-[11.5px] text-altr-text-2">{content.type}</p>
        <p className="font-mono text-[10.5px] tracking-[0.05em] text-altr-text-3">
          {content.location}
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        {content.blocks.map((b) => (
          <DeliverableCard key={b.title} block={b} />
        ))}
      </div>
    </section>
  )
}

function DeliverableCard({ block }: { block: Block }) {
  const cfg = BADGE[block.auto]
  return (
    <div className="rounded-lg border border-white/[0.06] bg-black/30 p-3.5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-altr-white">
          {block.title}
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.18em]"
          style={{ borderColor: cfg.border, background: cfg.bg, color: cfg.color }}
        >
          {cfg.label}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {block.rows.map((r) => (
          <div
            key={r.label}
            className="flex items-baseline justify-between gap-3 text-[11.5px]"
          >
            <span className="text-altr-text-3">{r.label}</span>
            <span className="text-right text-altr-white">{r.value}</span>
          </div>
        ))}
      </div>
      <p
        className="mt-2 border-t border-white/[0.06] pt-2 text-[10.5px] leading-[1.5]"
        style={{ color: cfg.color }}
      >
        {block.note}
      </p>
    </div>
  )
}

function AltrCenter({
  match,
  brand,
  meta,
}: {
  match: { match_score: number; roi_prediction: { rs_rate: number; benchmark_deals: number } }
  brand: BrandProfile
  meta: { shortName: string }
}) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-altr-card p-5 md:p-6">
      <div className="flex flex-col gap-1.5">
        <span
          className="self-start rounded-full border border-white/[0.1] bg-black/40 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.2em] text-white/70 uppercase"
        >
          ALTR · Rail ready
        </span>
        <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-altr-white">
          Match verified
        </h2>
        <p className="text-[11.5px] text-altr-text-2">
          {brand.brandName} × {meta.shortName}
        </p>
      </div>

      <div className="rounded-lg border border-white/[0.06] bg-black/30 p-3.5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-altr-white">
            ALTR Confirms
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.18em]"
            style={{
              borderColor: BADGE.auto.border,
              background: BADGE.auto.bg,
              color: BADGE.auto.color,
            }}
          >
            AUTO
          </span>
        </div>
        <ul className="flex flex-col gap-1 text-[11.5px] text-altr-text-2">
          <Check>Audience fit verified</Check>
          <Check>ROI estimate generated</Check>
          <Check>RS terms set (Brand 70 / Venue 30)</Check>
          <Check>Milestones defined (×3)</Check>
          <Check>FX route set ({homeFx(brand)})</Check>
          <Check>POS API linkage ready</Check>
          <Check>Settlement layer configured</Check>
          <Check>Contract draft ready</Check>
        </ul>
      </div>

      <div className="rounded-lg border border-white/[0.06] bg-black/30 px-4 py-5 text-center">
        <div
          className="font-mono text-[36px] font-bold leading-none tracking-[-0.02em]"
          style={{ color: '#5DCAA5' }}
        >
          {match.match_score}
          <span className="text-altr-text-3">/100</span>
        </div>
        <div className="mt-1 font-mono text-[10px] tracking-[0.22em] text-altr-text-3 uppercase">
          Match score
        </div>
        <p className="mt-3 text-[11.5px] text-altr-text-2">
          Based on {match.roi_prediction.benchmark_deals} similar activations
        </p>
        <p className="font-mono text-[10px] tracking-[0.18em] text-altr-text-3 uppercase">
          {brand.vertical.split(' ')[0]} × GCC × Live event
        </p>
        <p
          className="mt-2 font-mono text-[10px] tracking-[0.22em] uppercase"
          style={{ color: '#5DCAA5' }}
        >
          Confidence · HIGH
        </p>
      </div>

      <div className="rounded-lg border border-white/[0.05] bg-black/20 p-3 text-[10.5px] leading-[1.55] text-altr-text-3">
        <div className="mb-1 font-mono text-[9.5px] tracking-[0.22em] text-altr-text-3 uppercase">
          ALTR fee structure
        </div>
        · Commission: 10–15% charged to Seller (Right Holder)
        <br />
        · Settlement fee: &lt;2% per transaction
        <br />· Subscription: separate
      </div>
    </section>
  )
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-[2px] flex-shrink-0" style={{ color: '#5DCAA5' }}>
        ✓
      </span>
      <span>{children}</span>
    </li>
  )
}

function homeFx(brand: BrandProfile): string {
  const first = brand.currentMarkets[0] ?? 'Korea'
  const home =
    first === 'Japan' ? 'JPY' :
    first === 'China' ? 'CNY' :
    first === 'Taiwan' ? 'TWD' :
    first === 'Singapore' ? 'SGD' :
    'KRW'
  const t = brand.targetMarket
  const target =
    t.includes('UAE') || t.includes('GCC') ? 'AED' :
    t.includes('Saudi') ? 'SAR' :
    t.includes('Japan') ? 'JPY' :
    t.includes('Europe') ? 'EUR' :
    'USD'
  return `${home} → ${target}`
}

function fmtK(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

function RoiBlock({
  brand,
  match,
  meta,
}: {
  brand: BrandProfile
  match: {
    roi_prediction: {
      foot_traffic_min: number
      foot_traffic_max: number
      projected_sales_min: number
      projected_sales_max: number
      rs_payout_min: number
      rs_payout_max: number
      rs_rate: number
      benchmark_deals: number
    }
    match_score: number
  }
  meta: { shortName: string; visitors: string }
}) {
  const roi = match.roi_prediction
  const sales = `$${(roi.projected_sales_min / 1000).toFixed(0)}K – $${(roi.projected_sales_max / 1000).toFixed(0)}K`
  const brandShare = `$${(roi.projected_sales_min * 0.7 / 1000).toFixed(1)}K – $${(roi.projected_sales_max * 0.7 / 1000).toFixed(1)}K`
  const venueShare = `$${(roi.projected_sales_min * 0.3 / 1000).toFixed(1)}K – $${(roi.projected_sales_max * 0.3 / 1000).toFixed(1)}K`
  const footMin = fmtK(roi.foot_traffic_min)
  const footMax = fmtK(roi.foot_traffic_max)
  const avgRev = `$${Math.round(((roi.projected_sales_min + roi.projected_sales_max) / 2) / 1000)}K`
  const topPerf = `$${Math.round(roi.projected_sales_max * 1.35 / 1000)}K`

  return (
    <section className="rounded-2xl border border-white/[0.06] bg-altr-card p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-altr-white">
              ALTR ROI Estimate · Pre-deal
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.18em]"
              style={{
                borderColor: BADGE.auto.border,
                background: BADGE.auto.bg,
                color: BADGE.auto.color,
              }}
            >
              AUTO
            </span>
          </div>
          <p className="text-[11.5px] leading-[1.5] text-altr-text-2">
            Based on {roi.benchmark_deals} similar {brand.vertical.split(' ')[0].toLowerCase()} activations
            at GCC tech / lifestyle events. Actual results tracked live via POS API.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RoiCol
          title="Revenue Projection"
          rows={[
            { label: 'Expected sales', value: sales },
            { label: 'Brand (70%)', value: brandShare },
            { label: 'Venue (30%)', value: venueShare },
            { label: 'Confidence', value: 'HIGH', emphasis: true },
          ]}
        />
        <RoiCol
          title="Conversion Metrics"
          rows={[
            { label: 'Foot traffic', value: meta.visitors },
            { label: 'Beauty segment', value: `~${fmtK(roi.foot_traffic_max * 0.2)}` },
            { label: 'Booth visitors', value: `${footMin} – ${footMax}` },
            { label: 'Conv. rate', value: '8 – 12%' },
            { label: 'AOV', value: '$35 – $55' },
          ]}
        />
        <RoiCol
          title="Benchmark Comparison"
          rows={[
            { label: 'Avg revenue', value: avgRev },
            { label: 'Avg conversion', value: '10.3%' },
            { label: 'Avg AOV', value: '$47' },
            { label: 'Top performer', value: topPerf },
            { label: 'This deal', value: `${match.match_score} / 100`, emphasis: true },
          ]}
        />
        <RoiCol
          title="Brand Value Beyond Revenue"
          rows={[
            { label: 'Market entry', value: `${brand.targetMarket.split(' ')[0]} (first)` },
            { label: 'Press exposure', value: '~50 outlets' },
            { label: 'Social reach', value: `${meta.shortName.split(' ')[0]} tag 2M+` },
            { label: 'Buyer leads', value: '3 – 5 est.' },
            { label: 'Brand equity', value: `"At ${meta.shortName}"` },
          ]}
        />
      </div>

      <p className="mt-4 text-[10.5px] leading-[1.55] text-altr-text-3">
        Estimates based on benchmark data from similar activations. Actual results depend on
        execution quality and market conditions. Phase 0–1: industry + comparable event benchmarks.
        Phase 2+: ALTR-verified transaction data (50+ deals).
      </p>
    </section>
  )
}

function RoiCol({
  title,
  rows,
}: {
  title: string
  rows: Array<{ label: string; value: string; emphasis?: boolean }>
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-black/30 p-3.5">
      <div
        className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em]"
        style={{ color: '#5DCAA5' }}
      >
        {title}
      </div>
      <div className="flex flex-col gap-1.5">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-baseline justify-between gap-2 text-[11.5px]"
          >
            <span className="text-altr-text-3">{r.label}</span>
            <span
              className={`text-right ${r.emphasis ? 'font-semibold' : ''}`}
              style={{ color: r.emphasis ? '#5DCAA5' : '#FFFFFF' }}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function OfflineNote() {
  const cfg = BADGE.manual
  return (
    <section
      className="rounded-2xl border border-dashed bg-black/20 p-5 md:p-6"
      style={{ borderColor: cfg.border }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-altr-text-2">
          Right Holder Zone
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.18em]"
          style={{ borderColor: cfg.border, background: cfg.bg, color: cfg.color }}
        >
          MANUAL
        </span>
      </div>
      <p className="text-[12px] leading-[1.6] text-altr-text-2">
        Between contract signing and first milestone: booth setup, local staff coordination,
        logistics, on-site operations. This is the Right Holder&apos;s domain. ALTR tracks
        milestone completion. ALTR does not execute offline operations.
      </p>
    </section>
  )
}

function RoleAckPanel({
  role,
  rhAck,
  brandAck,
  onAck,
  onContinue,
}: {
  role: WaitlistRole | null
  rhAck: boolean
  brandAck: boolean
  onAck: (side: 'rh' | 'brand') => void
  onContinue: () => void
}) {
  const bothAck = rhAck && brandAck
  // If role isn't set yet (user skipped sign-in), let either side act.
  const userIsRh = role === 'live-ip' || role === null
  const userIsBrand = role === 'brand' || role === null

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-altr-card p-5 md:p-6">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-altr-white">
          Acknowledge mutual roles
        </span>
        <p className="text-[12px] leading-[1.55] text-altr-text-2">
          Both parties confirm they understand each other&apos;s deliverables. This is
          not a contract — binding terms are signed on the next step.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AckTile
          side="rh"
          ack={rhAck}
          isUserSide={userIsRh}
          onAck={() => onAck('rh')}
        />
        <AckTile
          side="brand"
          ack={brandAck}
          isUserSide={userIsBrand}
          onAck={() => onAck('brand')}
        />
      </div>

      <button
        type="button"
        disabled={!bothAck}
        onClick={onContinue}
        className="rounded-lg bg-altr-mint px-5 py-3 text-[14px] font-semibold text-altr-white transition enabled:hover:bg-altr-mint-bright disabled:cursor-not-allowed disabled:bg-altr-mint/15 disabled:text-altr-text-3"
      >
        {bothAck
          ? 'Proceed to contract terms →'
          : 'Proceed to contract terms — both must acknowledge'}
      </button>
    </section>
  )
}

function AckTile({
  side,
  ack,
  isUserSide,
  onAck,
}: {
  side: 'rh' | 'brand'
  ack: boolean
  isUserSide: boolean
  onAck: () => void
}) {
  const label = side === 'rh' ? 'LIVE IP role' : 'Brand role'
  const accent = side === 'rh' ? '#5DCAA5' : '#A8E6CF'

  if (ack) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-1 rounded-lg border bg-black/30 px-4 py-3.5 text-center"
        style={{ borderColor: 'rgba(93,202,165,0.35)' }}
      >
        <span
          className="font-mono text-[10.5px] tracking-[0.22em] uppercase"
          style={{ color: '#5DCAA5' }}
        >
          ✓ {label} acknowledged
        </span>
        <span className="text-[11px] text-altr-text-3">
          {isUserSide ? 'by you' : 'by counterparty'}
        </span>
      </div>
    )
  }

  if (!isUserSide) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/[0.12] bg-black/15 px-4 py-3.5 text-center">
        <span className="font-mono text-[10.5px] tracking-[0.22em] text-altr-text-3 uppercase">
          Waiting · {label}
        </span>
        <span className="text-[11px] text-altr-text-3">
          counterparty hasn&apos;t acknowledged yet
        </span>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onAck}
      className="rounded-lg border bg-altr-bg/30 px-4 py-3.5 text-center text-[13px] font-medium text-altr-white transition hover:bg-altr-bg/60"
      style={{ borderColor: accent + '55' }}
    >
      I acknowledge — {label}
    </button>
  )
}
