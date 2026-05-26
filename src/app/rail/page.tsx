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

  const dealValue = useMemo(
    () => parseMaxBudget(brand.budgetRange),
    [brand.budgetRange],
  )
  const homeCurr = homeCurrency(brand)
  const targetCurr = targetCurrency(brand)
  const rsRatio = 15

  const wiseOut = dealValue * 0.996
  const circleOut = wiseOut
  const escrowLocked = circleOut

  const liveIPShare = escrowLocked * ((100 - rsRatio) / 100)
  const brandRSShare = escrowLocked * (rsRatio / 100)

  const krwPerUSD = 1330
  const aedPerUSD = 3.67

  const liveIPAEDApprox = liveIPShare * aedPerUSD
  const brandRSKRWApprox = brandRSShare * krwPerUSD
  const dealValueKRW = dealValue * krwPerUSD

  const start = quarterStart(matchMeta.timing)
  const handleActivate = () => router.push('/live')

  return (
    <div className="px-6 pb-24 pt-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Header brand={brand} matchMeta={matchMeta} />

        <PathOverview
          homeCurr={homeCurr}
          targetCurr={targetCurr}
          dealValue={dealValue}
        />

        <FlowDiagram
          brand={brand}
          matchMeta={matchMeta}
          dealValueKRW={dealValueKRW}
          wiseOut={wiseOut}
          circleOut={circleOut}
          escrowLocked={escrowLocked}
          rsRatio={rsRatio}
          liveIPShare={liveIPShare}
          brandRSShare={brandRSShare}
          liveIPAEDApprox={liveIPAEDApprox}
          brandRSKRWApprox={brandRSKRWApprox}
          homeCurr={homeCurr}
          targetCurr={targetCurr}
        />

        <WalletCards
          brand={brand}
          matchMeta={matchMeta}
          escrowLocked={escrowLocked}
          liveIPShare={liveIPShare}
          brandRSShare={brandRSShare}
          liveIPAEDApprox={liveIPAEDApprox}
          brandRSKRWApprox={brandRSKRWApprox}
          homeCurr={homeCurr}
          targetCurr={targetCurr}
        />

        <SettlementSchedule
          brand={brand}
          matchMeta={matchMeta}
          start={start}
          dealValue={dealValue}
          escrowLocked={escrowLocked}
          rsRatio={rsRatio}
        />

        <EscrowDepletion start={start} escrowLocked={escrowLocked} />

        <div className="mt-10 flex flex-col items-end gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
            Rail dry-run complete · Ready to go live
          </p>
          <button
            type="button"
            onClick={handleActivate}
            className="rounded-lg bg-[#5DCAA5] px-6 py-3 text-[13px] font-semibold text-[#06120E] transition hover:bg-[#7BD7B7]"
          >
            Activate deal →
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
        Watch how funds traverse the USDC rail. Each crossing is on-chain,
        costed, and timestamped. No SWIFT, no manual reconciliation.
      </p>
    </header>
  )
}

function PathOverview({
  homeCurr,
  targetCurr,
  dealValue,
}: {
  homeCurr: string
  targetCurr: string
  dealValue: number
}) {
  const steps = [
    { label: homeCurr, sub: 'origin' },
    { label: 'USD', sub: 'Wise' },
    { label: 'USDC', sub: 'Circle' },
    { label: 'Escrow', sub: 'XRPL' },
    { label: 'Split', sub: 'auto' },
    { label: targetCurr, sub: 'AED out' },
  ]
  return (
    <section className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-white/[0.06] bg-black/30 p-3 md:p-4">
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
        Path
      </span>
      <div className="flex flex-1 flex-wrap items-center gap-1.5">
        {steps.map((s, i) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span
              className="rounded border border-white/[0.08] bg-black/40 px-2 py-1 font-mono text-[10.5px] text-white/85"
              title={s.sub}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span className="text-white/30">→</span>
            )}
          </span>
        ))}
      </div>
      <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#5DCAA5]">
        {fmtUSD(dealValue)} deal
      </span>
    </section>
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
  accent?: 'teal' | 'lightgreen' | 'amber'
  glow?: boolean
  children?: React.ReactNode
}

