export type StageProfile = {
  stageName: string
  stageType: string
  subCategory: string
  city: string
  country: string
  anchorIP: string
  audienceSize: string
  audienceProfile: string[]
  geographicMix: string
  formatsOffered: string[]
  rsEligible: string
  targetSponsorVerticals: string[]
  targetSponsorOrigin: string[]
  budgetTier: string
  partnershipTypes: string[]
  nextEdition: string
  windowDuration: string
  prevOverseasBrands: string
  notes: string
}

export type StageScreening = {
  positioning: string
  audience_strength: string
  category_whitespace: string
  sponsor_recommendations: {
    vertical: string
    rationale: string
    estimated_demand: 'low' | 'medium' | 'high' | 'top-tier'
  }[]
  pricing_benchmark: {
    booth_low: number
    booth_high: number
    pop_up_low: number
    pop_up_high: number
    title_low: number
    title_high: number
    currency: string
  }
  risk_flags: string[]
  altr_edge: string
}

export type StageScreeningResponse = {
  screening: StageScreening
  source: 'api' | 'fallback'
}

export const DEFAULT_STAGE: StageProfile = {
  stageName: 'Marina Crescent Atrium',
  stageType: 'Mall activation',
  subCategory: 'Premium retail · luxury wing',
  city: 'Dubai',
  country: 'United Arab Emirates',
  anchorIP:
    'Dubai\'s only mall with a 6-month curated K-pop programming residency (2024 pilot). 18-34 female audience skews high-income with confirmed K-content affinity.',
  audienceSize: '500K – 5M',
  audienceProfile: ['Mid-tier', 'High-net-worth', 'Trade buyers'],
  geographicMix: 'UAE 55% · GCC 28% · KR/JP/CN visitors 12% · Other 5%',
  formatsOffered: ['Booth', 'Pop-up', 'Branded zone'],
  rsEligible: 'Yes — POS integration available',
  targetSponsorVerticals: ['Beauty', 'F&B', 'Fashion'],
  targetSponsorOrigin: ['K-content', 'Japan'],
  budgetTier: '$50K – $500K',
  partnershipTypes: ['Sponsor', 'Content partner'],
  nextEdition: 'Q4 2026',
  windowDuration: '6-month residency available',
  prevOverseasBrands: '1-2 K-brands (pop-up)',
  notes: '',
}

const STORAGE_KEY = 'altr_stage_state_v1'

type StoredStageState = {
  stage: StageProfile
  screening: StageScreening | null
  submittedAt: string | null
}

const defaultStored = (): StoredStageState => ({
  stage: DEFAULT_STAGE,
  screening: null,
  submittedAt: null,
})

export function loadStageState(): StoredStageState {
  if (typeof window === 'undefined') return defaultStored()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultStored()
    const parsed = JSON.parse(raw) as Partial<StoredStageState>
    return {
      stage: { ...DEFAULT_STAGE, ...(parsed.stage ?? {}) },
      screening: parsed.screening ?? null,
      submittedAt: parsed.submittedAt ?? null,
    }
  } catch {
    return defaultStored()
  }
}

export function saveStageState(state: StoredStageState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

export function patchStageState(patch: Partial<StoredStageState>): StoredStageState {
  const next = { ...loadStageState(), ...patch }
  saveStageState(next)
  return next
}
