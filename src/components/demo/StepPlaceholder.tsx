import { DEMO_STEPS, LAYER_COLOR, LAYER_LABEL } from '@/lib/demo-flow'

type Props = {
  step: number
}

export function StepPlaceholder({ step: stepNumber }: Props) {
  const step = DEMO_STEPS[stepNumber - 1]
  if (!step) return null
  const color = LAYER_COLOR[step.layer]
  const label = LAYER_LABEL[step.layer]
  const padded = stepNumber.toString().padStart(2, '0')

  return (
    <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
      <span
        className="font-mono text-[64px] leading-none font-bold"
        style={{ color, opacity: 0.3 }}
      >
        {padded}
      </span>
      <h2 className="mt-2 font-sans text-[22px] font-bold text-demo-text">
        {step.label}
      </h2>
      <span
        className="mt-3 font-mono text-[11px] tracking-[0.2em] uppercase"
        style={{ color }}
      >
        {label}
      </span>
      <p className="mt-6 max-w-2xl text-[14px] leading-[1.6] text-demo-text-dim">
        {step.body}
      </p>
    </div>
  )
}
