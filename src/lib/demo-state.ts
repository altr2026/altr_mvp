export type BrandProfile = {
  brandName: string
  vertical: string
  subCategory: string
  currentMarkets: string[]
  targetMarket: string
  activationGoal: string
  activationFormat: string
  budgetRange: string
  timeline: string
  overseasHistory: string
}

export type MatchROI = {
  foot_traffic_min: number
  foot_traffic_max: number
  projected_sales_min: number
  projected_sales_max: number
  rs_payout_min: number
  rs_payout_max: number
  rs_rate: number
  benchmark_deals: number
}

export type MatchScoreBreakdown = {
  audience_fit: number
  budget_fit: number
  vertical_demand: number
  timing_fit: number
}

export type MatchResult = {
  id: 'frieze' | 'dsf' | 'art-dubai'
  match_score: number
  score_breakdown: MatchScoreBreakdown
  why_this_match: string
  key_signals: string[]
  roi_prediction: MatchROI
  risk_flags?: string[]
  altr_edge: string
}

export type MatchResponse = {
  matches: MatchResult[]
  source: 'api' | 'fallback'
}

export type MatchMeta = {
  id: MatchResult['id']
  name: string
  shortName: string
  category: string
  location: string
  timing: string
  image: string
  visitors: string
  audienceProfile: string
  pastDealsCount: number
  pastDealAvgROI: string
}

export const MATCH_META: Record<MatchResult['id'], MatchMeta> = {
  frieze: {
    id: 'frieze',
    name: 'Frieze Abu Dhabi (Inaugural)',
    shortName: 'Frieze Abu Dhabi',
    category: 'Art & Culture Festival',
    location: 'Abu Dhabi, UAE',
    timing: 'Q3 2026',
    image:
      'https://loremflickr.com/1200/800/artfair,gallery,contemporaryart?lock=frieze-abudhabi',
    visitors: '35K',
    audienceProfile: '68% female · HHI $120K+ · collectors + creative directors',
    pastDealsCount: 3,
    pastDealAvgROI: '4.6× revenue / 4.8% CVR',
  },
  dsf: {
    id: 'dsf',
    name: 'Dubai Shopping Festival (DSF)',
    shortName: 'Dubai Shopping Festival',
    category: 'Retail Festival',
    location: 'Dubai, UAE',
    timing: 'Q3 2026',
    image:
      'https://loremflickr.com/1200/800/shopping,festival,night?lock=dsf-2026',
    visitors: '3.5M',
    audienceProfile: 'Mass-market + GCC tourists · 70% female 25-44 ICP',
    pastDealsCount: 4,
    pastDealAvgROI: '2.8× revenue / 3.6% CVR',
  },
  'art-dubai': {
    id: 'art-dubai',
    name: 'Art Dubai 2026',
    shortName: 'Art Dubai',
    category: 'Art Fair',
    location: 'Dubai, UAE',
    timing: 'Q3 2026',
    image:
      'https://loremflickr.com/1200/800/artgallery,sculpture,exhibition?lock=art-dubai-20',
    visitors: '30K',
    audienceProfile: '60% female · HHI $90K+ · 130 galleries from 35 countries',
    pastDealsCount: 2,
    pastDealAvgROI: '3.4× revenue / 4.1% CVR',
  },
}

export const DEFAULT_BRAND: BrandProfile = {
  brandName: 'COSRX',
  vertical: 'Beauty / Skincare',
  subCategory: 'Skincare — Acne / Barrier',
  currentMarkets: ['Korea', 'Japan'],
  targetMarket: 'UAE / GCC',
  activationGoal: 'Real sales validation',
  activationFormat: 'Pop-up (Revenue Share)',
  budgetRange: '$10K – $50K',
  timeline: 'Q3 2026',
  overseasHistory: 'First time',
}

const STORAGE_KEY = 'altr_demo_state_v1'

type DemoState = {
  brand: BrandProfile
  selectedMatchId: MatchResult['id'] | null
  matches: MatchResult[] | null
  matchedAt: string | null
}

const defaultState = (): DemoState => ({
  brand: DEFAULT_BRAND,
  selectedMatchId: null,
  matches: null,
  matchedAt: null,
})

export function loadDemoState(): DemoState {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<DemoState>
    return {
      brand: { ...DEFAULT_BRAND, ...(parsed.brand ?? {}) },
      selectedMatchId: parsed.selectedMatchId ?? null,
      matches: parsed.matches ?? null,
      matchedAt: parsed.matchedAt ?? null,
    }
  } catch {
    return defaultState()
  }
}

export function saveDemoState(state: DemoState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* quota / private mode — ignore */
  }
}

export function patchDemoState(patch: Partial<DemoState>): DemoState {
  const next = { ...loadDemoState(), ...patch }
  saveDemoState(next)
  return next
}

export function resetDemoState(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function selectedMatch(state: DemoState): MatchResult | null {
  if (!state.matches || !state.selectedMatchId) return null
  return state.matches.find((m) => m.id === state.selectedMatchId) ?? null
}
