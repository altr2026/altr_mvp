'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  BORDER_COLOR,
  DEMO_BRAND,
  DEMO_BRAND_SUB,
  DEMO_STEPS,
  LAYER_COLOR,
  LAYER_LABEL,
  SUCCESS_COLOR,
} from '@/lib/demo-flow'

type Props = {
  slug: string
  ipName: string
  ipShort: string
  ipCity: string
  ipCountry: string
}

export function DealPreview({
  slug,
  ipName,
  ipShort,
  ipCity,
  ipCountry,
}: Props) {
  const [currentStep, setCurrentStep] = useState(4)
  const step = DEMO_STEPS[currentStep - 1]
  const color = LAYER_COLOR[step.layer]
  const layerLabel = LAYER_LABEL[step.layer]

  const goPrev = () => setCurrentStep((s) => Math.max(4, s - 1))
  const goNext = () => setCurrentStep((s) => Math.min(8, s + 1))

  const atStart = currentStep === 4
  const atEnd = currentStep === 8

  return (
    <section className="px-6 pt-8 pb-16 md:px-8 md:pt-12 md:pb-24">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/live-ip/${slug}`}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.22em] text-altr-text-3 uppercase transition hover:text-altr-mint-bright"
        >
          ← Back to {ipShort}
        </Link>

        <div className="mt-6 rounded-2xl border border-white/[0.06] bg-altr-card px-6 py-5 md:px-8 md:py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5 md:gap-3">
                <span className="text-[15px] font-semibold text-altr-white md:text-[17px]">
                  {DEMO_BRAND}
                </span>
                <span className="text-altr-text-3" aria-hidden>
                  ×
                </span>
                <span className="text-[15px] font-semibold text-altr-white md:text-[17px]">
                  <span className="md:hidden">{ipShort}</span>
                  <span className="hidden md:inline">{ipName}</span>
                </span>
              </div>
              <div className="hidden items-center gap-3 font-mono text-[10.5px] tracking-[0.15em] text-altr-text-3 uppercase md:flex">
                <span>{DEMO_BRAND_SUB}</span>
                <span aria-hidden>·</span>
                <span>
                  {ipCity}, {ipCountry}
                </span>
              </div>
            </div>

            <DotTrail
              currentStep={currentStep}
              onJump={(n) => setCurrentStep(n)}
            />
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/[0.06] bg-altr-card p-7 md:p-10">
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[44px] leading-none font-bold opacity-30 md:text-[64px]"
              style={{ color }}
            >
              {currentStep.toString().padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-1">
              <span
                className="font-mono text-[10px] tracking-[0.22em] uppercase"
                style={{ color }}
              >
                Step {currentStep} · {layerLabel}
              </span>
              <h2 className="text-[22px] font-bold text-altr-white md:text-[26px]">
                {step.label}
              </h2>
            </div>
          </div>

          <p className="mt-7 max-w-3xl text-[15px] leading-[1.65] text-altr-text-2 md:text-[16px]">
            {step.body}
          </p>

          {currentStep === 5 && (
            <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
              {['Escrow', 'Conditions', 'POS', 'FX'].map((rail) => (
                <span
                  key={rail}
                  className="flex items-center justify-between rounded-lg border px-3 py-2.5 font-mono text-[12px] uppercase"
                  style={{
                    borderColor: `${color}40`,
                    background: `${color}10`,
                    color,
                  }}
                >
                  {rail}
                  <span>✓</span>
                </span>
              ))}
            </div>
          )}

          {currentStep === 7 && (
            <div
              className="mt-6 rounded-lg border px-4 py-3 font-mono text-[12px]"
              style={{
                borderColor: `${color}40`,
                background: `${color}10`,
                color,
              }}
            >
              tx_a7c9d2e1f4b6883c5d9e2a1f7b8c3d4e5f6a · 95,000 USD → 348,535 AED ·
              2.8s · settled
            </div>
          )}

          {currentStep === 8 && (
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: 'Revenue band', value: '$280K–510K' },
                { label: 'Conversion', value: '4.1%' },
                { label: 'ARPU', value: '$87' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-1 rounded-lg border border-white/[0.06] bg-altr-bg/40 px-3 py-3"
                >
                  <span className="font-mono text-[9px] tracking-[0.2em] text-altr-text-3 uppercase">
                    {stat.label}
                  </span>
                  <span
                    className="font-mono text-[15px] font-bold md:text-[17px]"
                    style={{ color }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-6">
            <button
              type="button"
              onClick={goPrev}
              disabled={atStart}
              className="inline-flex items-center gap-2 rounded-lg border bg-transparent px-4 py-2 text-[13px] font-medium text-altr-text-2 transition hover:bg-altr-bg/60 disabled:cursor-not-allowed disabled:opacity-30"
              style={{ borderColor: BORDER_COLOR, borderWidth: '0.5px' }}
            >
              ← Back
            </button>
            {atEnd ? (
              <Link
                href="/live-ip"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-[13px] font-semibold text-altr-white transition"
                style={{ background: '#1D9E75' }}
              >
                Start another match →
              </Link>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-lg border bg-transparent px-5 py-2 text-[13px] font-medium text-altr-text transition hover:bg-altr-bg/60"
                style={{ borderColor: BORDER_COLOR, borderWidth: '0.5px' }}
              >
                Next →
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] tracking-[0.2em] text-altr-text-3 uppercase">
          Steps 1–3 are completed during discovery. Tracking starts at Step 4.
        </p>
      </div>
    </section>
  )
}

function DotTrail({
  currentStep,
  onJump,
}: {
  currentStep: number
  onJump: (n: number) => void
}) {
  return (
    <div className="-mx-2 flex items-start overflow-x-auto px-2 md:mx-0 md:px-0">
      <div className="flex items-start">
        {DEMO_STEPS.map((s, idx) => {
          const isCompleted = s.number < currentStep
          const isCurrent = s.number === currentStep
          const isClickable = s.number <= currentStep && s.number >= 4
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
                  className="mx-0 mt-[10px] block h-px w-5 flex-shrink-0 md:w-7"
                  style={{ background: lineColor }}
                />
              )}
              <button
                type="button"
                onClick={() => isClickable && onJump(s.number)}
                disabled={!isClickable}
                className="group flex flex-col items-center gap-1.5 focus:outline-none disabled:cursor-not-allowed"
                aria-label={`Step ${s.number}: ${s.shortLabel}`}
              >
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
                  {s.number.toString().padStart(2, '0')}
                </span>
              </button>
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
    return (
      <span
        className="relative inline-flex h-5 w-5 rounded-full"
        style={{
          background: layerColor,
          boxShadow: `0 0 0 4px ${layerColor}40`,
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
