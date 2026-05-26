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

function fmtUSDPrecise(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  })
}

function fmtCount(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

function fmtMoney(usdAmount: number, currency: string): string {
  if (currency === 'USDC') return `${fmtCount(usdAmount)} USDC`
  if (currency === 'USD') return fmtUSD(usdAmount)
  const local = fmtCount(usdAmount * rateUSD(currency))
  return `${fmtUSD(usdAmount)} (= ${local} ${currency})`
}

// ── Mock POS transaction stream ────────────────────────────────────────────
type Txn = {
  ts: string // "10:42 AM"
  product: string
  customer: string
  amountUsd: number
  isNew?: boolean
}

const POS_PRODUCTS = [
  'Daily Glow serum (30ml)',
  'Acne Barrier mask · 5-pack',
  'Cleansing oil · mini',
  'Brand sample kit',
  'Niacinamide essence',
  'Daily Glow set · trial',
  'BHA peel · 100ml',
  'Hydra-cream · refill',
  'Cushion compact',
  'Travel essentials kit',
]

const POS_CUSTOMERS = [
  '#4827', '#4826', '#4825', '#4824', '#4823',
  '#4822', '#4821', '#4820', '#4819', '#4818',
]

const POS_TS = [
  '10:42 AM', '10:39 AM', '10:36 AM', '10:31 AM', '10:27 AM',
  '10:22 AM', '10:18 AM', '10:13 AM', '10:09 AM', '10:04 AM',
]

const POS_AMOUNTS_USD = [12.8, 30.0, 8.75, 78.5, 22.3, 65.2, 18.1, 41.0, 95.4, 17.6]

function buildMockTransactions(): Txn[] {
  return POS_PRODUCTS.map((product, i) => ({
    ts: POS_TS[i],
    product,
    customer: POS_CUSTOMERS[i],
    amountUsd: POS_AMOUNTS_USD[i],
    isNew: i === 0,
  }))
}

export default function LivePage() {
  return (
    <StepShell currentStep={4}>
      <LiveLayer />
    </StepShell>
  )
}

function LiveLayer() {
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

  // Demo: assume day 30 of 90 — early-mid activation
  const dayN = 30
  const totalDays = 90
  const progress = dayN / totalDays

  // POS estimate over deal period
  const posTotalUsd = sponsorshipUsd * 4
  const posToDateUsd = posTotalUsd * progress
  const rsToBrandToDateUsd = posToDateUsd * (rsRatio / 100)
  const liveIpRetainedToDateUsd = posToDateUsd - rsToBrandToDateUsd

  // RS targets
  const estimatedTotalRSUsd = posTotalUsd * (rsRatio / 100)
  const rsRecoveryPct = (rsToBrandToDateUsd / estimatedTotalRSUsd) * 100

  const transactions = useMemo(buildMockTransactions, [])
  const txnCount = Math.round(840 * progress)
  const avgTicket = txnCount > 0 ? posToDateUsd / txnCount : 0
  const last24hUsd = posToDateUsd / dayN

  const handleNext = () => router.push('/rail')

  return (
    <div className="px-6 pb-24 pt-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Header brand={brand} matchMeta={matchMeta} />

        <LiveStatus
          dayN={dayN}
          totalDays={totalDays}
          posToDateUsd={posToDateUsd}
          targetCurr={targetCurr}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <POSFeed
            transactions={transactions}
            targetCurr={targetCurr}
            rsRatio={rsRatio}
          />
          <RSAccumulator
            rsToBrandToDateUsd={rsToBrandToDateUsd}
            estimatedTotalRSUsd={estimatedTotalRSUsd}
            recoveryPct={rsRecoveryPct}
            homeCurr={homeCurr}
            sponsorshipUsd={sponsorshipUsd}
          />
        </div>

        <AutoSplitVis
          posToDateUsd={posToDateUsd}
          rsToBrandToDateUsd={rsToBrandToDateUsd}
          liveIpRetainedToDateUsd={liveIpRetainedToDateUsd}
          rsRatio={rsRatio}
          targetCurr={targetCurr}
          homeCurr={homeCurr}
        />

        <QuickStats
          posToDateUsd={posToDateUsd}
          last24hUsd={last24hUsd}
          txnCount={txnCount}
          avgTicket={avgTicket}
          targetCurr={targetCurr}
        />

        <div className="mt-10 flex flex-col items-end gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
            POS stream healthy · Day {dayN} of {totalDays}
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-lg bg-[#5DCAA5] px-6 py-3 text-[13px] font-semibold text-[#06120E] transition hover:bg-[#7BD7B7]"
          >
            View settlement →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes altr-live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.85); }
        }
        @keyframes altr-bar-grow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes altr-fade-in {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .altr-live-pulse {
          animation: altr-live-pulse 1.4s ease-in-out infinite;
        }
        .altr-bar-grow {
          transform-origin: left center;
          animation: altr-bar-grow 1.2s ease-out forwards;
        }
        .altr-fade-in {
          animation: altr-fade-in 0.6s ease-out;
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
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#38E709]">
        DEAL · LIVE
      </span>
      <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-white md:text-[26px]">
        Live execution — {brand.brandName || 'Brand'} ×{' '}
        {matchMeta.shortName}
      </h1>
      <p className="text-[13px] leading-[1.55] text-white/55 md:text-[14px]">
        Activation window open. POS feed streaming in real time. Each sale
        auto-splits on-chain — 15% routes back to Brand as RS, 85% retained
        by LIVE IP.
      </p>
    </header>
  )
}

function LiveStatus({
  dayN,
  totalDays,
  posToDateUsd,
  targetCurr,
}: {
  dayN: number
  totalDays: number
  posToDateUsd: number
  targetCurr: string
}) {
  const progress = (dayN / totalDays) * 100
  return (
    <section className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-[#38E709]/30 bg-black/30 p-4 md:p-5">
      <span className="relative flex h-3 w-3 items-center justify-center">
        <span className="altr-live-pulse absolute inline-flex h-full w-full rounded-full bg-[#38E709] opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38E709]" />
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#38E709]">
        Streaming
      </span>

      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          Activation
        </span>
        <span className="font-mono text-[13px] text-white">
          Day {dayN} of {totalDays}
        </span>
      </div>

      <div className="h-8 w-px bg-white/[0.08]" />

      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          POS to date
        </span>
        <span className="font-mono text-[13px] text-white">
          {fmtMoney(posToDateUsd, targetCurr)}
        </span>
      </div>

      <div className="ml-auto flex min-w-[140px] flex-col gap-1">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/40">
            Progress
          </span>
          <span className="font-mono text-[10px] text-white/70">
            {progress.toFixed(0)}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-[#38E709]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  )
}

function POSFeed({
  transactions,
  targetCurr,
  rsRatio,
}: {
  transactions: Txn[]
  targetCurr: string
  rsRatio: number
}) {
  return (
    <section className="rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
          POS feed · Lightspeed live
        </span>
        <span className="flex items-center gap-1.5">
          <span className="altr-live-pulse h-1.5 w-1.5 rounded-full bg-[#38E709]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#38E709]">
            streaming
          </span>
        </span>
      </div>

      <ul className="mt-3 flex flex-col gap-1.5">
        {transactions.map((tx, i) => (
          <TxnRow
            key={i}
            tx={tx}
            targetCurr={targetCurr}
            rsRatio={rsRatio}
            isTop={i === 0}
          />
        ))}
      </ul>

      <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.15em] text-white/35">
        more streaming · auto-update on each crossing
      </p>
    </section>
  )
}

function TxnRow({
  tx,
  targetCurr,
  rsRatio,
  isTop,
}: {
  tx: Txn
  targetCurr: string
  rsRatio: number
  isTop: boolean
}) {
  const localAmount = tx.amountUsd * rateUSD(targetCurr)
  const rsSliceUsd = tx.amountUsd * (rsRatio / 100)

  return (
    <li
      className={`grid grid-cols-[60px_1fr_auto_auto] items-center gap-3 rounded-lg border border-white/[0.05] bg-black/40 px-3 py-2 ${
        isTop ? 'altr-fade-in border-[#38E709]/30' : ''
      }`}
    >
      <span className="font-mono text-[10.5px] text-white/55">{tx.ts}</span>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-[12.5px] text-white/90">
          {tx.product}
        </span>
        <span className="font-mono text-[10px] text-white/35">
          customer {tx.customer}
        </span>
      </div>
      <span className="text-right font-mono text-[12px] text-white">
        {fmtCount(localAmount)} {targetCurr}
        <span className="ml-1 text-[10.5px] text-white/40">
          (≈{fmtUSDPrecise(tx.amountUsd)})
        </span>
      </span>
      <span className="rounded border border-[#A8E6CF]/30 bg-[#A8E6CF]/[0.06] px-1.5 py-0.5 text-right font-mono text-[10px] text-[#A8E6CF]">
        → RS {fmtUSDPrecise(rsSliceUsd)}
      </span>
    </li>
  )
}

function RSAccumulator({
  rsToBrandToDateUsd,
  estimatedTotalRSUsd,
  recoveryPct,
  homeCurr,
  sponsorshipUsd,
}: {
  rsToBrandToDateUsd: number
  estimatedTotalRSUsd: number
  recoveryPct: number
  homeCurr: string
  sponsorshipUsd: number
}) {
  const sponsorshipRecoveryPct =
    (rsToBrandToDateUsd / sponsorshipUsd) * 100

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-[#A8E6CF]/30 bg-black/30 p-5 md:p-6">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#A8E6CF]">
        Brand RS · to date
      </span>

      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-[28px] font-semibold tracking-tight text-white md:text-[34px]">
          {fmtUSD(rsToBrandToDateUsd)}
        </span>
        <span className="font-mono text-[12px] text-white/55">
          ≈ {fmtCount(rsToBrandToDateUsd * rateUSD(homeCurr))} {homeCurr}
        </span>
      </div>

      <div className="mt-2 flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between text-[11px]">
          <span className="font-mono text-white/55">
            RS estimated total
          </span>
          <span className="font-mono text-white/85">
            {fmtUSD(estimatedTotalRSUsd)}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="altr-bar-grow h-full rounded-full bg-[#A8E6CF]"
            style={{ width: `${Math.min(100, recoveryPct)}%` }}
          />
        </div>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-white/45">
          {recoveryPct.toFixed(0)}% accrued
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-white/[0.06] bg-black/40 p-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
          vs sponsorship cost
        </p>
        <p className="mt-1.5 text-[12px] leading-[1.5] text-white/70">
          Brand paid{' '}
          <span className="text-white">{fmtUSD(sponsorshipUsd)}</span>{' '}
          upfront. RS so far recovers{' '}
          <span className="text-[#A8E6CF]">
            {sponsorshipRecoveryPct.toFixed(0)}%
          </span>
          .
        </p>
      </div>
    </section>
  )
}

function AutoSplitVis({
  posToDateUsd,
  rsToBrandToDateUsd,
  liveIpRetainedToDateUsd,
  rsRatio,
  targetCurr,
  homeCurr,
}: {
  posToDateUsd: number
  rsToBrandToDateUsd: number
  liveIpRetainedToDateUsd: number
  rsRatio: number
  targetCurr: string
  homeCurr: string
}) {
  return (
    <section className="mt-6 rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
          Auto-split · to date
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          {fmtUSD(posToDateUsd)} routed · on-chain · per sale
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <SplitBar
          label={`LIVE IP retains · ${100 - rsRatio}%`}
          pct={100 - rsRatio}
          color="#5DCAA5"
          amountUsd={liveIpRetainedToDateUsd}
          currency={targetCurr}
          note="stays in LIVE IP's AED account · normal trading"
        />
        <SplitBar
          label={`Brand RS · ${rsRatio}%`}
          pct={rsRatio}
          color="#A8E6CF"
          amountUsd={rsToBrandToDateUsd}
          currency={homeCurr}
          note="auto-routes via Ripple ODL → Brand KRW wallet"
        />
      </div>

      <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.15em] text-white/45">
        rule-based · ~1 sec per crossing · no manual reconciliation
      </p>
    </section>
  )
}

function SplitBar({
  label,
  pct,
  color,
  amountUsd,
  currency,
  note,
}: {
  label: string
  pct: number
  color: string
  amountUsd: number
  currency: string
  note: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-[12.5px] text-white/85">{label}</span>
        <span className="font-mono text-[12.5px] text-white">
          {fmtMoney(amountUsd, currency)}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="altr-bar-grow h-full rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="font-mono text-[10.5px] text-white/45">{note}</span>
    </div>
  )
}

function QuickStats({
  posToDateUsd,
  last24hUsd,
  txnCount,
  avgTicket,
  targetCurr,
}: {
  posToDateUsd: number
  last24hUsd: number
  txnCount: number
  avgTicket: number
  targetCurr: string
}) {
  return (
    <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        label="POS since start"
        value={fmtUSD(posToDateUsd)}
        sub={fmtMoney(posToDateUsd, targetCurr).split('·')[1]?.trim() ?? ''}
      />
      <StatCard label="Last 24h" value={fmtUSD(last24hUsd)} sub="~today" />
      <StatCard
        label="Transactions"
        value={fmtCount(txnCount)}
        sub="crossings on-chain"
      />
      <StatCard
        label="Avg ticket"
        value={fmtUSDPrecise(avgTicket)}
        sub="per crossing"
      />
    </section>
  )
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
        {label}
      </span>
      <p className="mt-2 font-mono text-[18px] font-semibold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-0.5 font-mono text-[10.5px] text-white/40">{sub}</p>
    </div>
  )
}
