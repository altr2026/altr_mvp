'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { StepShell } from '@/components/demo/StepShell'
import { useDemoState } from '@/components/providers/DemoStateProvider'
import {
  MATCH_META,
  type BrandProfile,
  type MatchMeta,
} from '@/lib/demo-state'

function homeCurrency(brand: BrandProfile): string {
  const first = brand.currentMarkets[0] ?? 'Korea'
  if (first === 'Japan') return 'JPY'
  if (first === 'China') return 'CNY'
  if (first === 'Taiwan') return 'TWD'
  if (first === 'Singapore') return 'SGD'
  if (first === 'Hong Kong') return 'HKD'
  return 'KRW'
}

function targetCurrency(brand: BrandProfile): string {
  const t = brand.targetMarket
  if (t.includes('UAE') || t.includes('GCC')) return 'AED'
  if (t.includes('Saudi')) return 'SAR'
  if (t.includes('Japan')) return 'JPY'
  if (t.includes('Southeast')) return 'SGD'
  if (t.includes('Europe')) return 'EUR'
  return 'USD'
}

function rateUSD(currency: string): number {
  // approximate units of {currency} per 1 USD — demo values
  switch (currency) {
    case 'KRW': return 1330
    case 'JPY': return 155
    case 'CNY': return 7.2
    case 'TWD': return 32
    case 'HKD': return 7.8
    case 'SGD': return 1.34
    case 'AED': return 3.67
    case 'SAR': return 3.75
    case 'EUR': return 0.92
    case 'USD':
    case 'USDC':
    default: return 1
  }
}

function parseMaxBudget(range: string): number {
  const matches = range.match(/\$(\d+(?:\.\d+)?)([KMkm])/g)
  if (!matches || matches.length === 0) return 50_000
  const last = matches[matches.length - 1]
  const m = last.match(/\$(\d+(?:\.\d+)?)([KMkm])/)
  if (!m) return 50_000
  const value = Number(m[1])
  const unit = (m[2] ?? '').toLowerCase()
  if (unit === 'm') return value * 1_000_000
  return value * 1_000
}

