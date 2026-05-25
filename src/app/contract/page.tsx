import { StepPlaceholder } from '@/components/demo/StepPlaceholder'
import { StepShell } from '@/components/demo/StepShell'

export default function Step4Page() {
  return (
    <StepShell currentStep={4}>
      <StepPlaceholder step={4} />
    </StepShell>
  )
}
