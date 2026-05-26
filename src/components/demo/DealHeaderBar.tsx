'use client'

import Link from 'next/link'
import {
  BORDER_COLOR,
  DEMO_STEPS,
  LAYER_COLOR,
  SUCCESS_COLOR,
} from '@/lib/demo-flow'

type Props = {
  currentStep: number
  brand?: string
  brandSub?: string
  ipName?: string
  ipShort?: string
  ipSub?: string
  onJump?: (n: number) => void
}

export function DealHeaderBar({
  currentStep,
  brand,
  brandSub,
  ipName,
  ipShort,
  ipSub,
  onJump,
}: Props) {
  const hasIdentity = Boolean(brand || ipName)
  const justifyClass = hasIdentity ? 'md:justify-between' : 'md:justify-end'

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-altr-card px-5 py-5 md:px-7 md:py-6">
      <div
        className={`flex flex-col gap-5 md:flex-row md:items-center md:gap-8 ${justifyClass}`}
      >
        {hasIdentity && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 md:gap-3">
              {brand && (
                <span className="text-[15px] font-semibold text-altr-white md:text-[17px]">
                  {brand}
                </span>
              )}
              {brand && ipName && (
                <span className="text-altr-text-3" aria-hidden>
                  ×
                </span>
              )}
              {ipName && (
                <span className="text-[15px] font-semibold text-altr-white md:text-[17px]">
                  <span className="md:hidden">{ipShort ?? ipName}</span>
                  <span className="hidden md:inline">{ipName}</span>
                </span>
              )}
            </div>
            {(brandSub || ipSub) && (
              <div className="hidden items-center gap-3 font-mono text-[10.5px] tracking-[0.15em] text-altr-text-3 uppercase md:flex">
                {brandSub && <span>{brandSub}</span>}
                {brandSub && ipSub && <span aria-hidden>·</span>}
                {ipSub && <span>{ipSub}</span>}
              </div>
            )}
          </div>
        )}

        <DotTrail currentStep={currentStep} onJump={onJump} />
      </div>
    </div>
  )
}

function DotTrail({
  currentStep,
  onJump,
}: {
  currentStep: number
  onJump?: (n: number) => void
}) {
  return (
    <div className="-mx-1 flex items-start overflow-x-auto px-1">
      <div className="flex items-start">
        {DEMO_STEPS.map((s, idx) => {
          const isCompleted = s.number < currentStep
          const isCurrent = s.number === currentStep
          const isClickable = Boolean(onJump) && s.number <= currentStep
          const layerColor = LAYER_COLOR[s.layer]
          const lineColor =
            idx > 0 && (DEMO_STEPS[idx - 1].number < currentStep || isCurrent)
              ? SUCCESS_COLOR
              : BORDER_COLOR

          const dotBlock = (
            <span className="flex flex-col items-center gap-1.5">
              <Dot
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                layerColor={layerColor}
              />
              <span
                className="font-mono text-[9.5px] tracking-[0.15em] uppercase"
                style={{
                  color: isCurrent
                    ? layerColor
                    : isCompleted
                      ? SUCCESS_COLOR
                      : '#5E5E68',
                }}
              >
                {s.number.toString().padStart(2, '0')}
              </span>
              <span
                className="font-mono text-[9.5px] font-medium tracking-[0.14em] uppercase"
                style={{
                  color: isCurrent
                    ? layerColor
                    : isCompleted
                      ? '#9F9FA9'
                      : '#5E5E68',
                }}
              >
                {s.shortLabel}
              </span>
            </span>
          )

          return (
            <div key={s.number} className="flex items-start">
              {idx > 0 && (
                <span
                  aria-hidden
                  className="mx-0 mt-[10px] block h-px w-8 flex-shrink-0 md:w-14 lg:w-16"
                  style={{ background: lineColor }}
                />
              )}
              {isClickable && onJump ? (
                <button
                  type="button"
                  onClick={() => onJump(s.number)}
                  className="group block focus:outline-none"
                  aria-label={`Step ${s.number}: ${s.shortLabel}`}
                >
                  {dotBlock}
                </button>
              ) : s.route ? (
                <Link
                  href={s.route}
                  aria-label={`Step ${s.number}: ${s.shortLabel}`}
                  className={`group block focus:outline-none ${
                    isClickable ? '' : 'pointer-events-none'
                  }`}
                >
                  {dotBlock}
                </Link>
              ) : (
                <span aria-label={`Step ${s.number}: ${s.shortLabel}`}>
                  {dotBlock}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
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
    const CURRENT_DOT = '#38E709' // altr-lime — matches LIVE agent dot
    return (
      <span className="relative flex h-5 w-5 items-center justify-center">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
          style={{ background: CURRENT_DOT }}
        />
        <span
          className="demo-dot-glow relative inline-flex h-5 w-5 rounded-full"
          style={{
            background: CURRENT_DOT,
            boxShadow: `0 0 0 4px ${CURRENT_DOT}33`,
          }}
        />
      </span>
    )
  }
  return (
    <span
      className="block h-4 w-4 rounded-full border"
      style={{ borderColor: BORDER_COLOR }}
    />
  )
}
