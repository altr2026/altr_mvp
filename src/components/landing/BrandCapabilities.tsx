type Capability = {
  label: string
  body: string
}

const CAPABILITIES: Capability[] = [
  {
    label: 'Curated stages',
    body: 'Live IP across ASIA, vetted on audience quality and operational reliability.',
  },
  {
    label: 'Transparent pricing',
    body: 'Real ranges, no PDF deck back-and-forth. See the price before you spend a meeting on it.',
  },
  {
    label: 'ROI measurement',
    body: 'POS API + reach data wired directly to your spend. ROI is the revenue itself.',
  },
  {
    label: 'Verified audience data',
    body: 'Demographic and behavioral data normalized so you can compare across markets.',
  },
]

export function BrandCapabilities() {
  return (
    <section className="px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-3xl text-[24px] font-semibold leading-[1.15] tracking-[-0.025em] md:text-[34px]">
          A sponsorship desk that runs on{' '}
          <span className="text-altr-mint">data</span>, not relationships.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.label}
              className="flex flex-col rounded-2xl border border-white/[0.06] bg-altr-card p-7"
            >
              <h3 className="text-[18px] font-semibold text-altr-white">
                {cap.label}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.6] text-altr-text-2">
                {cap.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
