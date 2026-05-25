import type { RightHolder } from '@/types'
import { LiveIPCard } from './LiveIPCard'

type Props = {
  rightHolders: RightHolder[]
}

export function LiveIPCarousel({ rightHolders }: Props) {
  return (
    <section id="live-ip" className="px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] md:text-[22px]">
            Live activations & pop-ups
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-altr-text-2">
            {rightHolders.length} active
          </span>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rightHolders.map((rh) => (
            <LiveIPCard key={rh.id} rightHolder={rh} />
          ))}
        </div>
      </div>
    </section>
  )
}
