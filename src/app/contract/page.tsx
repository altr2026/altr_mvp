'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepShell } from '@/components/demo/StepShell'
import { useDemoState } from '@/components/providers/DemoStateProvider'
import { StyledSelect } from '@/components/ui/StyledSelect'
import {
  MATCH_META,
  type BrandProfile,
  type MatchMeta,
} from '@/lib/demo-state'

type DealType = 'fixed' | 'milestone' | 'rs'
type BlockColor = 'teal' | 'lightgreen' | 'amber'

type Milestone = { id: 'M1' | 'M2' | 'M3'; label: string; date: Date }

type BlockCtx = {
  dealType: DealType
  rsRatio: number
  dealValue: number
  duration: number
  frequency: string
  brand: BrandProfile
  matchMeta: MatchMeta
  milestones: Milestone[]
  fxRail: string
}

type BlockDef = {
  key: string
  icon: string
  name: string
  color: BlockColor
  activeFor: DealType[]
  describe: (ctx: BlockCtx) => string
}

const COLORS: Record<
  BlockColor,
  { strip: string; activeBg: string; badgeBg: string; badgeText: string }
> = {
  teal: {
    strip: '#5DCAA5',
    activeBg: '#1A2E28',
    badgeBg: 'rgba(93, 202, 165, 0.16)',
    badgeText: '#5DCAA5',
  },
  lightgreen: {
    strip: '#A8E6CF',
    activeBg: '#1A2E24',
    badgeBg: 'rgba(168, 230, 207, 0.16)',
    badgeText: '#A8E6CF',
  },
  amber: {
    strip: '#EF9F27',
    activeBg: '#2E2410',
    badgeBg: 'rgba(239, 159, 39, 0.16)',
    badgeText: '#EF9F27',
  },
}

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

