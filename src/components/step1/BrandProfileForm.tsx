'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDemoState } from '@/components/providers/DemoStateProvider'
import {
  type BrandProfile,
  DEFAULT_BRAND,
} from '@/lib/demo-state'

const VERTICAL_SUBCATS: Record<string, string[]> = {
  'Beauty / Skincare': [
    'Skincare — Acne / Barrier',
    'Skincare — Anti-aging',
    'Skincare — Brightening',
    'Color cosmetics',
    'Hair care',
  ],
  'F&B': [
    'Ready-to-drink',
    'Snacks / confectionery',
    'Hot food / restaurant',
    'Functional / health',
  ],
  Fashion: [
    'Streetwear',
    'Designer / contemporary',
    'Accessories',
    'Athleisure',
  ],
  'Entertainment / IP': [
    'Music / artist',
    'Webtoon / animation',
    'Gaming',
    'Film / streaming',
  ],
  'Health & wellness': [
    'Functional supplements',
    'Sleep / recovery',
    'Mental wellness',
    'Fitness',
  ],
}

const VERTICALS = Object.keys(VERTICAL_SUBCATS)

const MARKETS = ['Korea', 'Japan', 'China', 'Taiwan', 'Singapore', 'Hong Kong']
const TARGET_MARKETS = [
  'UAE / GCC',
  'Saudi Arabia',
  'Japan',
  'Southeast Asia',
  'Europe',
  'US',
]
const GOALS = [
  'Brand awareness',
  'Real sales validation',
  'Retail partner scouting',
]
const FORMATS = [
  'Pop-up (Revenue Share)',
  'Booth / sampling',
  'Branded zone',
  'Title sponsor',
  'Open to all',
]
const BUDGETS = [
  'Under $10K',
  '$10K – $50K',
  '$50K – $200K',
  '$200K – $500K',
  '$500K+',
]
const TIMELINES = [
  'Q3 2026',
  'Q4 2026',
  'Q1 2027',
  'Q2 2027',
  'H2 2027',
  'Flexible',
]
const HISTORIES = ['First time', '1-2 times', '3+ times']

export function BrandProfileForm() {
  const router = useRouter()
  const { state, hydrated, setBrand: commitBrand } = useDemoState()
  const [brand, setBrand] = useState<BrandProfile>(DEFAULT_BRAND)

  useEffect(() => {
    if (hydrated) setBrand(state.brand)
  }, [hydrated, state.brand])

  const update = <K extends keyof BrandProfile>(key: K, value: BrandProfile[K]) => {
    setBrand((b) => ({ ...b, [key]: value }))
  }

  const toggleMarket = (m: string) => {
    setBrand((b) => {
      const has = b.currentMarkets.includes(m)
      return {
        ...b,
        currentMarkets: has
          ? b.currentMarkets.filter((x) => x !== m)
          : [...b.currentMarkets, m],
      }
    })
  }

  const subcats = VERTICAL_SUBCATS[brand.vertical] ?? []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    commitBrand(brand)
    router.push('/match')
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
      <div className="flex flex-col gap-5">
        <Header />

        <Field label="Brand name">
          <input
            type="text"
            value={brand.brandName}
            onChange={(e) => update('brandName', e.target.value)}
            className={inputClass}
            required
          />
        </Field>

        <Field label="Vertical">
          <Select
            value={brand.vertical}
            options={VERTICALS}
            onChange={(v) => {
              const newSubs = VERTICAL_SUBCATS[v] ?? []
              update('vertical', v)
              if (!newSubs.includes(brand.subCategory)) {
                update('subCategory', newSubs[0] ?? '')
              }
            }}
          />
        </Field>

        {subcats.length > 0 && (
          <Field label="Sub-category">
            <Select
              value={brand.subCategory}
              options={subcats}
              onChange={(v) => update('subCategory', v)}
            />
          </Field>
        )}

        <Field label="Current markets">
          <div className="flex flex-wrap gap-2">
            {MARKETS.map((m) => {
              const active = brand.currentMarkets.includes(m)
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMarket(m)}
                  className={`rounded-full border px-3 py-1 font-mono text-[11px] tracking-wider uppercase transition ${
                    active
                      ? 'border-demo-teal/60 bg-demo-teal-dim text-demo-teal'
                      : 'border-demo-border bg-demo-bg/40 text-demo-text-dim hover:border-demo-border-hover hover:text-demo-text'
                  }`}
                >
                  {m}
                </button>
              )
            })}
          </div>
        </Field>

        <Field label="Target market">
          <Select
            value={brand.targetMarket}
            options={TARGET_MARKETS}
            onChange={(v) => update('targetMarket', v)}
          />
        </Field>

        <Field label="Activation goal" hint="What does success look like for this activation?">
          <div className="flex flex-col gap-2">
            {GOALS.map((g) => {
              const active = brand.activationGoal === g
              return (
                <label
                  key={g}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-[13.5px] transition ${
                    active
                      ? 'border-demo-teal/60 bg-demo-teal-dim text-demo-text'
                      : 'border-demo-border bg-demo-bg/40 text-demo-text-dim hover:border-demo-border-hover hover:text-demo-text'
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border ${
                      active ? 'border-demo-teal bg-demo-teal' : 'border-demo-border-hover'
                    }`}
                  >
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-demo-bg" />}
                  </span>
                  <input
                    type="radio"
                    name="goal"
                    value={g}
                    checked={active}
                    onChange={() => update('activationGoal', g)}
                    className="sr-only"
                  />
                  <span>{g}</span>
                </label>
              )
            })}
          </div>
        </Field>

        <Field label="Activation format">
          <Select
            value={brand.activationFormat}
            options={FORMATS}
            onChange={(v) => update('activationFormat', v)}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Budget range">
            <Select
              value={brand.budgetRange}
              options={BUDGETS}
              onChange={(v) => update('budgetRange', v)}
            />
          </Field>
          <Field label="Timeline">
            <Select
              value={brand.timeline}
              options={TIMELINES}
              onChange={(v) => update('timeline', v)}
            />
          </Field>
        </div>

        <Field label="Overseas activation history">
          <Select
            value={brand.overseasHistory}
            options={HISTORIES}
            onChange={(v) => update('overseasHistory', v)}
          />
        </Field>
      </div>

      <IntelligencePreview brand={brand} hydrated={hydrated} />
    </form>
  )
}

function Header() {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="font-mono text-[10.5px] tracking-[0.22em] uppercase"
        style={{ color: '#5DCAA5' }}
      >
        Step 01 · Intelligence
      </span>
      <h1 className="text-[24px] font-bold tracking-[-0.02em] text-demo-text md:text-[28px]">
        Tell ALTR about your brand.
      </h1>
      <p className="text-[14px] leading-[1.55] text-demo-text-dim">
        The matching engine reads these signals to surface the right Live IP
        — and to draft your deal terms.
      </p>
    </div>
  )
}

function Field({
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
        <label className="font-mono text-[10px] tracking-[0.2em] text-demo-text-faint uppercase">
          {label}
        </label>
        {hint && (
          <span className="text-[12px] text-demo-text-faint">{hint}</span>
        )}
      </div>
      {children}
    </div>
  )
}

const inputClass =
  'rounded-lg border border-demo-border bg-demo-bg/60 px-4 py-3 text-[14px] text-demo-text placeholder:text-demo-text-faint focus:border-demo-teal/60 focus:outline-none'

function Select({
  value,
  options,
  onChange,
}: {
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} appearance-none bg-[image:linear-gradient(45deg,transparent_50%,#5A5A6A_50%),linear-gradient(135deg,#5A5A6A_50%,transparent_50%)] bg-[length:5px_5px,5px_5px] bg-[position:calc(100%-15px)_calc(50%-2px),calc(100%-10px)_calc(50%-2px)] bg-no-repeat pr-10`}
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-demo-surface text-demo-text">
          {o}
        </option>
      ))}
    </select>
  )
}

