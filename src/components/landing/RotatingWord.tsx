'use client'

import { useEffect, useState } from 'react'

type Props = {
  words: string[]
  intervalMs?: number
  transitionMs?: number
  className?: string
}

export function RotatingWord({
  words,
  intervalMs = 2200,
  transitionMs = 550,
  className = 'text-altr-mint',
}: Props) {
  const [index, setIndex] = useState(0)
  const [transitionOn, setTransitionOn] = useState(true)

  useEffect(() => {
    if (words.length <= 1) return
    const timer = setInterval(() => {
      setIndex((i) => i + 1)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [words.length, intervalMs])

  useEffect(() => {
    if (index === words.length) {
      const t = setTimeout(() => {
        setTransitionOn(false)
        setIndex(0)
      }, transitionMs)
      return () => clearTimeout(t)
    }
    if (!transitionOn) {
      const raf = requestAnimationFrame(() => setTransitionOn(true))
      return () => cancelAnimationFrame(raf)
    }
  }, [index, words.length, transitionMs, transitionOn])

  if (words.length === 0) return null

  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b), '')
  const stack = [...words, words[0]]

  return (
    <span
      className="relative inline-block overflow-hidden align-baseline"
      style={{ height: '1.1em', lineHeight: '1.1em' }}
    >
      <span className="invisible whitespace-nowrap" aria-hidden>
        {longest}
      </span>
      <span
        className={`absolute top-0 left-0 flex flex-col ${className}`}
        style={{
          transform: `translateY(-${index * 100}%)`,
          transition: transitionOn
            ? `transform ${transitionMs}ms cubic-bezier(0.16, 1, 0.3, 1)`
            : 'none',
        }}
        aria-live="polite"
      >
        {stack.map((word, i) => (
          <span
            key={i}
            className="block whitespace-nowrap"
            style={{ height: '1.1em', lineHeight: '1.1em' }}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  )
}