function fmtUSD(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

function fmtCount(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

// USD-primary format. Non-USD currencies show local equivalent in parens.
// USDC is 1:1 with USD so it just shows as USDC count.
function fmtLocal(amountInUsd: number, currency: string): string {
  if (currency === 'USDC') {
    return `${fmtCount(amountInUsd)} USDC`
  }
  if (currency === 'USD') {
    return fmtUSD(amountInUsd)
  }
  const local = fmtCount(amountInUsd * rateUSD(currency))
  return `${fmtUSD(amountInUsd)} (= ${local} ${currency})`
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function quarterStart(timing: string): Date {
  const m = timing.match(/Q(\d)\s+(\d{4})/)
  if (m) {
    const q = Number(m[1])
    const year = Number(m[2])
    return new Date(year, (q - 1) * 3, 1)
  }
  return new Date()
}

function addDays(d: Date, n: number): Date {
  const nd = new Date(d)
  nd.setDate(nd.getDate() + n)
  return nd
}

// ── Money model ────────────────────────────────────────────────────────────
// STREAM A: SPONSORSHIP CAPITAL (one-time, Brand → LIVE IP)
//   Brand deposits sponsorshipUsd in KRW → Wise → USDC → Escrow → Ripple → LIVE IP in AED
//
// STREAM B: REVENUE SHARE (RS deal only, real-time during deal period)
//   POS sales in AED → normalized USDC → AUTO-SPLIT
//     ├─ rsRatio% → Ripple ODL → Brand wallet (in KRW)   ← THIS is the "RS payout"
//     └─ (100-rsRatio)% → LIVE IP retains (normal revenue)
//
//   The $50K sponsorship is NOT split. The 15/85 split applies only to POS revenue.
// ───────────────────────────────────────────────────────────────────────────

const POS_REVENUE_MULTIPLE = 4 // demo assumption: POS over deal period ≈ 4× sponsorship

export default function RailPage() {
  return (
    <StepShell currentStep={5}>
      <RailLayer />
    </StepShell>
  )
}

function RailLayer() {
  const router = useRouter()
  const { state, selectedMatch } = useDemoState()
  const brand = state.brand
  const matchMeta = selectedMatch
    ? MATCH_META[selectedMatch.id]
    : MATCH_META.frieze

  const sponsorshipUsd = useMemo(
    () => parseMaxBudget(brand.budgetRange),
    [brand.budgetRange],
  )
  const homeCurr = homeCurrency(brand)
  const targetCurr = targetCurrency(brand)
  const rsRatio = 15

  // Stream A: sponsorship
  const sponsorAfterWise = sponsorshipUsd * 0.996 // -0.4%
  const sponsorAtEscrow = sponsorAfterWise // Circle is 1:1, free
  const sponsorAtLiveIp = sponsorAtEscrow * 0.997 // Ripple -0.3% to AED

  // Stream B: revenue share (RS deal only)
  const posTotalUsd = sponsorshipUsd * POS_REVENUE_MULTIPLE // ≈ $200K
  const rsToBrandUsd = posTotalUsd * (rsRatio / 100) // ≈ $30K
  const liveIpRetainedUsd = posTotalUsd - rsToBrandUsd // ≈ $170K
  const rsToBrandAfterRipple = rsToBrandUsd * 0.997 // -0.3%

  // ALTR transaction-fee revenue across both streams (0.4%)
  const altrTxFeesUsd =
    sponsorshipUsd * 0.004 + rsToBrandUsd * 0.004

  const start = quarterStart(matchMeta.timing)
  const handleNext = () => router.push('/report')

  return (
    <div className="px-6 pb-24 pt-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Header brand={brand} matchMeta={matchMeta} />

        <PathOverview
          homeCurr={homeCurr}
          targetCurr={targetCurr}
          sponsorshipUsd={sponsorshipUsd}
          posTotalUsd={posTotalUsd}
          rsRatio={rsRatio}
        />

        <SponsorshipStream
          brand={brand}
          matchMeta={matchMeta}
          sponsorshipUsd={sponsorshipUsd}
          sponsorAfterWise={sponsorAfterWise}
          sponsorAtEscrow={sponsorAtEscrow}
          sponsorAtLiveIp={sponsorAtLiveIp}
          homeCurr={homeCurr}
          targetCurr={targetCurr}
        />

        <RevenueShareStream
          brand={brand}
          matchMeta={matchMeta}
          rsRatio={rsRatio}
          posTotalUsd={posTotalUsd}
          rsToBrandUsd={rsToBrandUsd}
          liveIpRetainedUsd={liveIpRetainedUsd}
          rsToBrandAfterRipple={rsToBrandAfterRipple}
          homeCurr={homeCurr}
          targetCurr={targetCurr}
        />

        <NetPosition
          sponsorshipUsd={sponsorshipUsd}
          sponsorAtLiveIp={sponsorAtLiveIp}
          rsToBrandUsd={rsToBrandUsd}
          liveIpRetainedUsd={liveIpRetainedUsd}
        />

        <WalletCards
          brand={brand}
          matchMeta={matchMeta}
          sponsorAtLiveIp={sponsorAtLiveIp}
          liveIpRetainedUsd={liveIpRetainedUsd}
          rsToBrandAfterRipple={rsToBrandAfterRipple}
          altrTxFeesUsd={altrTxFeesUsd}
          homeCurr={homeCurr}
          targetCurr={targetCurr}
        />

        <SettlementSchedule
          brand={brand}
          matchMeta={matchMeta}
          start={start}
          sponsorshipUsd={sponsorshipUsd}
          sponsorAtEscrow={sponsorAtEscrow}
          rsToBrandUsd={rsToBrandUsd}
        />

        <EscrowDepletion start={start} sponsorAtEscrow={sponsorAtEscrow} />

        <div className="mt-10 flex flex-col items-end gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
            All milestones settled · Ready to close loop
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-lg bg-[#5DCAA5] px-6 py-3 text-[13px] font-semibold text-[#06120E] transition hover:bg-[#7BD7B7]"
          >
            Generate ROI report →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes altr-rail-dot {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes altr-escrow-glow {
          0%, 100% {
            box-shadow:
              0 0 0 1px rgba(239,159,39,0.6) inset,
              0 0 28px 4px rgba(239,159,39,0.18);
          }
          50% {
            box-shadow:
              0 0 0 1px rgba(239,159,39,0.85) inset,
              0 0 36px 8px rgba(239,159,39,0.32);
          }
        }
        @keyframes altr-bar-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .altr-dot {
          animation: altr-rail-dot 7s linear infinite;
        }
        .altr-escrow-glow {
          animation: altr-escrow-glow 2.6s ease-in-out infinite;
        }
        .altr-bar-grow {
          transform-origin: left center;
          animation: altr-bar-grow 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

function Header({
  brand,
  matchMeta,
}: {
  brand: BrandProfile
  matchMeta: MatchMeta
}) {
  return (
    <header className="flex flex-col gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#5DCAA5]">
        SETTLEMENT RAIL · LIVE
      </span>
      <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-white md:text-[26px]">
        Money journey — {brand.brandName || 'Brand'} ×{' '}
        {matchMeta.shortName}
      </h1>
      <p className="text-[13px] leading-[1.55] text-white/55 md:text-[14px]">
        Two distinct streams traverse the rail. The{' '}
        <span className="text-[#5DCAA5]">sponsorship capital</span> moves
        once, upfront — Brand pays for the presence. The{' '}
        <span className="text-[#A8E6CF]">revenue share</span> trickles
        back in real-time as the event sells — Brand earns from
        performance. On RS deals,{' '}
        <span className="text-white">both apply simultaneously</span>, so
        Brand's effective cost is the sponsorship minus what RS recovers.
      </p>
    </header>
  )
}

function PathOverview({
  homeCurr,
  targetCurr,
  sponsorshipUsd,
  posTotalUsd,
  rsRatio,
}: {
  homeCurr: string
  targetCurr: string
  sponsorshipUsd: number
  posTotalUsd: number
  rsRatio: number
}) {
  return (
    <section className="mt-6 flex flex-col gap-2 rounded-2xl border border-white/[0.06] bg-black/30 p-3 md:p-4">
      <PathRow
        label="Sponsorship"
        amount={`${fmtUSD(sponsorshipUsd)} · one-time`}
        accent="#5DCAA5"
        steps={[homeCurr, 'USD', 'USDC', 'Escrow', targetCurr]}
      />
      <PathRow
        label="RS revenue"
        amount={`${rsRatio}% of ~${fmtUSD(posTotalUsd)} POS · real-time`}
        accent="#A8E6CF"
        steps={[targetCurr, 'USDC', 'Split', homeCurr]}
      />
    </section>
  )
}

function PathRow({
  label,
  amount,
  accent,
  steps,
}: {
  label: string
  amount: string
  accent: string
  steps: string[]
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em]"
        style={{ color: accent }}
      >
        {label}
      </span>
      <div className="flex flex-1 flex-wrap items-center gap-1.5">
        {steps.map((s, i) => (
          <span key={s + i} className="flex items-center gap-1.5">
            <span
              className="rounded border border-white/[0.08] bg-black/40 px-2 py-1 font-mono text-[10.5px] text-white/85"
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <span className="text-white/30">→</span>
            )}
          </span>
        ))}
      </div>
      <span
        className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.18em]"
        style={{ color: accent }}
      >
        {amount}
      </span>
    </div>
  )
}

type NodeAccent = 'teal' | 'lightgreen' | 'amber'

function SponsorshipStream({
  brand,
  matchMeta,
  sponsorshipUsd,
  sponsorAfterWise,
  sponsorAtEscrow,
  sponsorAtLiveIp,
  homeCurr,
  targetCurr,
}: {
  brand: BrandProfile
  matchMeta: MatchMeta
  sponsorshipUsd: number
  sponsorAfterWise: number
  sponsorAtEscrow: number
  sponsorAtLiveIp: number
  homeCurr: string
  targetCurr: string
}) {
  return (
    <section
      className="relative mt-6 rounded-2xl border bg-black/30 p-5 md:p-6"
      style={{ borderColor: 'rgba(93,202,165,0.25)' }}
    >
      <SectionLabel
        index="A"
        title="Sponsorship capital · one-time"
        accent="#5DCAA5"
        sub={`${fmtUSD(sponsorshipUsd)} leaves Brand · ~${fmtUSD(sponsorAtLiveIp)} arrives at LIVE IP after fees`}
      />

      <div className="relative mt-5">
        <RailColumn />
        <div className="flex flex-col gap-3 sm:pl-10">
          <Node
            icon="◉"
            title={brand.brandName || 'Brand'}
            subtitle="origin wallet"
            amountOut={fmtLocal(sponsorshipUsd, homeCurr)}
            timing="t = 0"
            accent="teal"
          />
          <Connector label="deposits" />
          <Node
            icon="↔"
            title="Wise FX"
            subtitle={`${homeCurr} → USD · external partner`}
            amountIn={fmtLocal(sponsorshipUsd, homeCurr)}
            amountOut={fmtLocal(sponsorAfterWise, 'USD')}
            fee="−0.4% to Wise"
            timing="~3 s"
            accent="teal"
          />
          <Connector label="converts" />
          <Node
            icon="⬡"
            title="Circle Mint"
            subtitle="USD → USDC"
            amountIn={fmtLocal(sponsorAfterWise, 'USD')}
            amountOut={fmtLocal(sponsorAtEscrow, 'USDC')}
            fee="free"
            timing="<1 s"
            accent="teal"
          />
          <Connector label="mints" />
          <Node
            icon="🔒"
            title="XRPL Escrow"
            subtitle="locked on-chain · sponsorship capital"
            amountOut={fmtLocal(sponsorAtEscrow, 'USDC')}
            fee="$0.0000152 fee"
            timing="3 s · permanent"
            accent="amber"
            glow
          >
            <p className="mt-2 text-[11px] leading-[1.5] text-[#EF9F27]/85">
              Hash-locked. Releases per milestone schedule (M1 · M2 · M3).
              This pool holds ONLY the sponsorship $50K — RS payouts use a
              separate stream below.
            </p>
          </Node>
          <Connector label="releases per milestone" />
          <Node
            icon="↗"
            title="Ripple ODL"
            subtitle={`USDC → ${targetCurr}`}
            amountIn={fmtLocal(sponsorAtEscrow, 'USDC')}
            amountOut={fmtLocal(sponsorAtLiveIp, targetCurr)}
            fee="−0.3% fee"
            timing="~2 s"
            accent="teal"
          />
          <Connector label="settles" />
          <Node
            icon="◉"
            title={matchMeta.shortName}
            subtitle="LIVE IP wallet · sponsorship received"
            amountOut={fmtLocal(sponsorAtLiveIp, targetCurr)}
            timing="received"
            accent="teal"
          />
        </div>
      </div>
    </section>
  )
}

function RevenueShareStream({
  brand,
  matchMeta,
  rsRatio,
  posTotalUsd,
  rsToBrandUsd,
  liveIpRetainedUsd,
  rsToBrandAfterRipple,
  homeCurr,
  targetCurr,
}: {
  brand: BrandProfile
  matchMeta: MatchMeta
  rsRatio: number
  posTotalUsd: number
  rsToBrandUsd: number
  liveIpRetainedUsd: number
  rsToBrandAfterRipple: number
  homeCurr: string
  targetCurr: string
}) {
  return (
    <section
      className="relative mt-6 rounded-2xl border bg-black/30 p-5 md:p-6"
      style={{ borderColor: 'rgba(168,230,207,0.25)' }}
    >
      <SectionLabel
        index="B"
        title="Revenue share · real-time"
        accent="#A8E6CF"
        sub={`POS revenue auto-splits live · ${rsRatio}% to Brand · ${100 - rsRatio}% retained by LIVE IP · only on RS deals`}
      />

      <div className="relative mt-5">
        <RailColumn />
        <div className="flex flex-col gap-3 sm:pl-10">
          <Node
            icon="📊"
            title={`${matchMeta.shortName} POS`}
            subtitle={`Lightspeed feed · live sales in ${targetCurr}`}
            amountOut={`~${fmtLocal(posTotalUsd, targetCurr)} over deal period`}
            fee="estimated"
            timing="real-time"
            accent="lightgreen"
          >
            <p className="mt-2 text-[11px] leading-[1.5] text-white/55">
              Estimate ~{POS_REVENUE_MULTIPLE}× sponsorship based on
              comparable activations. Actual splits accrue per-sale.
            </p>
          </Node>
          <Connector label="per sale" />
          <Node
            icon="÷"
            title="AUTO-SPLIT"
            subtitle={`${rsRatio}% RS · ${100 - rsRatio}% retained · rule-based on-chain`}
            amountIn={`~${fmtLocal(posTotalUsd, targetCurr)} (cumulative)`}
            fee="rule-based"
            timing="~1 s / sale"
            accent="lightgreen"
          >
            <div className="mt-3 flex flex-col gap-1.5">
              <SplitBar
                label={`${100 - rsRatio}% LIVE IP retains`}
                value={100 - rsRatio}
                color="#5DCAA5"
                amount={fmtLocal(liveIpRetainedUsd, targetCurr)}
              />
              <SplitBar
                label={`${rsRatio}% to Brand (RS payout)`}
                value={rsRatio}
                color="#A8E6CF"
                amount={fmtLocal(rsToBrandUsd, targetCurr)}
              />
            </div>
          </Node>

          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <Node
              icon="↗"
              title="Ripple ODL"
              subtitle={`USDC → ${homeCurr} · Brand RS path`}
              amountIn={fmtLocal(rsToBrandUsd, 'USDC')}
              amountOut={fmtLocal(rsToBrandAfterRipple, homeCurr)}
              fee="−0.3% fee"
              timing="~2 s"
              accent="lightgreen"
            />
            <Node
              icon="◉"
              title={matchMeta.shortName}
              subtitle={`${100 - rsRatio}% retained · stays in LIVE IP's ${targetCurr} account`}
              amountOut={fmtLocal(liveIpRetainedUsd, targetCurr)}
              timing="real-time"
              accent="teal"
            />
            <Node
              icon="◉"
              title={brand.brandName || 'Brand'}
              subtitle={`Brand wallet · RS received in ${homeCurr}`}
              amountOut={fmtLocal(rsToBrandAfterRipple, homeCurr)}
              timing="ongoing"
              accent="teal"
            />
            <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3.5 md:p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                Why two streams?
              </p>
              <p className="mt-2 text-[11.5px] leading-[1.5] text-white/65">
                Sponsorship is what the Brand pre-pays for{' '}
                <span className="text-white">presence</span>. Revenue
                share is what they earn back from{' '}
                <span className="text-white">performance</span>. They flow
                in opposite directions on different timelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function RailColumn() {
  return (
    <div className="pointer-events-none absolute left-3 top-0 bottom-0 hidden w-1.5 sm:block">
      <div className="absolute inset-0 rounded-full bg-white/[0.04]" />
      <div
        className="altr-dot absolute h-2.5 w-2.5 -translate-x-[2px] rounded-full"
        style={{
          background: '#5DCAA5',
          boxShadow: '0 0 12px 2px rgba(93,202,165,0.6)',
        }}
      />
    </div>
  )
}

function SectionLabel({
  index,
  title,
  accent,
  sub,
}: {
  index: string
  title: string
  accent: string
  sub: string
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-3">
      <span
        className="rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em]"
        style={{ background: accent + '22', color: accent }}
      >
        Stream {index}
      </span>
      <h2 className="text-[14.5px] font-semibold tracking-tight text-white">
        {title}
      </h2>
      <span className="w-full text-[11.5px] leading-[1.5] text-white/55 sm:w-auto sm:flex-1">
        {sub}
      </span>
    </div>
  )
}

type NodeProps = {
  icon: string
  title: string
  subtitle: string
  amountIn?: string
  amountOut?: string
  fee?: string
  timing?: string
  accent?: NodeAccent
  glow?: boolean
  children?: React.ReactNode
}

function Node({
  icon,
  title,
  subtitle,
  amountIn,
  amountOut,
  fee,
  timing,
  accent = 'teal',
  glow = false,
  children,
}: NodeProps) {
  const colorMap = {
    teal: { border: 'rgba(93,202,165,0.4)', text: '#5DCAA5' },
    lightgreen: { border: 'rgba(168,230,207,0.4)', text: '#A8E6CF' },
    amber: { border: 'rgba(239,159,39,0.5)', text: '#EF9F27' },
  }
  const c = colorMap[accent]

  return (
    <div
      className={`rounded-xl border bg-black/40 p-3.5 md:p-4 ${glow ? 'altr-escrow-glow' : ''}`}
      style={{ borderColor: glow ? '#EF9F27aa' : c.border }}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[15px]"
          style={{
            background: glow
              ? 'rgba(239,159,39,0.18)'
              : 'rgba(255,255,255,0.04)',
            color: c.text,
          }}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[13.5px] font-semibold tracking-tight text-white">
              {title}
            </h3>
            {timing && (
              <span
                className="font-mono text-[10px] uppercase tracking-[0.16em]"
                style={{ color: c.text }}
              >
                {timing}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11.5px] text-white/55">{subtitle}</p>

          {(amountIn || amountOut || fee) && (
            <div className="mt-2 flex flex-col gap-1 font-mono text-[11px]">
              {amountIn && (
                <span className="text-white/45">
                  in · <span className="text-white/85">{amountIn}</span>
                </span>
              )}
              {amountOut && (
                <span className="text-white/45">
                  out ·{' '}
                  <span
                    className="text-white/95"
                    style={{ color: glow ? '#EF9F27' : undefined }}
                  >
                    {amountOut}
                  </span>
                </span>
              )}
              {fee && (
                <span
                  className="mt-1 inline-flex w-fit rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em]"
                  style={{
                    borderColor: c.border,
                    color: c.text,
                  }}
                >
                  {fee}
                </span>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  )
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-0.5">
      <span className="h-3 w-px bg-white/[0.12]" />
      <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/35">
        {label}
      </span>
      <span className="h-3 w-px bg-white/[0.12]" />
    </div>
  )
}

function SplitBar({
  label,
  value,
  color,
  amount,
}: {
  label: string
  value: number
  color: string
  amount: string
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-[10.5px]">
        <span className="text-white/70">{label}</span>
        <span className="font-mono text-white/85">{amount}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="altr-bar-grow h-full rounded-full"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  )
}

function NetPosition({
  sponsorshipUsd,
  sponsorAtLiveIp,
  rsToBrandUsd,
  liveIpRetainedUsd,
}: {
  sponsorshipUsd: number
  sponsorAtLiveIp: number
  rsToBrandUsd: number
  liveIpRetainedUsd: number
}) {
  const brandNetCost = sponsorshipUsd - rsToBrandUsd
  const recoveryPct = (rsToBrandUsd / sponsorshipUsd) * 100
  const liveIpGross = sponsorAtLiveIp + liveIpRetainedUsd

  return (
    <section className="mt-6 rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
          Net economic position · RS deal
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          both streams together
        </span>
      </div>
      <p className="mt-1 text-[11.5px] leading-[1.5] text-white/55">
        On an RS deal, Brand pays the sponsorship AND receives the RS
        slice. Not double-pay — the RS recovers part of the upfront
        outlay through performance.
      </p>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-[#5DCAA5]/30 bg-black/40 p-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#5DCAA5]">
            Brand · net cost
          </span>
          <div className="mt-3 flex flex-col gap-1.5 font-mono text-[12px]">
            <NetRow
              label="Sponsorship paid (out)"
              value={`−${fmtUSD(sponsorshipUsd)}`}
              color="#F87171"
            />
            <NetRow
              label={`RS payout received (in, ~${recoveryPct.toFixed(0)}% recovery)`}
              value={`+${fmtUSD(rsToBrandUsd)}`}
              color="#5DCAA5"
            />
            <hr className="my-1 border-white/[0.06]" />
            <NetRow
              label="Effective sponsorship cost"
              value={`−${fmtUSD(brandNetCost)}`}
              color="#fff"
              bold
            />
          </div>
          <p className="mt-3 text-[11px] leading-[1.5] text-white/55">
            Brand secures presence for {fmtUSD(sponsorshipUsd)} guaranteed,
            then recoups {fmtUSD(rsToBrandUsd)} from performance. Net out
            of pocket: {fmtUSD(brandNetCost)}.
          </p>
        </div>

        <div className="rounded-xl border border-[#5DCAA5]/30 bg-black/40 p-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#5DCAA5]">
            LIVE IP · gross take
          </span>
          <div className="mt-3 flex flex-col gap-1.5 font-mono text-[12px]">
            <NetRow
              label="Sponsorship received (Stream A)"
              value={`+${fmtUSD(sponsorAtLiveIp)}`}
              color="#5DCAA5"
            />
            <NetRow
              label={`POS retained (Stream B, 85%)`}
              value={`+${fmtUSD(liveIpRetainedUsd)}`}
              color="#5DCAA5"
            />
            <hr className="my-1 border-white/[0.06]" />
            <NetRow
              label="Gross combined revenue"
              value={`+${fmtUSD(liveIpGross)}`}
              color="#fff"
              bold
            />
          </div>
          <p className="mt-3 text-[11px] leading-[1.5] text-white/55">
            Sponsorship covers fixed costs; POS retain is normal trading.
            ALTR brokerage commission (10–15%) settles separately,
            one-time, off-rail.
          </p>
        </div>
      </div>
    </section>
  )
}

function NetRow({
  label,
  value,
  color,
  bold,
}: {
  label: string
  value: string
  color: string
  bold?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="flex-1 truncate text-white/70">{label}</span>
      <span
        className={`text-right ${bold ? 'font-semibold' : ''}`}
        style={{ color }}
      >
        {value}
      </span>
    </div>
  )
}

function WalletCards({
  brand,
  matchMeta,
  sponsorAtLiveIp,
  liveIpRetainedUsd,
  rsToBrandAfterRipple,
  altrTxFeesUsd,
  homeCurr,
  targetCurr,
}: {
  brand: BrandProfile
  matchMeta: MatchMeta
  sponsorAtLiveIp: number
  liveIpRetainedUsd: number
  rsToBrandAfterRipple: number
  altrTxFeesUsd: number
  homeCurr: string
  targetCurr: string
}) {
  const liveIpTotalUsd = sponsorAtLiveIp + liveIpRetainedUsd

  return (
    <section className="mt-6 rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
        Wallets · projected end-of-deal balances
      </span>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <WalletCard
          name={brand.brandName || 'Brand'}
          kind="Brand"
          amount={fmtLocal(rsToBrandAfterRipple, homeCurr)}
          note={`RS payouts received (Stream B · ${homeCurr})`}
          accent="teal"
        />
        <WalletCard
          name={matchMeta.shortName}
          kind="LIVE IP"
          amount={fmtLocal(liveIpTotalUsd, targetCurr)}
          note={`Sponsorship (${fmtUSD(sponsorAtLiveIp)}) + POS retained (${fmtUSD(liveIpRetainedUsd)})`}
          accent="teal"
        />
        <WalletCard
          name="ALTR Treasury"
          kind="ALTR"
          amount={fmtLocal(altrTxFeesUsd, 'USDC')}
          note="Transaction fees (0.4%) on both streams · brokerage settled separately"
          accent="amber"
        />
      </div>
    </section>
  )
}

function WalletCard({
  name,
  kind,
  amount,
  note,
  accent,
}: {
  name: string
  kind: string
  amount: string
  note: string
  accent: 'teal' | 'amber'
}) {
  const color = accent === 'amber' ? '#EF9F27' : '#5DCAA5'
  return (
    <div
      className="rounded-xl border bg-black/40 p-4"
      style={{ borderColor: color + '40' }}
    >
      <div className="flex items-baseline justify-between">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color }}
        >
          {kind}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          projected
        </span>
      </div>
      <h4 className="mt-2 truncate text-[13.5px] font-semibold text-white">
        {name}
      </h4>
      <p className="mt-3 font-mono text-[15px] font-semibold tracking-tight text-white">
        {amount}
      </p>
      <p className="mt-2 text-[11px] leading-[1.5] text-white/55">{note}</p>
    </div>
  )
}

type ScheduleRow = {
  date: Date
  stream: 'A' | 'B'
  from: string
  to: string
  amount: string
  status: 'settled' | 'pending' | 'scheduled'
  note?: string
}

function SettlementSchedule({
  brand,
  matchMeta,
  start,
  sponsorshipUsd,
  sponsorAtEscrow,
  rsToBrandUsd,
}: {
  brand: BrandProfile
  matchMeta: MatchMeta
  start: Date
  sponsorshipUsd: number
  sponsorAtEscrow: number
  rsToBrandUsd: number
}) {
  const brandShort = (brand.brandName || 'Brand').split(' ')[0]
  const ipShort = matchMeta.shortName.split(' ')[0]

  const rsPerMonth = rsToBrandUsd / 3

  const rows: ScheduleRow[] = [
    {
      date: addDays(start, -7),
      stream: 'A',
      from: brandShort,
      to: 'Wise',
      amount: `${fmtUSD(sponsorshipUsd)} → USD`,
      status: 'settled',
    },
    {
      date: addDays(start, -7),
      stream: 'A',
      from: 'Wise',
      to: 'Circle',
      amount: `${fmtUSD(sponsorshipUsd * 0.996)} → USDC`,
      status: 'settled',
    },
    {
      date: addDays(start, -7),
      stream: 'A',
      from: 'Circle',
      to: 'XRPL Escrow',
      amount: `${fmtCount(sponsorAtEscrow)} USDC locked`,
      status: 'settled',
      note: 'M1 / M2 / M3 trigger armed',
    },
    {
      date: addDays(start, 1),
      stream: 'A',
      from: 'Escrow',
      to: ipShort,
      amount: `${fmtCount(sponsorAtEscrow * 0.5)} USDC → AED`,
      status: 'settled',
      note: 'M1 sponsorship release',
    },
    {
      date: addDays(start, 30),
      stream: 'B',
      from: 'POS',
      to: 'Auto-split',
      amount: `~${fmtUSD(rsPerMonth)} (month 1 RS)`,
      status: 'pending',
      note: 'real-time accrual',
    },
    {
      date: addDays(start, 30),
      stream: 'B',
      from: 'Auto-split',
      to: `${brandShort} · RS`,
      amount: `~${fmtUSD(rsPerMonth)} → KRW`,
      status: 'pending',
    },
    {
      date: addDays(start, 60),
      stream: 'B',
      from: 'Auto-split',
      to: `${brandShort} · RS`,
      amount: `~${fmtUSD(rsPerMonth)} → KRW`,
      status: 'scheduled',
      note: 'month 2 RS',
    },
    {
      date: addDays(start, 90),
      stream: 'A',
      from: 'Escrow',
      to: ipShort,
      amount: `${fmtCount(sponsorAtEscrow * 0.5)} USDC → AED`,
      status: 'scheduled',
      note: 'M3 final sponsorship release',
    },
  ]

  return (
    <section className="mt-6 rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
          Settlement schedule
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          Stream A · sponsorship  ·  Stream B · RS
        </span>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-y-1.5 text-[12px]">
          <thead>
            <tr className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
              <th className="px-2 py-1 text-left">Date</th>
              <th className="px-2 py-1 text-left">Stream</th>
              <th className="px-2 py-1 text-left">From → To</th>
              <th className="px-2 py-1 text-left">Amount</th>
              <th className="px-2 py-1 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <ScheduleTr key={i} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function ScheduleTr({ row }: { row: ScheduleRow }) {
  const statusCfg = {
    settled: { color: '#5DCAA5', label: 'settled', dot: '#5DCAA5' },
    pending: { color: '#EF9F27', label: 'pending', dot: '#EF9F27' },
    scheduled: {
      color: 'rgba(255,255,255,0.45)',
      label: 'scheduled',
      dot: 'rgba(255,255,255,0.3)',
    },
  }[row.status]

  const streamCfg =
    row.stream === 'A'
      ? { color: '#5DCAA5', label: 'A · sponsor' }
      : { color: '#A8E6CF', label: 'B · RS' }

  return (
    <tr className="text-white/85">
      <td className="rounded-l-lg border-y border-l border-white/[0.06] bg-black/40 px-3 py-2.5 font-mono text-[11.5px] text-white/70">
        {fmtDate(row.date)}
      </td>
      <td className="border-y border-white/[0.06] bg-black/40 px-3 py-2.5">
        <span
          className="rounded px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.15em]"
          style={{ background: streamCfg.color + '22', color: streamCfg.color }}
        >
          {streamCfg.label}
        </span>
      </td>
      <td className="border-y border-white/[0.06] bg-black/40 px-3 py-2.5">
        <span className="font-mono text-[11.5px] text-white/85">
          {row.from}
        </span>
        <span className="mx-1.5 text-white/30">→</span>
        <span className="font-mono text-[11.5px] text-white/85">
          {row.to}
        </span>
        {row.note && (
          <span className="ml-2 text-[10.5px] text-white/40">
            · {row.note}
          </span>
        )}
      </td>
      <td className="border-y border-white/[0.06] bg-black/40 px-3 py-2.5 font-mono text-[11.5px] text-white/95">
        {row.amount}
      </td>
      <td className="rounded-r-lg border-y border-r border-white/[0.06] bg-black/40 px-3 py-2.5">
        <span className="inline-flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: statusCfg.dot }}
          />
          <span
            className="font-mono text-[10.5px] uppercase tracking-[0.15em]"
            style={{ color: statusCfg.color }}
          >
            {statusCfg.label}
          </span>
        </span>
      </td>
    </tr>
  )
}

function EscrowDepletion({
  start,
  sponsorAtEscrow,
}: {
  start: Date
  sponsorAtEscrow: number
}) {
  const snapshots = [
    { date: addDays(start, -7), pct: 100, label: 'locked' },
    { date: addDays(start, 1), pct: 50, label: 'M1 released (50%)' },
    { date: addDays(start, 90), pct: 0, label: 'M3 final' },
  ]

  return (
    <section className="mt-6 rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
          Sponsorship escrow depletion
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          {fmtCount(sponsorAtEscrow)} USDC starting · Stream A only
        </span>
      </div>
      <p className="mt-1 text-[11.5px] leading-[1.5] text-white/45">
        Tracks the upfront sponsorship pool only. RS revenue (Stream B) is
        pass-through real-time, no escrow involved.
      </p>
      <div className="mt-4 flex flex-col gap-2.5">
        {snapshots.map((s, i) => (
          <div
            key={i}
            className="grid grid-cols-[80px_1fr_180px] items-center gap-3"
          >
            <span className="font-mono text-[11px] text-white/55">
              {fmtDate(s.date)}
            </span>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/[0.04]">
              <div
                className="altr-bar-grow h-full rounded-full"
                style={{
                  width: `${s.pct}%`,
                  background:
                    s.pct === 100
                      ? '#EF9F27'
                      : s.pct === 0
                        ? 'rgba(255,255,255,0.18)'
                        : '#5DCAA5',
                  animationDelay: `${i * 0.12}s`,
                  opacity: s.pct === 0 ? 0.4 : 1,
                }}
              />
            </div>
            <span className="text-right font-mono text-[11px] text-white/70">
              <span className="text-white/95">
                {fmtCount(sponsorAtEscrow * (s.pct / 100))} USDC
              </span>{' '}
              · {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
