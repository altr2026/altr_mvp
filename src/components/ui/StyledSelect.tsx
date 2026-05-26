'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  value: string
  options: string[]
  onChange: (v: string) => void
  placeholder?: string
  triggerClassName: string
  // Optional read-only prefix rendered before the selected value in the
  // trigger button — used to inline auto-derived context (e.g. an FX path
  // prefix "KRW → USDC →" before the destination-currency choice).
  prefix?: string
}

export function StyledSelect({
  value,
  options,
  onChange,
  placeholder = 'Select…',
  triggerClassName,
  prefix,
}: Props) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!open) return
    const idx = options.indexOf(value)
    setActiveIndex(idx >= 0 ? idx : 0)
  }, [open, value, options])

  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (!open || activeIndex < 0 || !listRef.current) return
    const el = listRef.current.querySelector<HTMLLIElement>(
      `[data-idx="${activeIndex}"]`,
    )
    el?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % options.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + options.length) % options.length)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (activeIndex >= 0) {
        onChange(options[activeIndex])
        setOpen(false)
      }
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActiveIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActiveIndex(options.length - 1)
    }
  }

  const isPlaceholder = !value

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className={`${triggerClassName} flex w-full items-center justify-between gap-3 text-left`}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {prefix && (
            <span className="font-mono text-[12px] whitespace-nowrap text-white/40">
              {prefix}
            </span>
          )}
          <span className={`truncate ${isPlaceholder ? 'text-white/40' : ''}`}>
            {value || placeholder}
          </span>
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden
          className={`flex-shrink-0 text-white/50 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        >
          <path
            d="M3 4.5 6 7.5 9 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-1.5 max-h-72 w-full overflow-auto rounded-lg border border-white/[0.08] bg-[#0B0D11] py-1 shadow-2xl shadow-black/60"
        >
          {options.map((opt, idx) => {
            const isActive = idx === activeIndex
            const isSelected = opt === value
            return (
              <li
                key={opt}
                data-idx={idx}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                  buttonRef.current?.focus()
                }}
                className={`cursor-pointer px-4 py-2.5 text-[13.5px] transition ${
                  isActive ? 'bg-white/[0.06]' : ''
                } ${isSelected ? 'text-emerald-300' : 'text-white/85'}`}
              >
                {opt}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
