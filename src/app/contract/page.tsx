'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepFooter } from '@/components/demo/StepFooter'
import { StepShell } from '@/components/demo/StepShell'
import { useDemoState } from '@/components/providers/DemoStateProvider'
import { StyledSelect } from '@/components/ui/StyledSelect'
import {
  MATCH_META,
  type BrandProfile,
  type MatchMeta,
} from '@/lib/demo-state'
import type { WaitlistRole } from '@/types'

type DealType = 'fixed' | 'hybrid' | 'rs'
type BlockColor = 'teal' | 'lightgreen' | 'amber'
type Milestone = { id: 'M1' | 'M2' | 'M3'; label: string; date: Date }

const ROLE_STORAGE_KEY = 'altr_demo_role'

const COLORS: Record<
  BlockColor,
  { strip: string; activeBg: string; badgeBg: string; badgeText: string }
> = {
  teal: {
    strip: '#5DCAA5',
    activeBg: 'rgba(26, 46, 40, 0.55)',
    badgeBg: 'rgba(93, 202, 165, 0.16)',
    badgeText: '#5DCAA5',
  },
  lightgreen: {
    strip: '#A8E6CF',
    activeBg: 'rgba(26, 46, 36, 0.55)',
    badgeBg: 'rgba(168, 230, 207, 0.16)',
    badgeText: '#A8E6CF',
  },
  amber: {
    strip: '#EF9F27',
    activeBg: 'rgba(46, 36, 16, 0.55)',
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

function fmtCount(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

function rateUSD(currency: string): number {
  // demo FX rates — units of {currency} per 1 USD
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

// USD-primary format. Non-USD currencies show local equivalent in parens.
// USDC is 1:1 with USD so it just shows as USDC count.
function fmtMoney(usdAmount: number, currency: string): string {
  if (currency === 'USDC') return `${fmtCount(usdAmount)} USDC`
  if (currency === 'USD') return fmtUSD(usdAmount)
  const local = fmtCount(usdAmount * rateUSD(currency))
  return `${fmtUSD(usdAmount)} (= ${local} ${currency})`
}

function shortBrand(brand: BrandProfile): string {
  return (brand.brandName || 'Brand').split(' ')[0]
}

function shortIP(meta: MatchMeta): string {
  return (meta.shortName || meta.name || 'IP').split(' ')[0]
}

type BlockDef = {
  key: string
  icon: string
  name: string
  color: BlockColor
  activeFor: DealType[]
}

const BLOCKS: BlockDef[] = [
  { key: 'fiat-in', icon: '→', name: 'FIAT IN', color: 'teal', activeFor: ['fixed', 'hybrid', 'rs'] },
  { key: 'usdc', icon: '⬡', name: '→ USDC', color: 'teal', activeFor: ['fixed', 'hybrid', 'rs'] },
  { key: 'escrow', icon: '🔒', name: 'ESCROW', color: 'teal', activeFor: ['fixed', 'hybrid', 'rs'] },
  { key: 'trigger', icon: '⚡', name: 'TRIGGER', color: 'lightgreen', activeFor: ['hybrid', 'rs'] },
  { key: 'pos', icon: '📊', name: 'POS API', color: 'lightgreen', activeFor: ['rs'] },
  { key: 'split', icon: '÷', name: 'AUTO-SPLIT', color: 'lightgreen', activeFor: ['rs'] },
  { key: 'fx', icon: '↔', name: 'FX', color: 'amber', activeFor: ['fixed', 'hybrid', 'rs'] },
  { key: 'poe', icon: '⛓', name: 'POE', color: 'teal', activeFor: ['fixed', 'hybrid', 'rs'] },
]

const FREQUENCY_OPTIONS = ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly']
const SETTLEMENT_CURRENCY_OPTIONS = [
  'USD',
  'USDC',
  'KRW',
  'AED',
  'JPY',
  'SGD',
  'EUR',
  'GBP',
  'SAR',
]

const triggerClass =
  'rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2.5 text-[13px] text-white focus:border-[#5DCAA5]/60 focus:outline-none'

export default function ContractPage() {
  return (
    <StepShell currentStep={3}>
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
  const [durationDays, setDurationDays] = useState(30)
  const [frequency, setFrequency] = useState('Monthly')
  const [brokeragePct, setBrokeragePct] = useState(12)
  const [settlementCurrency, setSettlementCurrency] = useState(() =>
    targetCurrency(state.brand),
  )
  const [generating, setGenerating] = useState(false)
  const [role, setRole] = useState<WaitlistRole>('brand')

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = window.localStorage.getItem(ROLE_STORAGE_KEY)
      if (stored === 'brand' || stored === 'live-ip') setRole(stored)
    } catch {
      /* ignore */
    }
  }, [])

  const updateRole = (next: WaitlistRole) => {
    setRole(next)
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(ROLE_STORAGE_KEY, next)
      }
    } catch {
      /* ignore */
    }
  }

  const dealValue = useMemo(
    () => parseMaxBudget(brand.budgetRange),
    [brand.budgetRange],
  )
  const homeCurr = homeCurrency(brand)
  const targetCurr = settlementCurrency
  const fxRail = `${homeCurr} → USDC → ${settlementCurrency}`

  const sponsorshipNet = dealValue * (1 - 0.004) // -0.4% altr transaction fee
  const brokerageAmount = dealValue * (brokeragePct / 100)
  const rsPerPeriod =
    dealType === 'rs' ? dealValue * (rsRatio / 100) * 0.5 : 0
  // ^ rough demo estimate of RS payout-per-settlement (50% of ratio cap)

  const milestones: Milestone[] = useMemo(() => {
    const start = quarterStart(matchMeta.timing)
    const safeDays = Math.max(1, durationDays)
    const mid = Math.max(1, Math.floor(safeDays / 2))
    return [
      { id: 'M1', label: 'Booth setup complete', date: start },
      { id: 'M2', label: 'Mid-event POS check', date: addDays(start, mid) },
      {
        id: 'M3',
        label: 'Campaign end + final POS',
        date: addDays(start, safeDays),
      },
    ]
  }, [matchMeta.timing, durationDays])

  const handleLock = () => {
    if (generating) return
    setGenerating(true)
    window.setTimeout(() => router.push('/live'), 1100)
  }

  return (
    <div className="px-6 pb-24 pt-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          brand={brand}
          matchMeta={matchMeta}
          role={role}
          onChangeRole={updateRole}
        />

        <DealConfigBar
          dealType={dealType}
          setDealType={setDealType}
          rsRatio={rsRatio}
          setRsRatio={setRsRatio}
          durationDays={durationDays}
          setDurationDays={setDurationDays}
          frequency={frequency}
          setFrequency={setFrequency}
          fxRail={fxRail}
          settlementCurrency={settlementCurrency}
          setSettlementCurrency={setSettlementCurrency}
          brokeragePct={brokeragePct}
          setBrokeragePct={setBrokeragePct}
          milestones={milestones}
          role={role}
        />

        <ThreeActorFlow
          brand={brand}
          matchMeta={matchMeta}
          dealType={dealType}
          dealValue={dealValue}
          sponsorshipNet={sponsorshipNet}
          homeCurr={homeCurr}
          targetCurr={targetCurr}
          rsRatio={rsRatio}
          rsPerPeriod={rsPerPeriod}
          brokeragePct={brokeragePct}
          brokerageAmount={brokerageAmount}
          frequency={frequency}
          role={role}
        />

        <CompactRail dealType={dealType} />

        <FeeBreakdown
          dealValue={dealValue}
          dealType={dealType}
          role={role}
          brokeragePct={brokeragePct}
          brokerageAmount={brokerageAmount}
        />

        <StepFooter
          backHref="/confirm"
          statusLine={
            generating ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#5DCAA5]">
                Deal locked · Activation window opening
              </p>
            ) : undefined
          }
          rightSlot={
            <button
              type="button"
              onClick={handleLock}
              disabled={generating}
              className="rounded-lg bg-[#5DCAA5] px-6 py-3 text-[13px] font-semibold text-[#06120E] transition hover:bg-[#7BD7B7] disabled:cursor-wait disabled:opacity-60"
            >
              Activate deal &amp; go LIVE →
            </button>
          }
        />
      </div>
    </div>
  )
}

