'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  type StageProfile,
  DEFAULT_STAGE,
  loadStageState,
  patchStageState,
} from '@/lib/stage-state'

const STAGE_TYPE_SUBS: Record<string, string[]> = {
  'Music festival': ['Pop / mainstream', 'EDM', 'Hip-hop / R&B', 'World music'],
  Conference: [
    'Tech (AI / Web3 / SaaS)',
    'Healthcare / MedTech',
    'Finance / Fintech',
    'Sustainability',
  ],
  'Fashion show': [
    'Designer / contemporary',
    'Streetwear',
    'Luxury',
    'Bridal / occasion',
  ],
  'Art fair / cultural': [
    'Contemporary art',
    'Design / architecture',
    'Cinema / film',
    'Literature',
  ],
  'Mall activation': [
    'Premium retail · luxury wing',
    'Mass-market · flagship',
    'Festival / seasonal',
  ],
  'Hospitality pop-up': [
    'Hotel lobby / suite',
    'Rooftop / club',
    'Beach / coastal',
  ],
  'Sports event': [
    'Motorsport',
    'Football / cricket',
    'Esports',
    'Racing (horse / equestrian)',
  ],
}

const STAGE_TYPES = Object.keys(STAGE_TYPE_SUBS)

const COUNTRIES = [
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Bahrain',
  'Oman',
  'Kuwait',
  'Korea',
  'Japan',
  'Singapore',
  'Thailand',
  'Indonesia',
  'Other',
]

const AUDIENCE_SIZES = [
  'Under 5K',
  '5K – 50K',
  '50K – 500K',
  '500K – 5M',
  '5M+',
]

const AUDIENCE_PROFILES = [
  'Mass-market',
  'Mid-tier',
  'High-net-worth',
  'Royal / VIP',
  'Trade buyers',
  'Press / opinion-leaders',
  'Family / multicultural',
]

const FORMATS = [
  'Booth',
  'Pop-up',
  'Branded zone',
  'Title sponsor',
  'Naming rights',
  'Hospitality suite',
]

const RS_OPTIONS = [
  'Yes — POS integration available',
  'Yes — manual reporting',
  'No — fixed fee only',
  'Open to discuss',
]

const VERTICALS = [
  'Beauty',
  'F&B',
  'Fashion',
  'Tech',
  'Luxury',
  'Entertainment / IP',
  'Health & wellness',
  'Automotive',
  'Travel / hospitality',
]

const SPONSOR_ORIGINS = [
  'K-content',
  'Japan',
  'SEA',
  'Europe',
  'GCC',
  'US',
  'Global',
  'No preference',
]

const BUDGET_TIERS = [
  'Under $25K',
  '$25K – $50K',
  '$50K – $500K',
  '$500K – $2M',
  '$2M+',
]

const PARTNERSHIP_TYPES = [
  'Sponsor',
  'Content partner',
  'IP collab',
  'Co-branded activation',
  'Title naming',
]

const TIMELINES = [
  'Q3 2026',
  'Q4 2026',
  'Q1 2027',
  'Q2 2027',
  'H2 2027',
  'Season-long',
  'Recurring annual',
]

const WINDOW_DURATIONS = [
  'Single day',
  'Weekend (2-3 days)',
  '1-week edition',
  '1-month residency available',
  '3-month season',
  '6-month residency available',
]

const PREV_HISTORY = [
  'None — first overseas brand cohort',
  '1-2 K-brands (pop-up)',
  '3+ K-brands hosted',
  'Korean pavilion exists',
]

