'use client'

import { usePathname } from 'next/navigation'
import { showDealTracker, stepFromPath } from '@/lib/demo-flow'
import { DealTracker } from './DealTracker'
import { TopNav } from './TopNav'

export function TopBar() {
  const pathname = usePathname()
  const step = stepFromPath(pathname)

  if (!step) return <TopNav />
  if (!showDealTracker(step.number)) return <TopNav />
  return <DealTracker currentStep={step.number} />
}
