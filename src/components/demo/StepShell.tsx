'use client'

import { useEffect, useState } from 'react'
import {
  DEFAULT_BRAND,
  loadDemoState,
  MATCH_META,
  selectedMatch,
} from '@/lib/demo-state'
import { DealHeaderBar } from './DealHeaderBar'

type Props = {
  currentStep: number
  children: React.ReactNode
}

const DEFAULT_IP = {
  name: 'Frieze Abu Dhabi',
  short: 'Frieze',
  sub: 'Art Festival, UAE',
}

export function StepShell({ currentStep, children }: Props) {
  const [brandName, setBrandName] = useState<string>(DEFAULT_BRAND.brandName)
  const [vertical, setVertical] = useState<string>(DEFAULT_BRAND.vertical)
  const [ip, setIp] = useState(DEFAULT_IP)
  const [hasMatch, setHasMatch] = useState(false)

  useEffect(() => {
    const s = loadDemoState()
    setBrandName(s.brand.brandName)
    setVertical(s.brand.vertical)
    const match = selectedMatch(s)
    if (match) {
      const meta = MATCH_META[match.id]
      setIp({
        name: meta.name,
        short: meta.shortName,
        sub: `${meta.category}, ${meta.location}`,
      })
      setHasMatch(true)
    }
  }, [])

  const includeIdentity = currentStep >= 3 && hasMatch

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-6 py-8 md:px-8 md:py-10">
      <DealHeaderBar
        currentStep={currentStep}
        brand={includeIdentity ? brandName : undefined}
        brandSub={includeIdentity ? vertical : undefined}
        ipName={includeIdentity ? ip.name : undefined}
        ipShort={includeIdentity ? ip.short : undefined}
        ipSub={includeIdentity ? ip.sub : undefined}
      />
      {children}
    </div>
  )
}
