type Stat = {
  value: string
  label: string
}

const STATS: Stat[] = [
  { value: '6', label: 'Live IP catalogued' },
  { value: '4', label: 'Verticals covered' },
  { value: '5', label: 'Cities across ASIA' },
  { value: '3s', label: 'Real-time settlement' },
]

export function StatsStrip() {
  return (
    <section className="px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-[24px] font-semibold tracking-[-0.025em] md:text-[32px]">
          One view across every vertical and region.
        </h2>
        <p className="mt-3 max-w-2xl text-[14px] leading-[1.6] text-altr-text-2 md:text-[15px]">
          Catalogue snapshot. Pricing and audience data unlock for approved
          brands after listing.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] md:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-1.5 bg-altr-bg p-6 md:p-7"
            >
              <span className="font-mono text-[32px] leading-none font-bold text-altr-mint-bright md:text-[40px]">
                {stat.value}
              </span>
              <span className="text-[12.5px] text-altr-text-2">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
