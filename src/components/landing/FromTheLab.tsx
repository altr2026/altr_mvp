import Link from 'next/link'
import type { Insight } from '@/types'

const formatDate = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

type Props = {
  insights: Insight[]
}

export function FromTheLab({ insights }: Props) {
  return (
    <section className="px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h2 className="text-[24px] font-semibold tracking-[-0.025em] md:text-[32px]">
              From the lab
            </h2>
            <p className="mt-3 max-w-2xl text-[14px] leading-[1.6] text-altr-text-2 md:text-[15px]">
              Latest market data and pricing benchmarks. A monthly read on
              what is happening across ASIA sponsorship.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {insights.map((insight) => (
            <Link
              key={insight.id}
              href={insight.href}
              className="group flex flex-col rounded-xl border border-white/[0.06] bg-altr-card p-6 transition hover:border-altr-mint-bright/30 hover:bg-altr-card/80"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-altr-mint-bright">
                  {insight.category}
                </span>
                <time className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-text-3">
                  {formatDate(insight.publishedAt)}
                </time>
              </div>
              <h3 className="mt-4 text-[18px] font-semibold leading-[1.3] text-altr-white">
                {insight.title}
              </h3>
              <p className="mt-3 flex-1 text-[14px] leading-[1.55] text-altr-text-2">
                {insight.summary}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-altr-text-2 transition group-hover:text-altr-lime">
                Read more →
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="#waitlist"
          className="mt-8 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-altr-text-2 transition hover:text-altr-white"
        >
          All insights →
        </Link>
      </div>
    </section>
  )
}
