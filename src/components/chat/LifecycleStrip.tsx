type Props = {
  currentStep?: 1 | 2 | 3 | 4 | 5 | 6
}

type Step = {
  num: string
  label: string
  sub: string
}

const STEPS: Step[] = [
  { num: '01', label: 'Narrow down', sub: 'Intelligence' },
  { num: '02', label: 'Match', sub: 'Top stages' },
  { num: '03', label: 'Contract', sub: 'Terms drafted' },
  { num: '04', label: 'Execute', sub: 'Rightsholder zone' },
  { num: '05', label: 'Settle', sub: 'Real-time · 3 sec' },
  { num: '06', label: 'Benchmark', sub: 'Intelligence' },
]

export function LifecycleStrip({ currentStep = 1 }: Props) {
  return (
    <div className="border-b border-white/[0.06] bg-altr-bg/60 px-6 py-3 md:px-8">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto">
        {STEPS.map((step, idx) => {
          const stepIdx = idx + 1
          const isActive = stepIdx === currentStep
          const isPast = stepIdx < currentStep
          const isComing = stepIdx > currentStep
          return (
            <div key={step.num} className="flex flex-shrink-0 items-center">
              <div
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 ${
                  isActive
                    ? 'border border-altr-mint-bright/40 bg-altr-mint/[0.08]'
                    : ''
                }`}
              >
                <span
                  className={`font-mono text-[10px] tracking-[0.18em] ${
                    isActive
                      ? 'text-altr-mint-bright'
                      : isPast
                        ? 'text-altr-text-2'
                        : 'text-altr-text-3'
                  }`}
                >
                  {step.num}
                </span>
                <div className="flex flex-col">
                  <span
                    className={`text-[12px] leading-tight font-medium ${
                      isActive
                        ? 'text-altr-white'
                        : isPast
                          ? 'text-altr-text-2'
                          : 'text-altr-text-3'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="font-mono text-[9px] tracking-wider text-altr-text-3 uppercase">
                    {step.sub}
                  </span>
                </div>
              </div>
              {idx < STEPS.length - 1 && (
                <span
                  className={`px-1 text-[12px] ${
                    isComing ? 'text-altr-text-3' : 'text-altr-text-2'
                  }`}
                  aria-hidden
                >
                  →
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
