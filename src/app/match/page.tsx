import { StepFooter } from '@/components/demo/StepFooter'
import { StepShell } from '@/components/demo/StepShell'
import { MatchPage } from '@/components/step2/MatchPage'

export const metadata = {
  title: 'Step 2 — Stage matches · ALTR',
  description:
    'Three Live IP matches with AI-generated reasoning and ROI prediction. Pick one to confirm.',
}

export default function MatchStepPage() {
  return (
    <StepShell currentStep={2}>
      <MatchPage />
      <StepFooter backHref="/brief" />
    </StepShell>
  )
}
