'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Match, RightHolder } from '@/types'

const TYPE_LABEL: Record<RightHolder['type'], string> = {
  'live-event': 'Live Event',
  'mall-activation': 'Mall',
  'hospitality-popup': 'Hospitality',
}

const formatReach = (n: number): string => {
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return `${m >= 10 ? m.toFixed(0) : m.toFixed(1)}M`
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

const formatPrice = (n: number): string => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n}`
}

type Props = {
  rightHolders: RightHolder[]
  matches: Match[]
  compact?: boolean
}

export function ResultsList({ rightHolders, matches, compact = false }: Props) {
  const matchByRH = new Map(matches.map((m) => [m.rightHolderId, m]))

  if (compact) {
    return <CompactResults rightHolders={rightHolders} matchByRH={matchByRH} />
  }

  const top = rightHolders[0]
  const rest = rightHolders.slice(1)
  const topMatch = top ? (matchByRH.get(top.id) ?? null) : null

  return (
    <div className="flex flex-col gap-4 pt-2">
      {top && <TopMatchCard rightHolder={top} match={topMatch} />}

      {rest.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-text-3">
            Also worth a look
          </span>
          {rest.map((rh, idx) => {
            const m = matchByRH.get(rh.id) ?? null
            return (
              <CompactMatchRow
                key={rh.id}
                rightHolder={rh}
                match={m}
                index={idx + 2}
              />
            )
          })}
        </div>
      )}

      <NextStepsStrip />
    </div>
  )
}

function CompactResults({
  rightHolders,
  matchByRH,
}: {
  rightHolders: RightHolder[]
  matchByRH: Map<string, Match>
}) {
  const [expandedId, setExpandedId] = useState<string | null>(
    rightHolders[0]?.id ?? null,
  )

  return (
    <div className="flex flex-col gap-2 pt-2">
      {rightHolders.map((rh, idx) => {
        const m = matchByRH.get(rh.id) ?? null
        const isExpanded = expandedId === rh.id
        const isTop = idx === 0
        return (
          <ExpandableMatchRow
            key={rh.id}
            rightHolder={rh}
            match={m}
            index={idx + 1}
            isTop={isTop}
            expanded={isExpanded}
            onToggle={() => setExpandedId(isExpanded ? null : rh.id)}
          />
        )
      })}
      <NextStepsStrip />
    </div>
  )
}

function ExpandableMatchRow({
  rightHolder: rh,
  match,
  index,
  isTop,
  expanded,
  onToggle,
}: {
  rightHolder: RightHolder
  match: Match | null
  index: number
  isTop: boolean
  expanded: boolean
  onToggle: () => void
}) {
  const lowestSlot = rh.availableSlots.reduce((min, s) =>
    s.baseRate < min.baseRate ? s : min,
  )
  return (
    <article
      className={`overflow-hidden rounded-xl border transition ${
        isTop
          ? 'border-altr-mint-bright/30 bg-altr-mint/[0.04]'
          : 'border-white/[0.06] bg-altr-card/40'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center gap-3 p-3 text-left transition hover:bg-white/[0.03]"
      >
        <span className="font-mono text-[10px] tracking-[0.18em] text-altr-text-3 uppercase">
          {String(index).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-[14px] font-medium text-altr-white">
              {rh.name}
            </p>
            {isTop && (
              <span className="flex-shrink-0 rounded bg-altr-mint/[0.16] px-1.5 py-[1px] font-mono text-[9px] uppercase tracking-wider text-altr-mint-bright">
                top
              </span>
            )}
          </div>
          <p className="truncate text-[12px] text-altr-text-2">
            {rh.city} · {formatReach(rh.audienceSize)} reach · from{' '}
            {formatPrice(lowestSlot.baseRate)}
          </p>
        </div>
        {match && (
          <div className="flex flex-shrink-0 items-baseline gap-1">
            <span className="font-mono text-[9px] tracking-wider text-altr-text-3 uppercase">
              fit
            </span>
            <span className="font-mono text-[14px] font-semibold text-altr-mint-bright">
              {match.fitScore}
            </span>
          </div>
        )}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`text-altr-text-3 transition ${
            expanded ? 'rotate-180 text-altr-mint-bright' : ''
          }`}
          aria-hidden
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {expanded && (
        <div className="flex flex-col gap-3 border-t border-white/[0.06] p-3">
          <div className="flex gap-3">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={rh.heroImage}
                alt={rh.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-altr-bg/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-altr-white">
                  {TYPE_LABEL[rh.type]}
                </span>
                <span className="rounded bg-altr-bg/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-altr-mint-bright">
                  {rh.region}
                </span>
              </div>
              <p className="text-[12px] leading-[1.45] text-altr-text-2">
                {rh.audienceProfile}
              </p>
            </div>
          </div>

          {match && (
            <ul className="flex flex-col gap-1 text-[12px]">
              {match.reasoning.slice(0, 4).map((r) => (
                <li key={r} className="flex gap-2 text-altr-cream">
                  <span className="text-altr-mint-bright">→</span>
                  <span className="leading-[1.45]">{r}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.05] pt-2.5">
            <div className="font-mono text-[10px] tracking-wider text-altr-text-3 uppercase">
              {rh.availableSlots.length}{' '}
              {rh.availableSlots.length === 1 ? 'slot' : 'slots'} · from{' '}
              <span className="text-altr-lime">
                {formatPrice(lowestSlot.baseRate)}
              </span>
            </div>
            <button
              type="button"
              className="rounded border border-altr-mint-bright/30 bg-altr-mint/[0.08] px-2.5 py-1 text-[11px] font-medium text-altr-mint-bright transition hover:border-altr-mint-bright"
            >
              View Live IP →
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

function TopMatchCard({
  rightHolder: rh,
  match,
}: {
  rightHolder: RightHolder
  match: Match | null
}) {
  const lowestSlot = rh.availableSlots.reduce((min, s) =>
    s.baseRate < min.baseRate ? s : min,
  )
  return (
    <article className="overflow-hidden rounded-2xl border border-altr-mint-bright/30 bg-altr-mint/[0.03]">
      <div className="flex flex-col gap-0 md:flex-row">
        <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:w-[200px] md:flex-shrink-0">
          <Image
            src={rh.heroImage}
            alt={rh.name}
            fill
            sizes="(min-width: 768px) 200px, 100vw"
            className="object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="rounded bg-altr-bg/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-altr-white backdrop-blur">
              {TYPE_LABEL[rh.type]}
            </span>
            <span className="rounded bg-altr-bg/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-altr-mint-bright backdrop-blur">
              {rh.region}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mint-bright">
                Top match
              </div>
              <h3 className="mt-1 text-[18px] font-semibold leading-tight text-altr-white md:text-[20px]">
                {rh.name}
              </h3>
              <p className="mt-1 text-[13px] text-altr-text-2">
                {rh.city}, {rh.country} · {formatReach(rh.audienceSize)} reach
              </p>
            </div>
            {match && (
              <div className="flex flex-shrink-0 flex-col items-end">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-altr-text-3">
                  Fit
                </span>
                <span className="font-mono text-[22px] font-bold text-altr-mint-bright">
                  {match.fitScore}
                </span>
              </div>
            )}
          </div>

          <p className="text-[13px] leading-[1.55] text-altr-text-2">
            {rh.audienceProfile}
          </p>

          {match && (
            <ul className="flex flex-col gap-1.5 border-t border-white/[0.05] pt-3 text-[13px]">
              {match.reasoning.slice(0, 4).map((r) => (
                <li key={r} className="flex gap-2 text-altr-cream">
                  <span className="text-altr-mint-bright">→</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-1 flex flex-wrap items-end justify-between gap-3 border-t border-white/[0.05] pt-3">
            <div>
              <p className="font-mono text-[9px] tracking-wider text-altr-text-3 uppercase">
                From
              </p>
              <p className="font-mono text-[15px] text-altr-lime">
                {formatPrice(lowestSlot.baseRate)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg border border-altr-mint-bright/30 bg-altr-mint/[0.08] px-4 py-2 text-[12px] font-medium text-altr-mint-bright transition hover:border-altr-mint-bright hover:bg-altr-mint/[0.16]"
              >
                View Live IP →
              </button>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="cursor-not-allowed rounded-lg border border-white/[0.06] bg-altr-bg/40 px-4 py-2 text-[12px] font-medium text-altr-text-3"
              >
                Draft contract · v2
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function CompactMatchRow({
  rightHolder: rh,
  match,
  index,
}: {
  rightHolder: RightHolder
  match: Match | null
  index: number
}) {
  const lowestSlot = rh.availableSlots.reduce((min, s) =>
    s.baseRate < min.baseRate ? s : min,
  )
  return (
    <article className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-altr-card/40 p-3 transition hover:border-white/[0.12]">
      <span className="font-mono text-[10px] tracking-[0.18em] text-altr-text-3 uppercase">
        {String(index).padStart(2, '0')}
      </span>
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={rh.heroImage}
          alt={rh.name}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-[14px] font-medium text-altr-white">
          {rh.name}
        </p>
        <p className="truncate text-[12px] text-altr-text-2">
          {rh.city} · {formatReach(rh.audienceSize)} reach · from{' '}
          {formatPrice(lowestSlot.baseRate)}
        </p>
      </div>
      {match && (
        <div className="flex flex-shrink-0 items-baseline gap-1">
          <span className="font-mono text-[9px] tracking-wider text-altr-text-3 uppercase">
            fit
          </span>
          <span className="font-mono text-[14px] font-semibold text-altr-mint-bright">
            {match.fitScore}
          </span>
        </div>
      )}
    </article>
  )
}

function NextStepsStrip() {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.06] bg-altr-card/40 p-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mint-bright">
        Next
      </span>
      <span className="font-mono text-[10px] tracking-[0.16em] text-altr-text-3 uppercase">
        02 match → 03 contract → 04 execute → 05 settle [v2]
      </span>
    </div>
  )
}
