export type DemoLayer = 'intelligence' | 'contract' | 'settlement' | 'loop'

export type DemoStep = {
  number: number
  label: string
  shortLabel: string
  layer: DemoLayer
  body: string
}

export const DEMO_STEPS: DemoStep[] = [
  {
    number: 1,
    label: 'Brand profile',
    shortLabel: 'Profile',
    layer: 'intelligence',
    body: 'Brand brief captured — vertical, target market, budget ceiling, format preference, anchor needs. ALTR Intelligence indexes this against the live cohort of Live IP.',
  },
  {
    number: 2,
    label: 'Stage matches',
    shortLabel: 'Match',
    layer: 'intelligence',
    body: 'Top 3 Live IP matches surfaced — ranked by fit score (vertical, audience, budget, format, anchor IP). Each match shows predicted ROI band, RS-eligibility, and capital required.',
  },
  {
    number: 3,
    label: 'Golden match',
    shortLabel: 'Confirm',
    layer: 'intelligence',
    body: 'Mutual confirm complete. Brand and Live IP both opted in. Golden Match locked — this triggers contract auto-draft and the settlement layer.',
  },
  {
    number: 4,
    label: 'Deal terms',
    shortLabel: 'Terms',
    layer: 'contract',
    body: 'Contract auto-drafts: capital upfront, RS%, milestone schedule, activation window, KPIs. Both sides review and sign on-chain. No back-and-forth on PDFs.',
  },
  {
    number: 5,
    label: 'Rail config',
    shortLabel: 'Config',
    layer: 'settlement',
    body: 'Settlement layer auto-configures from contract milestones. Escrow funded · Conditions wired · POS API connected · FX rail (KRW ↔ local currency) primed.',
  },
  {
    number: 6,
    label: 'Deal live',
    shortLabel: 'Live',
    layer: 'settlement',
    body: 'Activation window open. ALTR watches POS + activation data feeds. Each milestone trigger fires an automated settlement event — no manual invoicing.',
  },
  {
    number: 7,
    label: 'Settlement',
    shortLabel: 'Settle',
    layer: 'settlement',
    body: '3-second milestone settlement. KRW → local currency over rail. On-chain receipt + tx hash. Both sides see funds clear in real time, not 30-90 days.',
  },
  {
    number: 8,
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

export const DEMO_BRAND = 'COSRX'
export const DEMO_BRAND_SUB = 'K-beauty'

export const stepByNumber = (n: number): DemoStep | undefined =>
  DEMO_STEPS.find((s) => s.number === n)