function PageHeader({
  brand,
  matchMeta,
  role,
  onChangeRole,
}: {
  brand: BrandProfile
  matchMeta: MatchMeta
  role: WaitlistRole
  onChangeRole: (r: WaitlistRole) => void
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#5DCAA5]">
          CONTRACT LAYER
        </span>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-white md:text-[26px]">
          Configure deal — {brand.brandName || 'Brand'} ×{' '}
          {matchMeta.shortName}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          View as
        </span>
        <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-lg border border-white/[0.08]">
          <button
            type="button"
            onClick={() => onChangeRole('brand')}
            className={`px-3 py-1.5 text-[11px] font-medium transition ${
              role === 'brand'
                ? 'bg-[#5DCAA5]/[0.16] text-[#5DCAA5]'
                : 'text-white/60 hover:text-white/85'
            }`}
          >
            Brand
          </button>
          <button
            type="button"
            onClick={() => onChangeRole('live-ip')}
            className={`px-3 py-1.5 text-[11px] font-medium transition ${
              role === 'live-ip'
                ? 'bg-[#5DCAA5]/[0.16] text-[#5DCAA5]'
                : 'text-white/60 hover:text-white/85'
            }`}
          >
            LIVE IP
          </button>
        </div>
      </div>
    </header>
  )
}

