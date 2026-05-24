type Capability = {
  label: string
  body: string
}

const CAPABILITIES: Capability[] = [
  {
    label: 'Pricing intelligence',
    body: 'Benchmark against 12+ similar stages in the same vertical and region so you stop leaving money on the table.',
  },
  {
    label: 'Audience insights',
    body: 'Your demographic and behavioral data, normalized and organized for sponsor decks.',
  },
  {
    label: 'Sponsor matching',
    body: 'Brands actively looking for your audience size and budget — pre-screened, no cold inbound.',
  },
  {
    label: 'Payment automation',
    body: 'Milestone-based payouts. Real-time settlement. Verifiable proof of delivery on every tranche.',
  },
]

export function RightsholderCapabilities() {
  return (
    <section className="px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-3xl text-[24px] font-semibold leading-[1.15] tracking-[-0.025em] md:text-[34px]">
          Tools that pay back the half-day you spend{' '}
          <span className="text-altr-mint">onboarding</span>.
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
