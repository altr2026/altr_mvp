import { StageProfileForm } from '@/components/list-stage/StageProfileForm'

export const metadata = {
  title: 'List your stage — ALTR Screening · PRE Intelligence',
  description:
    'Tell ALTR about your Live IP. The AI reads your audience signal, category whitespace, and prior brand history — then surfaces sponsors that fit your stage.',
}

export default function ListStagePage() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 py-10 md:px-8 md:py-12">
      <StageProfileForm />
    </div>
  )
}
