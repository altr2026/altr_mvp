import { StepPlaceholder } from '@/components/demo/StepPlaceholder'
import { StepShell } from '@/components/demo/StepShell'

export default function Step8Page() {
  return (
    <StepShell currentStep={8}>
      <StepPlaceholder step={8} />
    </StepShell>
  )
}
