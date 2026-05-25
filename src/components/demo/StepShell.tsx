'use client'

import { useDemoState } from '@/components/providers/DemoStateProvider'
import { MATCH_META } from '@/lib/demo-state'
import { DealHeaderBar } from './DealHeaderBar'

type Props = {
  currentStep: number
  children: React.ReactNode
}

export function StepShell({ currentStep, children }: Props) {
  const { state: { brand }, selectedMatch } = useDemoState()
  const includeIP = currentStep >= 3 && Boolean(selectedMatch)
  const meta = selectedMatch ? MATCH_META[selectedMatch.id] : null

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-6 py-8 md:px-8 md:py-10">
      <DealHeaderBar
        currentStep={currentStep}
        brand={brand.brandName}
        brandSub={brand.vertical}
        ipName={includeIP && meta ? meta.name : undefined}
        ipShort={includeIP && meta ? meta.shortName : undefined}
        ipSub={includeIP && meta ? `${meta.category}, ${meta.location}` : undefined}
      />
      {children}
    </div>
  )
}
