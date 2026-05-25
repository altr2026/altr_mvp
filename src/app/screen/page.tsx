import { StageScreenPage } from '@/components/list-stage/StageScreenPage'

export const metadata = {
  title: 'Stage screening — ALTR PRE Intelligence',
  description:
    'AI-generated market readout: audience strength, category whitespace, sponsor verticals that fit, and rough pricing benchmarks for your Live IP.',
}

export default function ScreenPage() {
  return (
    <div className="mx-auto w-full max-w-[960px] px-6 py-10 md:px-8 md:py-12">
      <StageScreenPage />
    </div>
  )
}
