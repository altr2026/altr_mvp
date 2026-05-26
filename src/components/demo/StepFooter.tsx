'use client'

import Link from 'next/link'

type Props = {
  backHref: string
  backLabel?: string
  statusLine?: React.ReactNode
  rightSlot?: React.ReactNode
}

export function StepFooter({
  backHref,
  backLabel = '← Back',
  statusLine,
  rightSlot,
}: Props) {
  return (
    <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-transparent px-5 py-3 text-[13px] font-medium text-white/70 transition hover:border-white/[0.16] hover:bg-white/[0.04] hover:text-white"
      >
        {backLabel}
      </Link>
      {(statusLine || rightSlot) && (
        <div className="flex flex-col items-end gap-3">
          {statusLine}
          {rightSlot}
        </div>
      )}
    </div>
  )
}
