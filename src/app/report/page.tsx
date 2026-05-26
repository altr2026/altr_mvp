import { StepFooter } from '@/components/demo/StepFooter'
import { StepPlaceholder } from '@/components/demo/StepPlaceholder'
import { StepShell } from '@/components/demo/StepShell'

export default function ReportPage() {
  return (
    <StepShell currentStep={6}>
      <StepPlaceholder step={6} />
      <StepFooter backHref="/rail" />
    </StepShell>
  )
}
