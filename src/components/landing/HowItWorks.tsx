type Step = {
  num: string
  label: string
  body: string
}

const STEPS: Step[] = [
  {
    num: '01',
    label: 'List',
    body: 'Add your Live IP in thirty minutes. Audience, pricing, and packages in one place.',
  },
  {
    num: '02',
    label: 'Match',
    body: 'We bring vetted brands actively looking for your audience and budget.',
  },
  {
    num: '03',
    label: 'Settle and measure',
    body: 'Milestone payouts. Verifiable receipts. ROI you can show your board.',
  },
]

export function HowItWorks() {
  return (
    <section className="px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-3xl text-[24px] font-semibold leading-[1.15] tracking-[-0.025em] md:text-[34px]">
          From listing to settled in days, not months.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="flex flex-col rounded-xl border border-white/[0.06] bg-altr-card p-7"
            >
              <span className="font-mono text-[11px] tracking-[0.2em] text-altr-mint-bright">
                {step.num}
              </span>
              <h3 className="mt-2 text-[20px] font-semibold text-altr-white">
                {step.label}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.6] text-altr-text-2">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
