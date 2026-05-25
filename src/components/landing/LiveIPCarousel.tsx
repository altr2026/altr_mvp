'use client'

import { useMemo, useState } from 'react'
import type { RightHolder, Vertical } from '@/types'
import { LiveIPCard } from './LiveIPCard'

type FilterValue = string

type Filters = {
  region: FilterValue
  vertical: FilterValue
  size: FilterValue
  period: FilterValue
}

const REGION_OPTIONS = [
  { value: 'all', label: 'All regions' },
  { value: 'GCC', label: 'GCC' },
  { value: 'APAC', label: 'APAC' },
  { value: 'EU', label: 'EU' },
  { value: 'NA', label: 'NA' },
]

const VERTICAL_OPTIONS = [
  { value: 'all', label: 'All verticals' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'F&B', label: 'F&B' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'IP', label: 'IP / Entertainment' },
  { value: 'lifestyle', label: 'Lifestyle' },
]

const SIZE_OPTIONS = [
  { value: 'all', label: 'Any size' },
  { value: 'lt-50k', label: '< 50K' },
  { value: '50k-500k', label: '50K – 500K' },
  { value: '500k-5m', label: '500K – 5M' },
  { value: 'gt-5m', label: '5M+' },
]

const PERIOD_OPTIONS = [
  { value: 'all', label: 'All dates' },
  { value: 'next-3mo', label: 'Next 3 months' },
  { value: 'q4-2026', label: 'Q4 2026' },
  { value: '2027', label: '2027' },
  { value: 'past', label: 'Past' },
]

const DEFAULTS: Filters = {
  region: 'all',
  vertical: 'all',
  size: 'all',
  period: 'all',
}

const DEMO_TODAY_MS = new Date('2026-05-25T00:00:00Z').getTime()
const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000

const matchSize = (n: number, bucket: string): boolean => {
  switch (bucket) {
    case 'all':
      return true
    case 'lt-50k':
      return n < 50_000
    case '50k-500k':
      return n >= 50_000 && n < 500_000
    case '500k-5m':
      return n >= 500_000 && n < 5_000_000
    case 'gt-5m':
      return n >= 5_000_000
    default:
      return true
  }
}

const matchPeriod = (rh: RightHolder, bucket: string): boolean => {
  if (bucket === 'all') return true
  const earliest = [...rh.availableSlots.map((s) => s.startDate)].sort()[0]
  if (!earliest) return false
  const startMs = new Date(`${earliest}T00:00:00Z`).getTime()
  switch (bucket) {
    case 'past':
      return startMs < DEMO_TODAY_MS
    case 'next-3mo':
      return startMs >= DEMO_TODAY_MS && startMs <= DEMO_TODAY_MS + THREE_MONTHS_MS
    case 'q4-2026': {
      const month = earliest.slice(5, 7)
      return (
        earliest.startsWith('2026') &&
        (month === '10' || month === '11' || month === '12')
      )
    }
    case '2027':
      return earliest.startsWith('2027')
    default:
      return true
  }
}

type Props = {
  rightHolders: RightHolder[]
}

export function LiveIPCarousel({ rightHolders }: Props) {
  const [filters, setFilters] = useState<Filters>(DEFAULTS)

  const filtered = useMemo(() => {
    return rightHolders.filter((rh) => {
      if (filters.region !== 'all' && rh.region !== filters.region) return false
      if (
        filters.vertical !== 'all' &&
        !rh.verticals.includes(filters.vertical as Vertical)
      )
        return false
      if (!matchSize(rh.audienceSize, filters.size)) return false
      if (!matchPeriod(rh, filters.period)) return false
      return true
    })
  }, [rightHolders, filters])

  const hasActiveFilter = Object.values(filters).some((v) => v !== 'all')
  const reset = () => setFilters(DEFAULTS)

  return (
    <section id="live-ip" className="px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] md:text-[22px]">
            Live activations & pop-ups
          </h2>
          <span className="font-mono text-[10.5px] tracking-[0.18em] text-altr-text-2 uppercase">
            {filtered.length}
            {hasActiveFilter && (
              <span className="text-altr-text-3"> / {rightHolders.length}</span>
            )}{' '}
            shown
          </span>
        </div>

        <div className="mb-8 flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-altr-card p-4 md:p-5">
          <FilterRow
            label="Region"
            options={REGION_OPTIONS}
            value={filters.region}
            onChange={(v) => setFilters({ ...filters, region: v })}
          />
          <FilterRow
            label="Vertical"
            options={VERTICAL_OPTIONS}
            value={filters.vertical}
            onChange={(v) => setFilters({ ...filters, vertical: v })}
          />
          <FilterRow
            label="Size"
            options={SIZE_OPTIONS}
            value={filters.size}
            onChange={(v) => setFilters({ ...filters, size: v })}
          />
          <FilterRow
            label="Period"
            options={PERIOD_OPTIONS}
            value={filters.period}
            onChange={(v) => setFilters({ ...filters, period: v })}
          />
          {hasActiveFilter && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={reset}
                className="font-mono text-[10px] tracking-[0.18em] text-altr-text-3 uppercase transition hover:text-altr-mint-bright"
              >
                Reset filters ×
              </button>
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-white/[0.06] bg-altr-card px-6 py-14 text-center">
            <p className="text-[14px] text-altr-text-2">
              No live activations match these filters.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-3 font-mono text-[11px] tracking-[0.18em] text-altr-mint-bright uppercase transition hover:text-altr-lime"
            >
              Reset & browse all →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((rh) => (
              <LiveIPCard key={rh.id} rightHolder={rh} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="min-w-[70px] font-mono text-[10px] tracking-[0.2em] text-altr-text-3 uppercase">
        {label}
      </span>
      {options.map((opt) => {
        const isActive = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-full border px-2.5 py-1 font-mono text-[10.5px] tracking-wider uppercase transition ${
              isActive
                ? 'border-altr-mint-bright/60 bg-altr-mint/[0.16] text-altr-mint-bright'
                : 'border-white/[0.08] bg-altr-bg/40 text-altr-text-2 hover:border-white/[0.16] hover:text-altr-white'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
