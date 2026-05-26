'use client'

import { useRouter } from 'next/navigation'
import { useDemoState } from '@/components/providers/DemoStateProvider'
import { FALLBACK_MATCHES } from '@/lib/match-fallback'
import {
  DEFAULT_BRAND,
  type BrandProfile,
  type MatchResult,
} from '@/lib/demo-state'

// Map LIVE IP slugs onto MATCH_META keys. Anything unmapped falls back
// to the most-marquee match so the demo always has something to show.
const SLUG_TO_MATCH_ID: Record<string, MatchResult['id']> = {
  'frieze-abu-dhabi': 'frieze',
  'frieze-abu-dhabi-inaugural': 'frieze',
  'dubai-shopping-festival': 'dsf',
  'dsf-2026': 'dsf',
  'art-dubai': 'art-dubai',
  'art-dubai-2026': 'art-dubai',
}

function briefLooksUncustomized(brand: BrandProfile): boolean {
  // If every key field still matches DEFAULT_BRAND, treat the brief as
  // never having been touched. Send the user through /brief so the
  // agent can catch up the missing details.
  return (
    brand.brandName === DEFAULT_BRAND.brandName &&
    brand.vertical === DEFAULT_BRAND.vertical &&
    brand.targetMarket === DEFAULT_BRAND.targetMarket &&
    brand.budgetRange === DEFAULT_BRAND.budgetRange
  )
}

type Props = {
  slug: string
}

export function MakeOfferButton({ slug }: Props) {
  const router = useRouter()
  const { state, setMatches, selectMatch } = useDemoState()

  const handleClick = () => {
    const matchId = SLUG_TO_MATCH_ID[slug] ?? 'frieze'
    setMatches(FALLBACK_MATCHES)
    selectMatch(matchId)

    if (briefLooksUncustomized(state.brand)) {
      // Cue the FloatingChatWidget concierge to catch up the brief.
      try {
        window.dispatchEvent(
          new CustomEvent('altr:askAgent', {
            detail: {
              intent: 'brief-catch-up',
              message:
                "Quick brief — I just need a few details about your brand before locking the Golden Match. Let's run through what I'm missing.",
            },
          }),
        )
      } catch {
        /* SSR safety */
      }
      router.push('/brief')
      return
    }

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
