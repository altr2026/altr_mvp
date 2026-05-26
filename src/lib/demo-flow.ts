export type DemoLayer = 'intelligence' | 'contract' | 'settlement' | 'loop'

export type DemoStep = {
  number: number
  route: string
  label: string
  shortLabel: string
  layer: DemoLayer
  body: string
}

export const DEMO_STEPS: DemoStep[] = [
  {
    number: 1,
    route: '/brief',
    label: 'Brand brief',
    shortLabel: 'Brief',
    layer: 'intelligence',
    body: 'Brand brief captured — vertical, target market, budget ceiling, format preference, anchor needs. ALTR Intelligence indexes this against the live cohort of Live IP.',
  },
  {
    number: 2,
    route: '/match',
    label: 'Stage matches + Golden match',
    shortLabel: 'Match',
    layer: 'intelligence',
    body: 'Top 3 Live IP matches surfaced — ranked by fit (vertical, audience, budget, format, anchor IP). Mutual confirm locks the Golden Match and triggers contract auto-draft.',
  },
  {
    number: 3,
    route: '/contract',
    label: 'Deal terms',
    shortLabel: 'Terms',
    layer: 'contract',
    body: 'Contract auto-drafts: capital upfront, RS%, milestone schedule, activation window, KPIs. Both sides review and sign on-chain.',
  },
  {
    number: 4,
    route: '/live',
    label: 'Deal LIVE',
    shortLabel: 'LIVE',
    layer: 'settlement',
    body: 'Activation window open. POS API streaming sales in real time. Auto-split routes 15% RS to Brand and 85% retained by LIVE IP — per transaction, on-chain.',
  },
  {
    number: 5,
    route: '/rail',
    label: 'Settlement',
    shortLabel: 'Settle',
    layer: 'settlement',
    body: 'Revenue share + full settlement process. 3-second milestone settlements clear via USDC rail. Both sides watch funds land in real time, with on-chain receipts.',
  },
  {
    number: 6,
    route: '/report',
    label: 'ROI report',
    shortLabel: 'Report',
    layer: 'loop',
    body: 'Final ROI: revenue band, conversion rate, ARPU, attribution. Benchmark accumulated into the network — next match is more accurate for both sides.',
  },
]

export const LAYER_COLOR: Record<DemoLayer, string> = {
  intelligence: '#5DCAA5',
  contract: '#A8E6CF',
  settlement: '#EF9F27',
  loop: '#5DCAA5',
}

export const LAYER_LABEL: Record<DemoLayer, string> = {
  intelligence: 'Intelligence',
  contract: 'Contract',
  settlement: 'Settlement',
  loop: 'Loop',
}

export const SUCCESS_COLOR = '#4ADE80'
export const BORDER_COLOR = '#2A2A3A'
export const PENDING_COLOR = '#F87171'

export const DEMO_BRAND = 'COSRX'
export const DEMO_BRAND_SUB = 'K-beauty'

export const stepFromPath = (pathname: string): DemoStep | null =>
  DEMO_STEPS.find((s) => s.route === pathname) ?? null

export const isStepRoute = (pathname: string): boolean =>
  DEMO_STEPS.some((s) => s.route === pathname)

export const stepByNumber = (n: number): DemoStep | undefined =>
  DEMO_STEPS.find((s) => s.number === n)

export const showDealTracker = (currentStepNumber: number): boolean =>
  currentStepNumber >= 3
