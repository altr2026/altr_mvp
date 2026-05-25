import { HeroCTAs } from './HeroCTAs'
import { HeroHeadline } from './HeroHeadline'

type Props = {
  liveIPCount: number
}

export function Hero({ liveIPCount }: Props) {
  return (
    <section className="px-6 pt-16 pb-14 md:px-8 md:pt-24 md:pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="min-h-[210px] md:min-h-[220px] lg:min-h-[200px]">
          <span className="inline-flex items-center gap-2 rounded border border-altr-mint-bright/30 bg-altr-mint/[0.06] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-altr-mint-bright">
            <span className="altr-pulse-dot inline-block h-1.5 w-1.5 rounded-[1px] bg-altr-lime" />
            Live IP × Brand · Cross-Border
          </span>

          <HeroHeadline />

          <p className="mt-3 max-w-2xl text-[13px] leading-[1.5] text-altr-text-2 md:mt-4 md:text-[14px]">
            Live properties get funded. Brands get presence. That&apos;s ALTR.
          </p>
        </div>

        <HeroCTAs />

        <div className="mt-24 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-5 md:mt-32">
          <div className="flex items-center gap-2.5">
            <span className="altr-pulse-dot inline-block h-2 w-2 rounded-[2px] bg-altr-lime" />
            <span className="text-[12.5px] text-altr-text-2">
              Live ·{' '}
              <span className="text-altr-white">
                {liveIPCount} live activations & pop-ups
              </span>{' '}
              across ASIA
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
