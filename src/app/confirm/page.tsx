import { StepShell } from '@/components/demo/StepShell'
import { GoldenMatch } from '@/components/step3/GoldenMatch'

export const metadata = {
  title: 'Step 3 — Golden match · ALTR',
  description:
    'Mutual confirm. Both sides accepted. Audience fit verified. RS model agreed.',
}

export default function ConfirmPage() {
  return (
    <StepShell currentStep={2}>
      <GoldenMatch />
    </StepShell>
  )
}
