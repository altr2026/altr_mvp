import Image from 'next/image'
import type { RightHolder } from '@/types'

const TYPE_LABEL: Record<RightHolder['type'], string> = {
  'live-event': 'Live Event',
  'mall-activation': 'Mall',
  'hospitality-popup': 'Hospitality',
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
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-altr-card transition hover:border-altr-mint-bright/30">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={rh.heroImage}
          alt={rh.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="rounded bg-altr-bg/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-altr-white backdrop-blur">
            {TYPE_LABEL[rh.type]}
          </span>
          <span className="rounded bg-altr-bg/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-altr-mint-bright backdrop-blur">
            {rh.region}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-[16px] font-semibold leading-[1.3] text-altr-white">
          {rh.name}
        </h3>
        <p className="text-[13px] text-altr-text-2">
          {rh.city}, {rh.country}
        </p>
        <div className="mt-3 flex items-end justify-between border-t border-white/[0.05] pt-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-altr-text-3">
              Reach
            </p>
            <p className="font-mono text-[15px] text-altr-white">
              {formatReach(rh.audienceSize)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-wider text-altr-text-3">
              From
            </p>
            <p className="font-mono text-[15px] text-altr-lime">
              {formatPrice(lowestSlot.baseRate)}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
