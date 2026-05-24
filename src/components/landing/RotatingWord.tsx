'use client'

import { useEffect, useState } from 'react'

type Phase = 'typing' | 'pausing' | 'deleting'

type Props = {
  words: string[]
  typeMs?: number
  deleteMs?: number
  pauseMs?: number
  className?: string
}

export function RotatingWord({
  words,
  typeMs = 70,
  deleteMs = 38,
  pauseMs = 1500,
  className = 'text-altr-mint',
}: Props) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<Phase>('typing')

  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b), '')

  useEffect(() => {
    if (words.length === 0) return
    const current = words[index] ?? ''
    let timer: ReturnType<typeof setTimeout> | null = null

    if (phase === 'typing') {
      if (text.length < current.length) {
        timer = setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          typeMs,
        )
      } else {
        timer = setTimeout(() => setPhase('pausing'), 0)
      }
    } else if (phase === 'pausing') {
      timer = setTimeout(() => setPhase('deleting'), pauseMs)
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), deleteMs)
      } else {
        setIndex((i) => (i + 1) % words.length)
        setPhase('typing')
      }
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [text, phase, index, words, typeMs, deleteMs, pauseMs])

  return (
    <span className="relative inline-block align-baseline">
      <span className="invisible whitespace-nowrap" aria-hidden>
        {longest}
      </span>
      <span
        className={`absolute top-0 left-0 whitespace-nowrap ${className}`}
        aria-live="polite"
      >
        {text}
        <span
          className="altr-cursor ml-[2px] inline-block h-[0.85em] w-[2px] translate-y-[0.08em] bg-current align-baseline"
          aria-hidden
        />
      </span>
    </span>
  )
}
