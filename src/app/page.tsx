import { BrandProfileForm } from '@/components/step1/BrandProfileForm'

export const metadata = {
  title: 'Step 1 — Brand profile · ALTR',
  description:
    'Tell ALTR about your brand. Vertical, market, goal, format, budget, timeline — the matching engine reads these signals to surface the right Live IP.',
}

export default function Step1Page() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 py-10 md:px-8 md:py-12">
      <BrandProfileForm />
    </div>
  )
}