export function StageProfileForm() {
  const router = useRouter()
  const [stage, setStage] = useState<StageProfile>(DEFAULT_STAGE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const s = loadStageState()
    setStage(s.stage)
    setHydrated(true)
  }, [])

  const update = <K extends keyof StageProfile>(key: K, value: StageProfile[K]) => {
    setStage((s) => ({ ...s, [key]: value }))
  }

  const toggleInArray = (key: keyof StageProfile, value: string) => {
    setStage((s) => {
      const current = s[key] as string[]
      const has = current.includes(value)
      return {
        ...s,
        [key]: has ? current.filter((x) => x !== value) : [...current, value],
      }
    })
  }

  const subcats = STAGE_TYPE_SUBS[stage.stageType] ?? []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    patchStageState({ stage, screening: null })
    router.push('/screen')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10"
    >
      <div className="flex flex-col gap-5">
        <Header />

        <Field label="Live IP name">
          <input
            type="text"
            value={stage.stageName}
            onChange={(e) => update('stageName', e.target.value)}
            className={inputClass}
            required
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Type">
            <Select
              value={stage.stageType}
              options={STAGE_TYPES}
              onChange={(v) => {
                const newSubs = STAGE_TYPE_SUBS[v] ?? []
                update('stageType', v)
                if (!newSubs.includes(stage.subCategory)) {
                  update('subCategory', newSubs[0] ?? '')
                }
              }}
            />
          </Field>
          {subcats.length > 0 && (
            <Field label="Sub-category">
              <Select
                value={stage.subCategory}
                options={subcats}
                onChange={(v) => update('subCategory', v)}
              />
            </Field>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="City">
            <input
              type="text"
              value={stage.city}
              onChange={(e) => update('city', e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Country">
            <Select
              value={stage.country}
              options={COUNTRIES}
              onChange={(v) => update('country', v)}
            />
          </Field>
        </div>

        <Field
          label="Anchor IP / what makes you unique"
          hint="The AI uses this to map you against brand demand. Be specific — exclusive programming, audience moments, prior brand wins."
        >
          <textarea
            value={stage.anchorIP}
            onChange={(e) => update('anchorIP', e.target.value)}
            rows={4}
            className={inputClass}
            required
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Audience size (per edition)">
            <Select
              value={stage.audienceSize}
              options={AUDIENCE_SIZES}
              onChange={(v) => update('audienceSize', v)}
            />
          </Field>
          <Field label="Next edition window">
            <Select
              value={stage.nextEdition}
              options={TIMELINES}
              onChange={(v) => update('nextEdition', v)}
            />
          </Field>
        </div>

        <Field label="Audience profile" hint="Select all that apply">
          <ChipMulti
            options={AUDIENCE_PROFILES}
            selected={stage.audienceProfile}
            onToggle={(v) => toggleInArray('audienceProfile', v)}
          />
        </Field>

        <Field
          label="Geographic mix"
          hint="Where does your audience come from?"
        >
          <input
            type="text"
            value={stage.geographicMix}
            onChange={(e) => update('geographicMix', e.target.value)}
            className={inputClass}
            placeholder="e.g., UAE 55% · GCC 28% · KR/JP 12% · Other 5%"
          />
        </Field>

        <Field label="Sponsorship formats you offer">
          <ChipMulti
            options={FORMATS}
            selected={stage.formatsOffered}
            onToggle={(v) => toggleInArray('formatsOffered', v)}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Revenue-share eligibility">
            <Select
              value={stage.rsEligible}
              options={RS_OPTIONS}
              onChange={(v) => update('rsEligible', v)}
            />
          </Field>
          <Field label="Activation window">
            <Select
              value={stage.windowDuration}
              options={WINDOW_DURATIONS}
              onChange={(v) => update('windowDuration', v)}
            />
          </Field>
        </div>

        <div className="border-t border-white/[0.06] pt-5">
          <span className="font-mono text-[10.5px] tracking-[0.22em] text-altr-mint-bright uppercase">
            Who do you want to attract?
          </span>
        </div>

        <Field label="Target sponsor verticals">
          <ChipMulti
            options={VERTICALS}
            selected={stage.targetSponsorVerticals}
            onToggle={(v) => toggleInArray('targetSponsorVerticals', v)}
          />
        </Field>

        <Field label="Target sponsor origin">
          <ChipMulti
            options={SPONSOR_ORIGINS}
            selected={stage.targetSponsorOrigin}
            onToggle={(v) => toggleInArray('targetSponsorOrigin', v)}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Sponsor budget tier (target)">
            <Select
              value={stage.budgetTier}
              options={BUDGET_TIERS}
              onChange={(v) => update('budgetTier', v)}
            />
          </Field>
          <Field label="Prior overseas-brand experience">
            <Select
              value={stage.prevOverseasBrands}
              options={PREV_HISTORY}
              onChange={(v) => update('prevOverseasBrands', v)}
            />
          </Field>
        </div>

        <Field label="Partnership type">
          <ChipMulti
            options={PARTNERSHIP_TYPES}
            selected={stage.partnershipTypes}
            onToggle={(v) => toggleInArray('partnershipTypes', v)}
          />
        </Field>

        <Field
          label="Anything else"
          hint="Pre-existing sponsor lineup, must-haves, deal-breakers, audience proof points..."
        >
          <textarea
            value={stage.notes}
            onChange={(e) => update('notes', e.target.value)}
            rows={3}
            className={inputClass}
          />
        </Field>
      </div>

      <PreIntelligencePreview stage={stage} hydrated={hydrated} />
    </form>
  )
}

function Header() {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10.5px] tracking-[0.22em] text-altr-mint-bright uppercase">
        ALTR Screening · PRE Intelligence
      </span>
      <h1 className="text-[24px] font-bold tracking-[-0.02em] text-altr-white md:text-[28px]">
        Tell ALTR about your stage.
      </h1>
      <p className="text-[14px] leading-[1.55] text-altr-text-2">
        The more you share, the sharper the brand match. The AI reads your
        audience signal, category whitespace, and prior brand history — then
        surfaces the verticals and origins that fit you best.
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
        <label className="font-mono text-[10px] tracking-[0.2em] text-altr-text-3 uppercase">
          {label}
        </label>
        {hint && (
          <span className="text-[12px] text-altr-text-3">{hint}</span>
        )}
      </div>
      {children}
    </div>
  )
}