function DealConfigBar({
  dealType,
  setDealType,
  rsRatio,
  setRsRatio,
  durationDays,
  setDurationDays,
  frequency,
  setFrequency,
  fxRail,
  settlementCurrency,
  setSettlementCurrency,
  brokeragePct,
  setBrokeragePct,
  milestones,
  role,
}: {
  dealType: DealType
  setDealType: (d: DealType) => void
  rsRatio: number
  setRsRatio: (n: number) => void
  durationDays: number
  setDurationDays: (n: number) => void
  frequency: string
  setFrequency: (s: string) => void
  fxRail: string
  settlementCurrency: string
  setSettlementCurrency: (s: string) => void
  brokeragePct: number
  setBrokeragePct: (n: number) => void
  milestones: Milestone[]
  role: WaitlistRole
}) {
  const isRS = dealType === 'rs'
  const showMilestones = dealType === 'hybrid' || isRS
  const showBrokerage = role === 'live-ip'

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-black/30 p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          Deal type
        </span>
        <div className="flex gap-1 rounded-lg border border-white/[0.06] bg-black/40 p-1">
          {(
            [
              { key: 'fixed', label: 'Fixed Fee' },
              { key: 'hybrid', label: 'Hybrid' },
              { key: 'rs', label: 'Revenue Share' },
            ] as { key: DealType; label: string }[]
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setDealType(t.key)}
              className={`rounded px-3 py-1.5 text-[12px] font-medium transition ${
                dealType === t.key
                  ? 'bg-[#5DCAA5]/[0.16] text-[#5DCAA5]'
                  : 'text-white/60 hover:text-white/85'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {isRS && (
          <SliderField
            label="RS ratio"
            min={5}
            max={30}
            value={rsRatio}
            onChange={setRsRatio}
            suffix="%"
            accent="#5DCAA5"
          />
        )}

        <FieldGroup label="Duration (days)">
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2.5">
            <input
              type="number"
              min={1}
              max={365}
              value={durationDays}
              onChange={(e) =>
                setDurationDays(
                  Math.max(1, Math.min(365, Number(e.target.value) || 1)),
                )
              }
              className="w-full bg-transparent text-[13px] text-white focus:outline-none"
            />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-white/45">
              days
            </span>
          </div>
        </FieldGroup>

        {isRS && (
          <FieldGroup label="Settlement freq">
            <StyledSelect
              value={frequency}
              options={FREQUENCY_OPTIONS}
              onChange={setFrequency}
              triggerClassName={triggerClass}
            />
          </FieldGroup>
        )}

        <FieldGroup
          label="Settlement FX"
          hint={fxRail}
        >
          <StyledSelect
            value={settlementCurrency}
            options={SETTLEMENT_CURRENCY_OPTIONS}
            onChange={setSettlementCurrency}
            triggerClassName={triggerClass}
          />
        </FieldGroup>

        {showBrokerage && (
          <SliderField
            label="Brokerage %"
            min={10}
            max={15}
            value={brokeragePct}
            onChange={setBrokeragePct}
            suffix="%"
            accent="#EF9F27"
          />
        )}
      </div>

      {showMilestones && (
        <div className="border-t border-white/[0.06] pt-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
            Milestones
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-2 rounded border border-white/[0.06] bg-black/40 px-2.5 py-1.5 text-[11.5px]"
              >
                <span className="font-mono text-[#5DCAA5]">{m.id}</span>
                <span className="text-white/85">{m.label}</span>
                <span className="font-mono text-[10.5px] text-white/55">
                  {fmtDate(m.date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ThreeActorFlow({
  brand,
  matchMeta,
  dealType,
  dealValue,
  sponsorshipNet,
  homeCurr,
  targetCurr,
  rsRatio,
  rsPerPeriod,
  brokeragePct,
  brokerageAmount,
  frequency,
  role,
}: {
  brand: BrandProfile
  matchMeta: MatchMeta
  dealType: DealType
  dealValue: number
  sponsorshipNet: number
  homeCurr: string
  targetCurr: string
  rsRatio: number
  rsPerPeriod: number
  brokeragePct: number
  brokerageAmount: number
  frequency: string
  role: WaitlistRole
}) {
  const showBrokerageArrow = role === 'live-ip'
  return (
    <section className="mt-6 rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
          Money flow
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          {dealType === 'fixed'
            ? 'Fixed fee deal'
            : dealType === 'hybrid'
              ? 'Hybrid deal · fee + RS bonus'
              : 'Revenue Share deal · circular'}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
        <ActorCard
          kind="Brand"
          name={shortBrand(brand)}
          subtitle={brand.vertical || 'sponsor'}
          fullName={brand.brandName}
          accent="teal"
        />
        <ActorCard
          kind="ALTR"
          name="ALTR"
          subtitle="rail + brokerage"
          accent="amber"
          highlight
        />
        <ActorCard
          kind="Live IP"
          name={shortIP(matchMeta)}
          subtitle={matchMeta.location}
          fullName={matchMeta.shortName}
          accent="teal"
        />
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <FlowRow
          left={
            <ArrowSegment
              direction="right"
              color="teal"
              amount={fmtMoney(dealValue, homeCurr)}
              sub="sponsorship in"
            />
          }
          right={
            <ArrowSegment
              direction="right"
              color="teal"
              amount={fmtMoney(sponsorshipNet, targetCurr)}
              sub="net to LIVE IP · −0.4% tx"
            />
          }
        />

        {showBrokerageArrow && (
          <FlowRow
            left={<EmptyArrow />}
            right={
              <ArrowSegment
                direction="left"
                color="amber"
                amount={`${brokeragePct}% · ${fmtMoney(brokerageAmount, targetCurr)}`}
                sub="brokerage · one-time · you pay ALTR"
              />
            }
          />
        )}

        {dealType === 'rs' && (
          <>
            <FlowRow
              left={<EmptyArrow />}
              right={
                <ArrowSegment
                  direction="left"
                  color="mint"
                  amount="POS revenue"
                  sub="Lightspeed live feed"
                />
              }
            />
            <FlowRow
              left={
                <ArrowSegment
                  direction="left"
                  color="mint"
                  amount={`${rsRatio}% RS · ~${fmtMoney(rsPerPeriod, homeCurr)}`}
                  sub={`${frequency.toLowerCase()} via auto-split`}
                />
              }
              right={
                <ArrowSegment
                  direction="left"
                  color="mint"
                  amount={`${100 - rsRatio}% retained`}
                  sub="LIVE IP keeps share"
                />
              }
            />
          </>
        )}
      </div>
    </section>
  )
}

function ActorCard({
  kind,
  name,
  subtitle,
  fullName,
  accent,
  highlight,
}: {
  kind: string
  name: string
  subtitle: string
  fullName?: string
  accent: BlockColor
  highlight?: boolean
}) {
  const cfg = COLORS[accent]
  return (
    <div
      className="relative rounded-xl border p-3 text-center transition md:p-4"
      style={{
        borderColor: highlight ? cfg.strip + 'aa' : cfg.strip + '40',
        background: highlight ? cfg.activeBg : 'rgba(255,255,255,0.02)',
        boxShadow: highlight ? `0 0 0 1px ${cfg.strip}33 inset` : undefined,
      }}
    >
      <span
        className="font-mono text-[9.5px] uppercase tracking-[0.22em]"
        style={{ color: cfg.badgeText }}
      >
        {kind}
      </span>
      <h3 className="mt-1 text-[14px] font-semibold tracking-tight text-white md:text-[15px]">
        {name}
      </h3>
      <p className="mt-0.5 truncate text-[10.5px] text-white/55">{subtitle}</p>
      {fullName && fullName !== name && (
        <p
          className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.12em] text-white/35"
          title={fullName}
        >
          {fullName}
        </p>
      )}
    </div>
  )
}

function FlowRow({
  left,
  right,
}: {
  left: React.ReactNode
  right: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-2 items-center gap-2 sm:gap-4">
      {left}
      {right}
    </div>
  )
}

function ArrowSegment({
  direction,
  color,
  amount,
  sub,
}: {
  direction: 'right' | 'left'
  color: 'teal' | 'amber' | 'mint'
  amount: string
  sub?: string
}) {
  const colorHex =
    color === 'amber' ? '#EF9F27' : color === 'mint' ? '#A8E6CF' : '#5DCAA5'

  return (
    <div className="flex flex-col items-center gap-1.5 py-1">
      <span
        className="text-center font-mono text-[11px] font-semibold tracking-tight"
        style={{ color: colorHex }}
      >
        {amount}
      </span>
      <div
        className="flex w-full items-center text-[14px] leading-none"
        style={{ color: colorHex }}
      >
        {direction === 'left' && (
          <span className="-mr-1 flex-shrink-0">◄</span>
        )}
        <span
          className="flex-1 border-t border-dashed"
          style={{ borderColor: colorHex + '66' }}
        />
        {direction === 'right' && (
          <span className="-ml-1 flex-shrink-0">►</span>
        )}
      </div>
      {sub && (
        <span className="text-center text-[10.5px] leading-[1.35] text-white/45">
          {sub}
        </span>
      )}
    </div>
  )
}

function EmptyArrow() {
  return <div className="h-px" />
}

function CompactRail({ dealType }: { dealType: DealType }) {
  const activeCount = BLOCKS.filter((b) => b.activeFor.includes(dealType))
    .length

  return (
    <section className="mt-6 rounded-2xl border border-white/[0.06] bg-black/30 p-4 md:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
          Settlement rail
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          {activeCount} / 8 layers active
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {BLOCKS.map((block) => (
          <CompactPill key={block.key} block={block} dealType={dealType} />
        ))}
      </div>
    </section>
  )
}

function CompactPill({
  block,
  dealType,
}: {
  block: BlockDef
  dealType: DealType
}) {
  const isActive = block.activeFor.includes(dealType)
  const cfg = COLORS[block.color]
  return (
    <div
      className="rounded-lg border px-3 py-2 transition-all duration-200"
      style={{
        borderColor: isActive
          ? cfg.strip + '55'
          : 'rgba(255,255,255,0.05)',
        background: isActive ? cfg.activeBg : 'rgba(255,255,255,0.02)',
        opacity: isActive ? 1 : 0.45,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex w-4 flex-shrink-0 justify-center text-[13px] leading-none">
          {block.icon}
        </span>
        <span className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-white">
          {block.name}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-1.5">
        <span
          className="h-1 w-1 rounded-full"
          style={{ background: isActive ? cfg.strip : '#3a3a3a' }}
        />
        <span
          className="font-mono text-[9px] uppercase tracking-[0.15em]"
          style={{
            color: isActive ? cfg.badgeText : 'rgba(255,255,255,0.3)',
          }}
        >
          {isActive ? 'active' : 'off'}
        </span>
      </div>
    </div>
  )
}

function FeeBreakdown({
  dealValue,
  dealType,
  role,
  brokeragePct,
  brokerageAmount,
}: {
  dealValue: number
  dealType: DealType
  role: WaitlistRole
  brokeragePct: number
  brokerageAmount: number
}) {
  const wise = dealValue * 0.008
  const ripple = dealValue * 0.003
  const infra = wise + ripple
  const altrTxFee = dealValue * 0.004
  const total = infra + altrTxFee
  const swiftLow = dealValue * 0.03
  const swiftHigh = dealValue * 0.05
  const savingsLow = swiftLow - total
  const savingsHigh = swiftHigh - total

  const brokerageLow = dealValue * 0.1
  const brokerageHigh = dealValue * 0.15

  const isLiveIP = role === 'live-ip'
  const totalLabel = isLiveIP ? 'Transaction fee' : 'You pay (rail)'

  return (
    <section className="mt-6 rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
        Cost breakdown · {fmtUSD(dealValue)} deal · viewing as{' '}
        <span className="text-[#5DCAA5]">
          {isLiveIP ? 'LIVE IP' : 'Brand'}
        </span>
      </p>

      {isLiveIP && (
        <>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#EF9F27]">
            1 · ALTR brokerage commission · one-time
          </p>
          <p className="mt-1 text-[11.5px] leading-[1.5] text-white/55">
            What you pay ALTR for bringing the sponsor. Case-by-case based on
            tier &amp; relationship.
          </p>
          <div className="mt-2 flex flex-col gap-1.5 font-mono text-[12px]">
            <Row
              left={`Brokerage @ ${brokeragePct}% (range 10–15%)`}
              mid={`${brokeragePct}%`}
              right={fmtUSD(brokerageAmount)}
              bold
            />
            <p className="text-[10.5px] text-white/35">
              Range: {fmtUSD(brokerageLow)} – {fmtUSD(brokerageHigh)}
            </p>
          </div>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#5DCAA5]">
            2 · Transaction fee · per money movement
          </p>
          <p className="mt-1 text-[11.5px] leading-[1.5] text-white/55">
            Charged each time funds move through the rail. Brand and LIVE IP
            both pay on their own movements.
          </p>
        </>
      )}

      <div
        className={`${isLiveIP ? 'mt-2' : 'mt-3'} flex flex-col gap-1.5 font-mono text-[12px]`}
      >
        <Row left="Wise (fiat in + out)" mid="0.4% + 0.4%" right={fmtUSD(wise)} />
        <Row left="Circle USDC" mid="free" right="$0" />
        <Row left="XRPL escrow/settle" mid="$0.0000152" right="~$0" />
        <Row left="Ripple ODL (FX)" mid="0.3%" right={fmtUSD(ripple)} />
        <hr className="my-1 border-white/[0.06]" />
        <Row left="Infrastructure cost" mid="~1.1%" right={fmtUSD(infra)} />
        <Row left="ALTR transaction fee" mid="+0.4%" right={fmtUSD(altrTxFee)} />
        <hr className="my-1 border-white/[0.06]" />
        <Row left={totalLabel} mid="~1.5%" right={fmtUSD(total)} bold />
        <div className="mt-2 flex flex-col gap-1">
          <Row
            left="vs SWIFT traditional:"
            mid="3–5%"
            right={`${fmtUSD(swiftLow)}–${fmtUSD(swiftHigh)}`}
            dim
          />
          <Row
            left="Savings per movement:"
            mid=""
            right={`${fmtUSD(savingsLow)}–${fmtUSD(savingsHigh)}`}
            highlight
          />
        </div>
      </div>

      {dealType === 'rs' && (
        <div className="mt-5 rounded-lg border border-[#EF9F27]/40 bg-[#2E2410]/50 p-3.5">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#EF9F27]">
            Revenue Share — most complex deal type
          </p>
          <p className="mt-1.5 text-[12px] leading-[1.5] text-white/60">
            Traditional: SWIFT 3–5% · 5–10 days · manual
          </p>
          <p className="text-[12px] leading-[1.5] text-white">
            altr: USDC rail · ~1.5% · 3 seconds · automatic
          </p>
        </div>
      )}
    </section>
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
        {hint && <span className="text-[10.5px] text-white/35">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function SliderField({
  label,
  min,
  max,
  value,
  onChange,
  suffix,
  accent,
}: {
  label: string
  min: number
  max: number
  value: number
  onChange: (n: number) => void
  suffix: string
  accent: string
}) {
  return (
    <FieldGroup label={label}>
      <div className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2.5">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
          style={{ accentColor: accent }}
        />
        <span
          className="w-12 text-right font-mono text-[13px]"
          style={{ color: accent }}
        >
          {value}
          {suffix}
        </span>
      </div>
    </FieldGroup>
  )
}
