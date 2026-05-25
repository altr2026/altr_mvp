'use client'

import { useEffect } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ open, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        onClick={onClose}
        aria-hidden
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.08] bg-altr-bg/95 p-6 shadow-2xl shadow-black/80 md:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition hover:bg-white/[0.06] hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M3 3 11 11 M11 3 3 11"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}