function FlowDiagram({
  brand,
  matchMeta,
  dealValueKRW,
  wiseOut,
  circleOut,
  escrowLocked,
  rsRatio,
  liveIPShare,
  brandRSShare,
  liveIPAEDApprox,
  brandRSKRWApprox,
  homeCurr,
  targetCurr,
}: {
  brand: BrandProfile
  matchMeta: MatchMeta
  dealValueKRW: number
  wiseOut: number
  circleOut: number
  escrowLocked: number
  rsRatio: number
  liveIPShare: number
  brandRSShare: number
  liveIPAEDApprox: number
  brandRSKRWApprox: number
  homeCurr: string
  targetCurr: string
}) {
  return (
    <section className="relative mt-6 rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
          Flow diagram
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          on-chain · USDC-anchored
        </span>
      </div>

      <div className="relative mt-5">
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

        <div className="flex flex-col gap-3 sm:pl-10">
          <Node
            icon="◉"
            title={brand.brandName || 'Brand'}
            subtitle="origin wallet"
            amountOut={`${fmtCount(dealValueKRW)} ${homeCurr}`}
            timing="t = 0"
            accent="teal"
          />
          <Connector label="deposits" />
          <Node
            icon="↔"
            title="Wise FX"
            subtitle={`${homeCurr} → USD`}
            amountIn={`${fmtCount(dealValueKRW)} ${homeCurr}`}
            amountOut={`${fmtUSD(wiseOut)} USD`}
            fee="−0.4% fee"
            timing="~3 s"
            accent="amber"
          />
          <Connector label="converts" />
          <Node
            icon="⬡"
            title="Circle Mint"
            subtitle="USD → USDC"
            amountIn={`${fmtUSD(wiseOut)} USD`}
            amountOut={`${fmtCount(circleOut)} USDC`}
            fee="free"
            timing="<1 s"
            accent="teal"
          />
          <Connector label="mints" />
          <Node
            icon="🔒"
            title="XRPL Escrow"
            subtitle="locked on-chain"
            amountOut={`${fmtCount(escrowLocked)} USDC`}
            fee="$0.0000152 fee"
            timing="3 s · permanent"
            accent="amber"
            glow
          >
            <p className="mt-2 text-[11px] leading-[1.5] text-[#EF9F27]/85">
              Hash-locked. Releases only on milestone trigger or RS payout
              schedule. Anchored receipts.
            </p>
          </Node>
          <Connector label="triggers" />
          <Node
            icon="÷"
            title="AUTO-SPLIT"
            subtitle={`${rsRatio}% RS · ${100 - rsRatio}% IP retained`}
            amountIn={`${fmtCount(escrowLocked)} USDC`}
            fee="rule-based"
            timing="~1 s"
            accent="lightgreen"
          >
            <div className="mt-3 flex flex-col gap-1.5">
              <SplitBar
                label={`LIVE IP retains · ${100 - rsRatio}%`}
                value={100 - rsRatio}
                color="#5DCAA5"
                amount={`${fmtCount(liveIPShare)} USDC`}
              />
              <SplitBar
                label={`Brand RS · ${rsRatio}%`}
                value={rsRatio}
                color="#A8E6CF"
                amount={`${fmtCount(brandRSShare)} USDC`}
              />
            </div>
          </Node>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 sm:pl-10">
          <Node
            icon="↗"
            title="Ripple ODL → LIVE IP"
            subtitle={`USDC → ${targetCurr}`}
            amountIn={`${fmtCount(liveIPShare)} USDC`}
            amountOut={`${fmtCount(liveIPAEDApprox)} ${targetCurr}`}
            fee="0.3% fee"
            timing="~2 s"
            accent="teal"
          />
          <Node
            icon="↗"
            title="Ripple ODL → Brand"
            subtitle={`USDC → ${homeCurr} (RS share)`}
            amountIn={`${fmtCount(brandRSShare)} USDC`}
            amountOut={`${fmtCount(brandRSKRWApprox)} ${homeCurr}`}
            fee="0.3% fee"
            timing="~2 s"
            accent="teal"
          />
          <Node
            icon="◉"
            title={matchMeta.shortName}
            subtitle="LIVE IP wallet"
            amountOut={`${fmtCount(liveIPAEDApprox)} ${targetCurr}`}
            timing="received"
            accent="teal"
          />
          <Node
            icon="◉"
            title={brand.brandName || 'Brand'}
            subtitle="Brand wallet (RS)"
            amountOut={`${fmtCount(brandRSKRWApprox)} ${homeCurr}`}
            timing="received"
            accent="teal"
          />
        </div>
      </div>
    </section>
  )
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
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px]">
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
                  className="rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em]"
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

