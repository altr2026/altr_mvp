import { GoldenMatch } from '@/components/step3/GoldenMatch'

export const metadata = {
  title: 'Step 3 — Golden match · ALTR',
  description:
    'Mutual confirm. Both sides accepted. Audience fit verified. RS model agreed.',
}

export default function Step3Page() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 md:px-8">
      <GoldenMatch />
    </div>
  )
}
