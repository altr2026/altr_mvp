import { StepFooter } from '@/components/demo/StepFooter'
import { StepShell } from '@/components/demo/StepShell'
import { ConfirmStage } from '@/components/confirm/ConfirmStage'

export const metadata = {
  title: 'Step 3 — Golden match · ALTR',
  description:
    'Mutual confirm. Both sides accepted. Audience fit verified. RS model agreed.',
}

export default function ConfirmPage() {
  return (
    <StepShell currentStep={2}>
      <ConfirmStage />
      <StepFooter backHref="/match" />
    </StepShell>
  )
}