const inputClass =
  'rounded-lg border border-white/[0.08] bg-altr-bg/60 px-4 py-3 text-[14px] text-altr-white placeholder:text-altr-text-3 focus:border-altr-mint-bright/60 focus:outline-none'

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
        <option key={o} value={o} className="bg-altr-card text-altr-white">
          {o}
        </option>
      ))}
    </select>
  )
}

function ChipMulti({
  options,
  selected,
  onToggle,
}: {
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] tracking-wider uppercase transition ${
              isActive
                ? 'border-altr-mint-bright/60 bg-altr-mint/[0.16] text-altr-mint-bright'
                : 'border-white/[0.08] bg-altr-bg/40 text-altr-text-2 hover:border-white/[0.16] hover:text-altr-white'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function PreIntelligencePreview({
  stage,
  hydrated,
}: {
  stage: StageProfile
  hydrated: boolean
}) {
  const reading = buildReading(stage)
  const analyze = buildAnalysisAxes(stage)
  const screening = buildScreeningAxes(stage)

  return (
    <div className="lg:sticky lg:top-[120px] lg:self-start">
      <div className="rounded-2xl border border-altr-mint-bright/30 bg-altr-mint/[0.04] p-6 md:p-7">
        <span className="font-mono text-[10px] tracking-[0.22em] text-altr-mint-bright uppercase">
          PRE Intelligence preview
        </span>

        <Block label="Reading" lines={reading} />
        <Block label="Will analyze" lines={analyze} />
        <Block label="Will screen for" lines={screening} />

        <button
          type="submit"
          disabled={!hydrated}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-altr-mint px-5 py-3 text-[13.5px] font-semibold text-altr-white transition hover:bg-altr-mint-bright disabled:cursor-wait disabled:opacity-50"
        >
          Run ALTR screening →
        </button>

        <p className="mt-3 text-center font-mono text-[9.5px] tracking-[0.18em] text-altr-text-3 uppercase">
          Powered by Claude · audience + market analysis
        </p>
      </div>
    </div>
  )
}

function Block({ label, lines }: { label: string; lines: string[] }) {
  if (lines.length === 0) return null
  return (
    <div className="mt-5 border-t border-white/[0.06] pt-5 first:mt-5 first:border-t-0 first:pt-0">
      <span className="font-mono text-[10px] tracking-[0.18em] text-altr-text-3 uppercase">
        {label}
      </span>
      <ul className="mt-2 flex flex-col gap-1.5">
        {lines.map((line) => (
          <li
            key={line}
            className="flex items-start gap-2 text-[13px] leading-[1.5] text-altr-text-2"
          >
            <span className="mt-[7px] inline-block h-1 w-1 flex-shrink-0 rounded-[1px] bg-altr-mint-bright" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function buildReading(stage: StageProfile): string[] {
  const lines: string[] = []
  if (stage.stageType) lines.push(`${stage.stageType} · ${stage.subCategory}`)
  if (stage.city && stage.country) lines.push(`${stage.city}, ${stage.country}`)
  if (stage.audienceSize) lines.push(`Audience: ${stage.audienceSize}`)
  if (stage.audienceProfile.length > 0)
    lines.push(`Profile: ${stage.audienceProfile.join(' · ')}`)
  if (stage.rsEligible) lines.push(`RS: ${stage.rsEligible.split(' — ')[0]}`)
  if (stage.nextEdition) lines.push(`Next: ${stage.nextEdition}`)
  return lines
}

function buildAnalysisAxes(stage: StageProfile): string[] {
  const axes: string[] = []
  axes.push('Audience signal vs comparable GCC stages')
  if (stage.targetSponsorOrigin.includes('K-content')) {
    axes.push('K-content category whitespace + prior K-brand precedents')
  } else if (stage.targetSponsorOrigin.length > 0) {
    axes.push(`${stage.targetSponsorOrigin[0]} brand demand benchmarks`)
  } else {
    axes.push('Cross-origin brand demand benchmarks')
  }
  if (stage.rsEligible.startsWith('Yes')) {
    axes.push('RS deal precedents + POS attribution viability')
  } else {
    axes.push('Fixed-fee vs RS market pricing')
  }
  axes.push(`${stage.nextEdition || 'Window'} seasonality + timing risk`)
  return axes
}

function buildScreeningAxes(stage: StageProfile): string[] {
  const axes: string[] = []
  if (stage.targetSponsorVerticals.length > 0) {
    axes.push(
      `Sponsor verticals: ${stage.targetSponsorVerticals.slice(0, 3).join(' · ')}`,
    )
  } else {
    axes.push('Best-fit sponsor verticals (recommendation)')
  }
  if (stage.targetSponsorOrigin.length > 0) {
    axes.push(`Origin focus: ${stage.targetSponsorOrigin.join(' · ')}`)
  }
  if (stage.partnershipTypes.length > 0) {
    axes.push(`Type: ${stage.partnershipTypes.join(' · ')}`)
  }
  if (stage.budgetTier) {
    axes.push(`Budget tier: ${stage.budgetTier}`)
  }
  return axes
}
