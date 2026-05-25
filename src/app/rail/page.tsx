import { StepPlaceholder } from '@/components/demo/StepPlaceholder'
import { StepShell } from '@/components/demo/StepShell'

export default function Step5Page() {
  return (
    <StepShell currentStep={5}>
      <StepPlaceholder step={5} />
    </StepShell>
  )
}
