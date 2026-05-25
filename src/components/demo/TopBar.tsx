'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/site/Header'
import { showDealTracker, stepFromPath } from '@/lib/demo-flow'
import { DealTracker } from './DealTracker'

export function TopBar() {
  const pathname = usePathname()
  const step = stepFromPath(pathname)

  if (!step) return <Header />
  if (!showDealTracker(step.number)) return <Header />
  return <DealTracker currentStep={step.number} />
}
