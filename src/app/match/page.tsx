import { MatchPage } from '@/components/step2/MatchPage'

export const metadata = {
  title: 'Step 2 — Stage matches · ALTR',
  description:
    'Three Live IP matches with AI-generated reasoning and ROI prediction. Pick one to confirm.',
}

export default function Step2Page() {
  return (
    <div className="mx-auto w-full max-w-[960px] px-6 py-10 md:px-8 md:py-12">
      <MatchPage />
    </div>
  )
}
