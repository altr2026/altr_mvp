import { StepPlaceholder } from '@/components/demo/StepPlaceholder'
import { StepShell } from '@/components/demo/StepShell'

export default function SettlePage() {
  return (
    <StepShell currentStep={5}>
      <StepPlaceholder step={5} />
    </StepShell>
  )
}
