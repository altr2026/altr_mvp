import { StepPlaceholder } from '@/components/demo/StepPlaceholder'
import { StepShell } from '@/components/demo/StepShell'

export default function Step6Page() {
  return (
    <StepShell currentStep={6}>
      <StepPlaceholder step={6} />
    </StepShell>
  )
}
