'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  BORDER_COLOR,
  DEMO_STEPS,
  LAYER_COLOR,
  SUCCESS_COLOR,
} from '@/lib/demo-flow'
import {
  DEFAULT_BRAND,
  loadDemoState,
  MATCH_META,
  selectedMatch,
} from '@/lib/demo-state'

type Props = {
  currentStep: number
}

export function DealTracker({ currentStep }: Props) {
  const [brandName, setBrandName] = useState<string>(DEFAULT_BRAND.brandName)
  const [ipName, setIpName] = useState<string>('Frieze Abu Dhabi')
  const [ipShort, setIpShort] = useState<string>('Frieze')
  const [vertical, setVertical] = useState<string>(DEFAULT_BRAND.vertical)
  const [ipCategory, setIpCategory] = useState<string>('Art Festival, UAE')

  useEffect(() => {
    const s = loadDemoState()
    setBrandName(s.brand.brandName)
    setVertical(s.brand.vertical)
    const match = selectedMatch(s)
    if (match) {
      const meta = MATCH_META[match.id]
      setIpName(meta.name)
      setIpShort(meta.shortName)
      setIpCategory(`${meta.category}, ${meta.location}`)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-demo-border bg-demo-surface px-4 md:px-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex items-center gap-3 pt-3 md:pt-4">
          <Link
            href="/"
            aria-label="altr home"
            className="inline-flex items-end transition hover:opacity-80"
          >
            <Image
              src="/altr-logo-white.png"
              alt="altr"
              width={50}
              height={18}
              priority
              className="h-[16px] w-auto md:h-[18px]"
            />
          </Link>
        </div>

        <div className="flex flex-col gap-3 pt-3 pb-4 md:flex-row md:items-center md:justify-between md:gap-8 md:pt-2 md:pb-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 md:gap-3">
              <span className="text-[15px] font-semibold text-demo-text md:text-[16px]">
                {brandName}
              </span>
              <span className="text-demo-text-faint" aria-hidden>
                ×
              </span>
              <span className="text-[15px] font-semibold text-demo-text md:text-[16px]">
                <span className="md:hidden">{ipShort}</span>
                <span className="hidden md:inline">{ipName}</span>
              </span>
            </div>
            <div className="hidden items-center gap-3 font-mono text-[10.5px] tracking-[0.15em] text-demo-text-faint uppercase md:flex">
              <span>{vertical}</span>
              <span aria-hidden>·</span>
              <span>{ipCategory}</span>
            </div>
          </div>

          <DotTrail currentStep={currentStep} />
        </div>
      </div>
    </header>
  )
}

function DotTrail({ currentStep }: { currentStep: number }) {
  return (
    <div className="-mx-4 flex items-start overflow-x-auto px-4 md:mx-0 md:px-0">
      <div className="flex items-start gap-0">
        {DEMO_STEPS.map((s, idx) => {
          const isCompleted = s.number < currentStep
          const isCurrent = s.number === currentStep
          const isClickable = s.number <= currentStep
          const layerColor = LAYER_COLOR[s.layer]
          const lineColor =
            idx > 0 && (DEMO_STEPS[idx - 1].number < currentStep || isCurrent)
              ? SUCCESS_COLOR
              : BORDER_COLOR

          return (
            <div key={s.number} className="flex items-start">
              {idx > 0 && (
                <span
                  aria-hidden
                  className="mx-0 mt-[10px] block h-px w-6 flex-shrink-0 md:w-10"
                  style={{ background: lineColor }}
                />
              )}
              <DotWithLabel
                stepNumber={s.number}
                shortLabel={s.shortLabel}
                route={s.route}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                isClickable={isClickable}
                layerColor={layerColor}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

type DotProps = {
  stepNumber: number
  shortLabel: string
  route: string
  isCompleted: boolean
  isCurrent: boolean
  isClickable: boolean
  layerColor: string
}

function DotWithLabel({
  stepNumber,
  shortLabel,
  route,
  isCompleted,
  isCurrent,
  isClickable,
  layerColor,
}: DotProps) {
  const dot = (
    <span className="flex flex-col items-center gap-1.5">
      <Dot
        isCompleted={isCompleted}
        isCurrent={isCurrent}
        layerColor={layerColor}
      />
      <span
        className="font-mono text-[9px] tracking-[0.15em] uppercase"
        style={{
          color: isCurrent
            ? layerColor
            : isCompleted
              ? SUCCESS_COLOR
              : '#5A5A6A',
        }}
      >
        {stepNumber.toString().padStart(2, '0')}
      </span>
      <span
        className="hidden font-mono text-[8.5px] tracking-[0.18em] uppercase md:block"
        style={{
          color: isCurrent
            ? layerColor
            : isCompleted
              ? '#9896A8'
              : '#5A5A6A',
        }}
      >
        {shortLabel}
      </span>
    </span>
  )

  if (isClickable) {
    return (
      <Link
        href={route}
        aria-label={`Step ${stepNumber}: ${shortLabel}`}
        className="group block focus:outline-none"
      >
        {dot}
      </Link>
    )
  }
  return (
    <span aria-label={`Step ${stepNumber}: ${shortLabel} (locked)`}>
      {dot}
    </span>
  )
}

function Dot({
  isCompleted,
  isCurrent,
  layerColor,
}: {
  isCompleted: boolean
  isCurrent: boolean
  layerColor: string
}) {
  if (isCompleted) {
    return (
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full"
        style={{ background: SUCCESS_COLOR }}
      >
        <svg
          width="11"
          height="9"
          viewBox="0 0 11 9"
          fill="none"
          aria-hidden
        >
          <path
            d="M1.5 4.5L4.25 7.25L9.5 1.75"
            stroke="#0A0A0F"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )
  }
  if (isCurrent) {
    return (
      <span
        className="demo-dot-glow relative inline-flex h-5 w-5 rounded-full"
        style={{
          background: layerColor,
          boxShadow: `0 0 0 3px ${layerColor}33`,
        }}
      />
    )
  }
  return (
    <span
      className="block h-4 w-4 rounded-full border"
      style={{ borderColor: BORDER_COLOR }}
    />
  )
}
