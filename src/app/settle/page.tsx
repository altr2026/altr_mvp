import { StepPlaceholder } from '@/components/demo/StepPlaceholder'
import { StepShell } from '@/components/demo/StepShell'

export default function Step7Page() {
  return (
    <StepShell currentStep={7}>
      <StepPlaceholder step={7} />
    </StepShell>
  )
}
