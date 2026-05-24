import type { ConversationCollected, FormatPreference } from '@/types'

type Props = {
  collected: ConversationCollected
}

const verticalLabel = (v: string) => {
  if (v === 'F&B') return 'F&B'
  if (v === 'IP') return 'IP / Entertainment'
  return v.charAt(0).toUpperCase() + v.slice(1)
}

const budgetLabel = (n: number): string => {
  if (n >= 1_000_000) return `≤ $${(n / 1_000_000).toFixed(1)}M`
  return `≤ $${Math.round(n / 1000)}k`
}

const formatLabel = (f: FormatPreference): string => {
  const map: Record<FormatPreference, string> = {
    booth: 'Booth',
    'pop-up': 'Pop-up RS',
    'branded-zone': 'Branded zone',
    open: 'Open to all',
  }
  return map[f]
}

type Slot = {
  key: string
  label: string
  value: string | null
}

export function CollectedChips({ collected }: Props) {
  const slots: Slot[] = [
    {
      key: 'vertical',
      label: 'Vertical',
      value: collected.vertical ? verticalLabel(collected.vertical) : null,
    },
    {
      key: 'region',
      label: 'Region',
      value: collected.region ?? null,
    },
    {
      key: 'format',
      label: 'Format',
      value: collected.formatPreference
        ? formatLabel(collected.formatPreference)
        : null,
    },
    {
      key: 'budget',
      label: 'Budget',
      value:
        collected.budgetCeilingUSD !== undefined
          ? budgetLabel(collected.budgetCeilingUSD)
          : null,
    },
    {
      key: 'anchor',
      label: 'Anchor',
      value:
        collected.needsAnchorIP === undefined
          ? null
          : collected.needsAnchorIP
            ? 'required'
            : 'open',
    },
  ]

  const filledCount = slots.filter((s) => s.value !== null).length

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-altr-card/60 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-text-3">
          Agent collecting
        </span>
        <span className="font-mono text-[10px] tracking-[0.18em] text-altr-text-3">
          {filledCount} / {slots.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {slots.map((slot) =>
          slot.value ? (
            <div
              key={slot.key}
              className="flex items-center gap-2 rounded-full border border-altr-mint-bright/30 bg-altr-mint/[0.08] px-3 py-1"
            >
              <span className="font-mono text-[9px] tracking-wider text-altr-mint-bright/70 uppercase">
                {slot.label}
              </span>
              <span className="text-[12px] font-medium text-altr-white">
                {slot.value}
              </span>
            </div>
          ) : (
            <div
              key={slot.key}
              className="rounded-full border border-dashed border-white/[0.1] px-3 py-1"
            >
              <span className="font-mono text-[9px] tracking-wider text-altr-text-3 uppercase">
                {slot.label}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