function IntelligencePreview({
  brand,
  hydrated,
}: {
  brand: BrandProfile
  hydrated: boolean
}) {
  const readingSignals = buildReadingSignals(brand)
  const analyzeSignals = buildAnalysisAxes(brand)

  return (
    <div className="lg:sticky lg:top-[120px] lg:self-start">
      <div className="rounded-2xl border border-demo-border bg-demo-surface p-6 md:p-7">
        <span
          className="font-mono text-[10px] tracking-[0.22em] uppercase"
          style={{ color: '#5DCAA5' }}
        >
          Intelligence preview
        </span>

        <div className="mt-5">
          <span className="font-mono text-[10px] tracking-[0.18em] text-demo-text-faint uppercase">
            Reading
          </span>
          <ul className="mt-2 flex flex-col gap-1.5">
            {readingSignals.map((line) => (
              <li
                key={line}
                className="flex items-start gap-2 text-[13px] leading-[1.5] text-demo-text-dim"
              >
                <span className="mt-[7px] inline-block h-1 w-1 flex-shrink-0 rounded-[1px] bg-demo-teal" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 border-t border-demo-border pt-5">
          <span className="font-mono text-[10px] tracking-[0.18em] text-demo-text-faint uppercase">
            Will analyze
          </span>
          <ul className="mt-2 flex flex-col gap-1.5">
            {analyzeSignals.map((line) => (
              <li
                key={line}
                className="flex items-start gap-2 text-[13px] leading-[1.5] text-demo-text-dim"
              >
                <span className="mt-[7px] inline-block h-1 w-1 flex-shrink-0 rounded-[1px] bg-demo-teal" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          disabled={!hydrated}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-demo-teal px-5 py-3 text-[13.5px] font-semibold text-demo-bg transition hover:bg-demo-success disabled:cursor-wait disabled:opacity-50"
        >
          Find my stage matches →
        </button>
      </div>
    </div>
  )
}

function buildReadingSignals(brand: BrandProfile): string[] {
  const verticalShort = brand.vertical.split(' ')[0]
  const subShort = brand.subCategory.split(' — ').pop() ?? brand.subCategory
  const isFirst = brand.overseasHistory.toLowerCase().startsWith('first')
  return [
    `${verticalShort} brand, ${subShort.toLowerCase()} vertical`,
    isFirst
      ? 'First overseas activation'
      : `${brand.overseasHistory.toLowerCase()} prior overseas`,
    `Goal: ${brand.activationGoal.toLowerCase()}`,
    `Format: ${brand.activationFormat.replace(/\(.*?\)/g, '').trim().toLowerCase() || 'open'}`,
    `Budget: ${brand.budgetRange}`,
    `Target: ${brand.targetMarket} · ${brand.timeline}`,
  ]
}

function buildAnalysisAxes(brand: BrandProfile): string[] {
  const axes: string[] = []
  axes.push(`Audience fit vs ${brand.targetMarket} HHI + demographic`)
  if (brand.vertical.toLowerCase().includes('beauty')) {
    axes.push('K-beauty category whitespace vs incumbents')
  } else if (brand.vertical.toLowerCase().includes('f&b')) {
    axes.push('F&B category demand + permit complexity')
  } else {
    axes.push(`${brand.vertical} category demand in target market`)
  }
  if (brand.activationFormat.toLowerCase().includes('revenue share')) {
    axes.push('RS deal precedents in target market')
  } else {
    axes.push('Activation format match per stage')
  }
  axes.push(`${brand.timeline} timing risk + seasonality`)
  return axes
}