function WalletCards({
  brand,
  matchMeta,
  escrowLocked,
  liveIPShare,
  brandRSShare,
  liveIPAEDApprox,
  brandRSKRWApprox,
  homeCurr,
  targetCurr,
}: {
  brand: BrandProfile
  matchMeta: MatchMeta
  escrowLocked: number
  liveIPShare: number
  brandRSShare: number
  liveIPAEDApprox: number
  brandRSKRWApprox: number
  homeCurr: string
  targetCurr: string
}) {
  return (
    <section className="mt-6 rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
        Wallets · current balances
      </span>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <WalletCard
          name={brand.brandName || 'Brand'}
          kind="Brand"
          amount={`${fmtCount(brandRSKRWApprox)} ${homeCurr}`}
          subAmount={`≈ ${fmtUSD(brandRSShare)} USDC`}
          note="RS payouts received"
          accent="teal"
        />
        <WalletCard
          name={matchMeta.shortName}
          kind="LIVE IP"
          amount={`${fmtCount(liveIPAEDApprox)} ${targetCurr}`}
          subAmount={`≈ ${fmtUSD(liveIPShare)} USDC`}
          note="sponsorship received"
          accent="teal"
        />
        <WalletCard
          name="ALTR Treasury"
          kind="ALTR"
          amount={`${fmtUSD(escrowLocked * 0.004)} USDC`}
          subAmount="transaction fees (0.4%)"
          note="brokerage settled separately"
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
  subAmount,
  note,
  accent,
}: {
  name: string
  kind: string
  amount: string
  subAmount: string
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
          live
        </span>
      </div>
      <h4 className="mt-2 truncate text-[13.5px] font-semibold text-white">
        {name}
      </h4>
      <p className="mt-3 font-mono text-[18px] font-semibold tracking-tight text-white">
        {amount}
      </p>
      <p className="mt-0.5 font-mono text-[11px] text-white/45">{subAmount}</p>
      <p className="mt-2 text-[11px] text-white/55">{note}</p>
    </div>
  )
}

type ScheduleRow = {
  date: Date
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
  dealValue,
  escrowLocked,
  rsRatio,
}: {
  brand: BrandProfile
  matchMeta: MatchMeta
  start: Date
  dealValue: number
  escrowLocked: number
  rsRatio: number
}) {
  const brandShort = (brand.brandName || 'Brand').split(' ')[0]
  const ipShort = matchMeta.shortName.split(' ')[0]

  const rsPayout = escrowLocked * (rsRatio / 100) * 0.25

  const rows: ScheduleRow[] = [
    {
      date: addDays(start, -7),
      from: brandShort,
      to: 'Wise',
      amount: `${fmtUSD(dealValue)} → USD`,
      status: 'settled',
    },
    {
      date: addDays(start, -7),
      from: 'Wise',
      to: 'Circle',
      amount: `${fmtUSD(dealValue * 0.996)} → USDC`,
      status: 'settled',
    },
    {
      date: addDays(start, -7),
      from: 'Circle',
      to: 'XRPL Escrow',
      amount: `${fmtCount(escrowLocked)} USDC locked`,
      status: 'settled',
      note: 'milestone trigger armed',
    },
    {
      date: addDays(start, 1),
      from: 'Escrow',
      to: ipShort,
      amount: `${fmtCount(escrowLocked * 0.5)} USDC`,
      status: 'settled',
      note: 'M1 booth-setup release',
    },
    {
      date: addDays(start, 30),
      from: 'POS',
      to: 'Auto-split',
      amount: `${fmtCount(rsPayout)} USDC`,
      status: 'pending',
      note: 'M2 month-1 RS',
    },
    {
      date: addDays(start, 60),
      from: 'Auto-split',
      to: `${brandShort} · RS`,
      amount: `${fmtCount(rsPayout * (rsRatio / 100))} USDC`,
      status: 'scheduled',
    },
    {
      date: addDays(start, 90),
      from: 'Escrow',
      to: ipShort,
      amount: `${fmtCount(escrowLocked * 0.5)} USDC`,
      status: 'scheduled',
      note: 'M3 campaign-end release',
    },
  ]

  return (
    <section className="mt-6 rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
          Settlement schedule
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          each crossing · timestamped
        </span>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-y-1.5 text-[12px]">
          <thead>
            <tr className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
              <th className="px-2 py-1 text-left">Date</th>
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

  return (
    <tr className="text-white/85">
      <td className="rounded-l-lg border-y border-l border-white/[0.06] bg-black/40 px-3 py-2.5 font-mono text-[11.5px] text-white/70">
        {fmtDate(row.date)}
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
  escrowLocked,
}: {
  start: Date
  escrowLocked: number
}) {
  const snapshots = [
    { date: addDays(start, -7), pct: 100, label: 'locked' },
    { date: addDays(start, 1), pct: 50, label: 'M1 released' },
    { date: addDays(start, 30), pct: 47, label: 'M2 RS slice' },
    { date: addDays(start, 60), pct: 44, label: 'M2 cont.' },
    { date: addDays(start, 90), pct: 0, label: 'M3 final' },
  ]

  return (
    <section className="mt-6 rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
          Escrow depletion
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          {fmtCount(escrowLocked)} USDC starting
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-2.5">
        {snapshots.map((s, i) => (
          <div
            key={i}
            className="grid grid-cols-[80px_1fr_120px] items-center gap-3"
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
                {fmtCount(escrowLocked * (s.pct / 100))}
              </span>{' '}
              · {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
