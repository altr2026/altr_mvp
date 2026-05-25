import { StepShell } from '@/components/demo/StepShell'
import { BrandProfileForm } from '@/components/step1/BrandProfileForm'

export const metadata = {
  title: 'Step 1 — Post your brief · ALTR',
  description:
    'Tell ALTR about your brand. The matching engine reads these signals to surface the right Live IP — and to draft your deal terms.',
}

export default function BriefStep1Page() {
  return (
    <StepShell currentStep={1}>
      <BrandProfileForm />
    </StepShell>
  )
}
