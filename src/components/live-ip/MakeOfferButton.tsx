'use client'

import { useRouter } from 'next/navigation'
import { useDemoState } from '@/components/providers/DemoStateProvider'
import { FALLBACK_MATCHES } from '@/lib/match-fallback'
import {
  type MatchMeta,
  type MatchResult,
} from '@/lib/demo-state'
import type { RightHolder } from '@/types'

const MONTH_LABEL = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function formatTiming(rh: RightHolder): string {
  if (!rh.availableSlots.length) return 'Q4 2026'
  const earliest = [...rh.availableSlots].sort((a, b) =>
    a.startDate.localeCompare(b.startDate),
  )[0]
  const d = new Date(earliest.startDate)
  const month = MONTH_LABEL[d.getMonth()]
  return `${month} ${d.getFullYear()}`
}

function formatReach(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return `${m >= 10 ? m.toFixed(0) : m.toFixed(1)}M`
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

const CATEGORY_LABEL: Record<RightHolder['type'], string> = {
  'live-event': 'Live Event',
  'mall-activation': 'Mall Activation',
  'hospitality-popup': 'Hospitality Pop-up',
}

function synthesizeMeta(rh: RightHolder): MatchMeta {
  return {
    id: rh.slug,
    name: rh.name,
    shortName: rh.name.split(' ').slice(0, 3).join(' '),
    category: CATEGORY_LABEL[rh.type],
    location: `${rh.city}, ${rh.country}`,
    timing: formatTiming(rh),
    image: rh.heroImage,
    visitors: formatReach(rh.audienceSize),
    audienceProfile: rh.audienceProfile,
    pastDealsCount: 3,
    pastDealAvgROI: '3.2× revenue / 4.1% CVR',
  }
}

function synthesizeMatch(rh: RightHolder): MatchResult {
  // Pull demo numbers from FALLBACK_MATCHES[0] so the GoldenMatch view
  // has the same shape it always does, then attach a meta synthesized
  // from the chosen RightHolder so the page renders the correct IP.
  const template = FALLBACK_MATCHES[0]
  return {
    ...template,
    id: rh.slug,
    why_this_match: `${rh.name} offers a high-fit audience profile for cross-border brand activation. ${rh.audienceProfile}.`,
    key_signals: rh.audienceHighlights?.slice(0, 4) ?? template.key_signals,
    altr_edge: `ALTR clears the deal end-to-end — RS split, USDC rail, 3-second milestone settlement. No SWIFT delay between you and ${rh.name}.`,
    meta: synthesizeMeta(rh),
  }
}

type Props = {
  rightHolder: RightHolder
}

export function MakeOfferButton({ rightHolder }: Props) {
  const router = useRouter()
  const { setMatches, selectMatch } = useDemoState()

  const handleClick = () => {
    // Making an offer is a Brand-only action — pin the role so downstream
    // pages (/confirm, /contract) gate UI to the Brand side even if a
    // stale 'live-ip' value was left in localStorage from a prior session.
    try {
      window.localStorage.setItem('altr_demo_role', 'brand')
    } catch {
      /* ignore */
    }
    const synthesized = synthesizeMatch(rightHolder)
    // Inject the synthesized match into matches[] so selectMatch()
    // (which finds by id within state.matches) can resolve it.
    setMatches([synthesized])
    selectMatch(synthesized.id)
    router.push('/confirm')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex h-10 items-center justify-center rounded-lg border border-altr-mint-bright/30 bg-altr-mint/[0.08] px-3 text-[12.5px] font-semibold text-altr-mint-bright transition hover:border-altr-mint hover:bg-altr-mint/[0.18]"
    >
      Make an offer →
    </button>
  )
}
