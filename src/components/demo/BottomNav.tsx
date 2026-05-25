'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { DEMO_STEPS, stepFromPath } from '@/lib/demo-flow'
import { resetDemoState } from '@/lib/demo-state'

const BTN_CLASS =
  'inline-flex items-center gap-2 rounded-lg border bg-transparent px-5 py-2.5 font-sans text-[14px] font-medium text-demo-text transition hover:bg-demo-surface-2'

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const step = stepFromPath(pathname)

  if (!step) return null

  const prevStep = step.number > 1 ? DEMO_STEPS[step.number - 2] : null
  const nextStep = step.number < DEMO_STEPS.length ? DEMO_STEPS[step.number] : null
  const isFinal = step.number === DEMO_STEPS.length

  const handleReset = () => {
    resetDemoState()
    router.push('/')
  }

  return (
    <nav className="sticky bottom-0 z-40 border-t border-demo-border bg-demo-surface px-6 py-4 md:px-8">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-3">
        {prevStep ? (
          <Link
            href={prevStep.route}
            className={BTN_CLASS}
            style={{ borderColor: '#2A2A3A', borderWidth: '0.5px' }}
          >
            ← Back
          </Link>
        ) : (
          <span aria-hidden />
        )}
        {isFinal ? (
          <button
            type="button"
            onClick={handleReset}
            className={BTN_CLASS}
            style={{ borderColor: '#2A2A3A', borderWidth: '0.5px' }}
          >
            Start new match →
          </button>
        ) : nextStep ? (
          <Link
            href={nextStep.route}
            className={BTN_CLASS}
            style={{ borderColor: '#2A2A3A', borderWidth: '0.5px' }}
          >
            Next →
          </Link>
        ) : null}
      </div>
    </nav>
  )
}