function detectFXRail(brand: BrandProfile): string {
  return `${homeCurrency(brand)} → USDC → ${targetCurrency(brand)}`
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

function addMonths(d: Date, n: number): Date {
  const nd = new Date(d)
  nd.setMonth(nd.getMonth() + n)
  return nd
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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

function shortBrand(brand: BrandProfile): string {
  return (brand.brandName || 'Brand').split(' ')[0]
}

function shortIP(meta: MatchMeta): string {
  return (meta.shortName || meta.name || 'IP').split(' ')[0]
}

const BLOCKS: BlockDef[] = [
  {
    key: 'fiat-in',
    icon: '→',
    name: 'FIAT IN',
    color: 'teal',
    activeFor: ['fixed', 'milestone', 'rs'],
    describe: ({ brand, dealType }) =>
      dealType === 'rs'
        ? `Wise · ${homeCurrency(brand)} received`
        : `Wise · ${homeCurrency(brand)}/USD received`,
  },
  {
    key: 'usdc',
    icon: '⬡',
    name: '→ USDC',
    color: 'teal',
    activeFor: ['fixed', 'milestone', 'rs'],
    describe: ({ dealType, dealValue }) =>
      dealType === 'rs'
        ? `Circle · ${Math.round(dealValue).toLocaleString()} USDC`
        : 'Circle Mint · 1:1 conversion',
  },
  {
    key: 'escrow',
    icon: '🔒',
    name: 'ESCROW',
    color: 'teal',
    activeFor: ['fixed', 'milestone', 'rs'],
    describe: ({ dealType }) =>
      dealType === 'rs'
        ? 'XRPL · locked until milestone'
        : 'XRPL · funds locked on-chain',
  },
  {
    key: 'trigger',
    icon: '⚡',
    name: 'TRIGGER',
    color: 'lightgreen',
    activeFor: ['milestone', 'rs'],
    describe: ({ milestones, dealType }) => {
      if (dealType === 'milestone') return '3 milestones defined · auto-release'
      return milestones.map((m) => `${m.id} ${fmtDate(m.date)}`).join(' · ')
    },
  },
  {
    key: 'pos',
    icon: '📊',
    name: 'POS API',
    color: 'lightgreen',
    activeFor: ['rs'],
    describe: () => 'Lightspeed · real-time sales feed',
  },
  {
    key: 'split',
    icon: '÷',
    name: 'AUTO-SPLIT',
    color: 'lightgreen',
    activeFor: ['rs'],
    describe: ({ rsRatio, brand, matchMeta, frequency }) =>
      `${rsRatio}% ${shortBrand(brand)} · ${100 - rsRatio}% ${shortIP(matchMeta)} · ${frequency.toLowerCase()}`,
  },
  {
    key: 'fx',
    icon: '↔',
    name: 'FX',
    color: 'amber',
    activeFor: ['fixed', 'milestone', 'rs'],
    describe: ({ brand, dealType }) => {
      const home = homeCurrency(brand)
      const target = targetCurrency(brand)
      return dealType === 'rs'
        ? `USDC→${home} + USDC→${target} · Ripple ODL`
        : `Ripple ODL · ${home}→USDC→${target}`
    },
  },
  {
    key: 'poe',
    icon: '⛓',
    name: 'POE',
    color: 'teal',
    activeFor: ['fixed', 'milestone', 'rs'],
    describe: ({ dealType }) =>
      dealType === 'rs'
        ? 'XRPL · all receipts anchored'
        : 'XRPL receipt · permanent proof',
  },
]

const DURATION_OPTIONS = ['1 month', '3 months', '6 months', '12 months']
const FREQUENCY_OPTIONS = ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly']

const triggerClass =
  'rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2.5 text-[13px] text-white focus:border-[#5DCAA5]/60 focus:outline-none'

export default function Step4Page() {
  return (
    <StepShell currentStep={4}>
      <ContractLayer />
    </StepShell>
  )
}

function ContractLayer() {
  const router = useRouter()
  const { state, selectedMatch } = useDemoState()
  const brand = state.brand
  const matchMeta = selectedMatch
    ? MATCH_META[selectedMatch.id]
    : MATCH_META.frieze

  const [dealType, setDealType] = useState<DealType>('rs')
  const [rsRatio, setRsRatio] = useState(15)
  const [durationLabel, setDurationLabel] = useState('3 months')
  const [frequency, setFrequency] = useState('Monthly')
  const [generating, setGenerating] = useState(false)

  const duration = parseInt(durationLabel, 10) || 3
  const dealValue = useMemo(() => parseMaxBudget(brand.budgetRange), [brand.budgetRange])
  const fxRail = useMemo(() => detectFXRail(brand), [brand])

  const milestones: Milestone[] = useMemo(() => {
    const start = quarterStart(matchMeta.timing)
    return [
      { id: 'M1', label: 'Booth setup complete', date: start },
      { id: 'M2', label: 'Month 1 POS verified', date: addMonths(start, 1) },
      {
        id: 'M3',
        label: 'Campaign end + final POS',
        date: endOfMonth(addMonths(start, Math.max(0, duration - 1))),
      },
    ]
  }, [matchMeta.timing, duration])

  const blockCtx: BlockCtx = {
    dealType,
    rsRatio,
    dealValue,
    duration,
    frequency,
    brand,
    matchMeta,
    milestones,
    fxRail,
  }

  const handleGenerate = () => {
    if (generating) return
    setGenerating(true)
    window.setTimeout(() => router.push('/rail'), 1100)
  }

  return (
    <div className="px-6 pb-24 pt-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#5DCAA5]">
            CONTRACT LAYER
          </span>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-white md:text-[26px]">
            Configure deal — {brand.brandName || 'Brand'} ×{' '}
            {matchMeta.shortName}
          </h1>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_3fr] lg:gap-10">
          <DealParameters
            dealType={dealType}
            setDealType={setDealType}
            rsRatio={rsRatio}
            setRsRatio={setRsRatio}
            durationLabel={durationLabel}
            setDurationLabel={setDurationLabel}
            frequency={frequency}
            setFrequency={setFrequency}
            fxRail={fxRail}
            milestones={milestones}
          />

          <SettlementRail ctx={blockCtx} dealValue={dealValue} />
        </div>

        <div className="mt-10 flex flex-col items-end gap-3">
          {generating && (
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#5DCAA5]">
              Contract generated · Settlement rail locked
            </p>
          )}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="rounded-lg bg-[#5DCAA5] px-6 py-3 text-[13px] font-semibold text-[#06120E] transition hover:bg-[#7BD7B7] disabled:cursor-wait disabled:opacity-60"
          >
            Generate contract →
          </button>
        </div>
      </div>
    </div>
  )
}

function DealParameters({
  dealType,
  setDealType,
  rsRatio,
  setRsRatio,
  durationLabel,
  setDurationLabel,
  frequency,
  setFrequency,
  fxRail,
  milestones,
}: {
  dealType: DealType
  setDealType: (d: DealType) => void
  rsRatio: number
  setRsRatio: (n: number) => void
  durationLabel: string
  setDurationLabel: (s: string) => void
  frequency: string
  setFrequency: (s: string) => void
  fxRail: string
  milestones: Milestone[]
}) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6">
      <FieldGroup label="Deal type">
        <div className="grid grid-cols-3 gap-1 rounded-lg border border-white/[0.06] bg-black/40 p-1">
          {(
            [
              { key: 'fixed', label: 'Fixed Fee' },
              { key: 'milestone', label: 'Milestone' },
              { key: 'rs', label: 'Revenue Share' },
            ] as { key: DealType; label: string }[]
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setDealType(t.key)}
              className={`rounded px-2 py-2 text-[12px] font-medium transition ${
                dealType === t.key
                  ? 'bg-[#5DCAA5]/[0.16] text-[#5DCAA5]'
                  : 'text-white/60 hover:text-white/85'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </FieldGroup>

      {dealType === 'rs' && (
        <FieldGroup label="RS ratio">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={5}
              max={30}
              value={rsRatio}
              onChange={(e) => setRsRatio(Number(e.target.value))}
              className="flex-1 accent-[#5DCAA5]"
            />
            <span className="w-12 text-right font-mono text-[13px] text-[#5DCAA5]">
              {rsRatio}%
            </span>
          </div>
        </FieldGroup>
      )}

      <FieldGroup label="Duration">
        <StyledSelect
          value={durationLabel}
          options={DURATION_OPTIONS}
          onChange={setDurationLabel}
          triggerClassName={triggerClass}
        />
      </FieldGroup>

      <FieldGroup label="Settlement FX" hint="Auto-detected from brand + IP locations">
        <div className="rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 font-mono text-[13px] text-white/70">
          {fxRail}
        </div>
      </FieldGroup>

      {dealType === 'rs' && (
        <FieldGroup label="Settlement freq">
          <StyledSelect
            value={frequency}
            options={FREQUENCY_OPTIONS}
            onChange={setFrequency}
            triggerClassName={triggerClass}
          />
        </FieldGroup>
      )}

      {(dealType === 'milestone' || dealType === 'rs') && (
        <FieldGroup label="Milestones">
          <div className="flex flex-col gap-2">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 text-[12.5px]"
              >
                <span className="font-mono text-[#5DCAA5]">{m.id}</span>
                <span className="flex-1 text-white/85">{m.label}</span>
                <span className="font-mono text-[12px] text-white/60">
                  {fmtDate(m.date)}
                </span>
              </div>
            ))}
          </div>
        </FieldGroup>
      )}
    </div>
  )
}

function SettlementRail({
  ctx,
  dealValue,
}: {
  ctx: BlockCtx
  dealValue: number
}) {
  const { dealType } = ctx
  const activeCount = BLOCKS.filter((b) => b.activeFor.includes(dealType)).length

  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
        Settlement rail
      </span>

      <div className="flex flex-col gap-2">
        {BLOCKS.map((block) => (
          <BlockCard key={block.key} block={block} ctx={ctx} />
        ))}
      </div>

      {dealType === 'rs' ? (
        <MoatBox activeCount={activeCount} />
      ) : (
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/55">
          {activeCount} layers active ·{' '}
          {dealType === 'fixed'
            ? 'Fixed fee deal · Simple settlement'
            : 'Milestone deal · Conditional settlement'}
        </p>
      )}

      {dealType === 'rs' && <FeeBreakdown dealValue={dealValue} />}
    </div>
  )
}

function BlockCard({ block, ctx }: { block: BlockDef; ctx: BlockCtx }) {
  const isActive = block.activeFor.includes(ctx.dealType)
  const cfg = COLORS[block.color]

  return (
    <div
      className="relative overflow-hidden rounded-lg border transition-all duration-200 ease-out"
      style={{
        borderColor: isActive
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(255,255,255,0.03)',
        background: isActive ? cfg.activeBg : 'rgba(255,255,255,0.02)',
        opacity: isActive ? 1 : 0.4,
        minHeight: 48,
      }}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-[3px] transition-colors duration-200"
        style={{ background: isActive ? cfg.strip : '#3a3a3a' }}
      />
      <div className="flex items-center justify-between gap-3 pl-5 pr-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex w-5 flex-shrink-0 justify-center text-[14px] leading-none">
            {block.icon}
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-mono text-[11px] uppercase tracking-[0.15em] text-white">
              {block.name}
            </span>
            {isActive && (
              <span className="truncate text-[11px] leading-[1.4] text-white/60">
                {block.describe(ctx)}
              </span>
            )}
          </div>
        </div>
        <span
          className="whitespace-nowrap rounded px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.15em] transition-colors duration-200"
          style={
            isActive
              ? { background: cfg.badgeBg, color: cfg.badgeText }
              : {
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.4)',
                }
          }
        >
          {isActive ? 'ACTIVE' : 'NOT NEEDED'}
        </span>
      </div>
    </div>
  )
}

function MoatBox({ activeCount }: { activeCount: number }) {
  return (
    <div className="mt-3 rounded-lg border border-[#EF9F27]/40 bg-[#2E2410]/50 p-4">
      <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#EF9F27]">
        {activeCount} / 8 layers active
      </p>
      <p className="mt-2 text-[13.5px] font-medium text-white">
        Revenue Share — most complex deal type
      </p>
      <p className="mt-2.5 text-[12.5px] leading-[1.5] text-white/60">
        Traditional: SWIFT 3–5% · 5–10 days · manual
      </p>
      <p className="text-[12.5px] leading-[1.5] text-white/90">
        altr: USDC rail · ~1.5% · 3 seconds · automatic
      </p>
    </div>
  )
}

function FeeBreakdown({ dealValue }: { dealValue: number }) {
  const wise = dealValue * 0.008
  const ripple = dealValue * 0.003
  const infra = wise + ripple
  const altrFee = dealValue * 0.005
  const total = infra + altrFee
  const swiftLow = dealValue * 0.03
  const swiftHigh = dealValue * 0.05
  const savingsLow = swiftLow - total
  const savingsHigh = swiftHigh - total

  return (
    <div className="mt-3 rounded-lg border border-white/[0.06] bg-black/30 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
        COST BREAKDOWN · {fmtUSD(dealValue)} deal
      </p>
      <div className="mt-3 flex flex-col gap-1.5 font-mono text-[12px]">
        <Row left="Wise (fiat in + out)" mid="0.4% + 0.4%" right={fmtUSD(wise)} />
        <Row left="Circle USDC" mid="free" right="$0" />
        <Row left="XRPL escrow/settle" mid="$0.0000152" right="~$0" />
        <Row left="Ripple ODL (FX)" mid="0.3%" right={fmtUSD(ripple)} />
        <hr className="my-1 border-white/[0.06]" />
        <Row left="Infrastructure cost" mid="~1.1%" right={fmtUSD(infra)} />
        <Row left="altr fee" mid="+0.5%" right={fmtUSD(altrFee)} />
        <hr className="my-1 border-white/[0.06]" />
        <Row left="Total to brand" mid="~1.5%" right={fmtUSD(total)} bold />
        <div className="mt-2 flex flex-col gap-1">
          <Row
            left="vs SWIFT traditional:"
            mid="3–5%"
            right={`${fmtUSD(swiftLow)}–${fmtUSD(swiftHigh)}`}
            dim
          />
          <Row
            left="Savings:"
            mid=""
            right={`${fmtUSD(savingsLow)}–${fmtUSD(savingsHigh)}`}
            highlight
          />
        </div>
      </div>
    </div>
  )
}

function Row({
  left,
  mid,
  right,
  bold,
  dim,
  highlight,
}: {
  left: string
  mid: string
  right: string
  bold?: boolean
  dim?: boolean
  highlight?: boolean
}) {
  const baseText = highlight
    ? 'text-[#5DCAA5]'
    : dim
      ? 'text-white/55'
      : bold
        ? 'text-white'
        : 'text-white/85'
  return (
    <div className={`flex items-baseline justify-between gap-3 ${baseText}`}>
      <span className="flex-1 truncate">{left}</span>
      <span className="w-28 text-right text-white/50">{mid}</span>
      <span className={`w-28 text-right ${bold ? 'font-semibold' : ''}`}>
        {right}
      </span>
    </div>
  )
}

function FieldGroup({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
          {label}
        </label>
        {hint && <span className="text-[11.5px] text-white/40">{hint}</span>}
      </div>
      {children}
    </div>
  )
}
