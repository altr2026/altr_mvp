import Image from 'next/image'
import type { RightHolder } from '@/types'

const TYPE_LABEL: Record<RightHolder['type'], string> = {
  'live-event': 'Live Event',
  'mall-activation': 'Mall',
  'hospitality-popup': 'Hospitality',
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const formatDateRange = (startISO: string, endISO: string): string => {
  const [sy, sm, sd] = startISO.split('-').map(Number)
  const [ey, em, ed] = endISO.split('-').map(Number)
  const sMonth = MONTHS[sm - 1]
  const eMonth = MONTHS[em - 1]
  if (sy === ey && sm === em && sd === ed) return `${sMonth} ${sd}`
  if (sy === ey && sm === em) return `${sMonth} ${sd}–${ed}`
  return `${sMonth} ${sd} – ${eMonth} ${ed}`
}

const formatReach = (n: number): string => {
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return `${m >= 10 ? m.toFixed(0) : m.toFixed(1)}M`
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

const formatPrice = (n: number): string => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n}`
}

type Props = {
  rightHolder: RightHolder
}

export function LiveIPCard({ rightHolder: rh }: Props) {
  const lowestSlot = rh.availableSlots.reduce((min, s) =>
    s.baseRate < min.baseRate ? s : min,
  )
  const starts = rh.availableSlots.map((s) => s.startDate).sort()
  const ends = rh.availableSlots.map((s) => s.endDate).sort()
  const dateRange = formatDateRange(starts[0], ends[ends.length - 1])

  return (
    <article className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/[0.06] bg-altr-card transition hover:border-altr-mint-bright/40">
      <Image
        src={rh.heroImage}
        alt={rh.name}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition duration-700 group-hover:scale-[1.04]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-altr-bg from-5% via-altr-bg/85 via-40% to-altr-bg/0 to-65%" />

      <div className="absolute top-4 left-4 flex gap-1.5">
        <span className="rounded bg-altr-bg/85 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-altr-white backdrop-blur">
          {TYPE_LABEL[rh.type]}
        </span>
        <span className="rounded bg-altr-bg/85 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-altr-mint-bright backdrop-blur">
          {rh.region}
        </span>
      </div>

      <div className="absolute top-4 right-4 rounded-md border border-altr-lime/30 bg-altr-bg/90 px-2.5 py-1.5 backdrop-blur">
        <span className="font-mono text-[11px] font-semibold tracking-wider text-altr-lime">
          {dateRange}
        </span>
      </div>

      <div className="absolute right-5 bottom-5 left-5 flex flex-col gap-2">
        <h3 className="text-[18px] leading-[1.2] font-semibold tracking-[-0.01em] text-altr-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] md:text-[20px]">
          {rh.name}
        </h3>
        <div className="flex items-end justify-between gap-3">
          <p className="truncate text-[12.5px] text-altr-text-2">
            {rh.city}, {rh.country}
          </p>
          <div className="flex flex-shrink-0 items-baseline gap-3">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-altr-text-3">
                reach
              </span>
              <span className="font-mono text-[13px] font-semibold text-altr-white">
                {formatReach(rh.audienceSize)}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-altr-text-3">
                from
              </span>
              <span className="font-mono text-[13px] font-semibold text-altr-mint-bright">
                {formatPrice(lowestSlot.baseRate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
