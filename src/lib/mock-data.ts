import type {
  Benchmark,
  Brand,
  ConversationCollected,
  Contract,
  Deal,
  Insight,
  Match,
  Region,
  RightHolder,
  Settlement,
  Vertical,
} from '@/types'

const rhImg = (seed: string) =>
  `https://picsum.photos/seed/${seed}/1200/800`

const brandLogo = (seed: string) =>
  `https://picsum.photos/seed/${seed}/400/400`

const mockRightHolders: RightHolder[] = [
  {
    id: 'rh_marina_crescent',
    slug: 'marina-crescent-atrium',
    name: 'Marina Crescent Atrium',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'GCC',
    type: 'mall-activation',
    anchorIP: 'Marina district anchor — 1.4M monthly mall footfall',
    audienceSize: 1_400_000,
    audienceProfile: 'GCC luxury / mid-luxury · 60% female · ages 25-44',
    verticals: ['beauty', 'F&B', 'lifestyle'],
    heroImage: rhImg('marina-crescent'),
    availableSlots: [
      {
        id: 'sl_marina_jun',
        startDate: '2026-06-12',
        endDate: '2026-07-10',
        format: 'pop-up',
        baseRate: 85_000,
        rsAvailable: true,
      },
      {
        id: 'sl_marina_sep',
        startDate: '2026-09-04',
        endDate: '2026-10-02',
        format: 'booth',
        baseRate: 42_000,
        rsAvailable: true,
      },
    ],
  },
  {
    id: 'rh_hanok_pavilion',
    slug: 'hanok-sound-pavilion',
    name: 'Hanok Sound Pavilion',
    city: 'Seoul',
    country: 'South Korea',
    region: 'APAC',
    type: 'live-event',
    anchorIP: 'Bukchon heritage program · curated music nights',
    audienceSize: 95_000,
    audienceProfile: 'KR culture / global expat · ages 22-38 · 55% female',
    verticals: ['IP', 'entertainment', 'beauty'],
    heroImage: rhImg('hanok-pavilion'),
    availableSlots: [
      {
        id: 'sl_hanok_jul',
        startDate: '2026-07-18',
        endDate: '2026-07-26',
        format: 'concert-tier',
        baseRate: 28_000,
        rsAvailable: false,
      },
    ],
  },
  {
    id: 'rh_sentosa_cove',
    slug: 'sentosa-cove-festival-grounds',
    name: 'Sentosa Cove Festival Grounds',
    city: 'Singapore',
    country: 'Singapore',
    region: 'APAC',
    type: 'live-event',
    anchorIP: 'Anchor festival lineup + waterfront permit',
    audienceSize: 320_000,
    audienceProfile: 'SEA + GCC tourist mix · ages 21-40 · 50/50',
    verticals: ['F&B', 'lifestyle', 'fashion'],
    heroImage: rhImg('sentosa-cove'),
    availableSlots: [
      {
        id: 'sl_sentosa_aug',
        startDate: '2026-08-08',
        endDate: '2026-08-14',
        format: 'main-stage',
        baseRate: 180_000,
        rsAvailable: true,
      },
      {
        id: 'sl_sentosa_aug_booth',
        startDate: '2026-08-08',
        endDate: '2026-08-14',
        format: 'booth',
        baseRate: 38_000,
        rsAvailable: true,
      },
    ],
  },
  {
    id: 'rh_alula_stage',
    slug: 'alula-open-stage',
    name: 'AlUla Open Stage',
    city: 'AlUla',
    country: 'Saudi Arabia',
    region: 'GCC',
    type: 'live-event',
    anchorIP: 'AlUla cultural calendar · sandstone canyon arena',
    audienceSize: 180_000,
    audienceProfile: 'GCC premium + global IP tourism · ages 28-55',
    verticals: ['IP', 'entertainment', 'lifestyle'],
    heroImage: rhImg('alula-stage'),
    availableSlots: [
      {
        id: 'sl_alula_nov',
        startDate: '2026-11-14',
        endDate: '2026-11-15',
        format: 'main-stage',
        baseRate: 320_000,
        rsAvailable: false,
      },
    ],
  },
  {
    id: 'rh_atlantis_reef',
    slug: 'atlantis-reef-lounge',
    name: 'Atlantis Reef Lounge',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'GCC',
    type: 'hospitality-popup',
    anchorIP: 'Atlantis Palm hotel guest base · curated brand residencies',
    audienceSize: 210_000,
    audienceProfile: 'GCC + EU luxury tourist · ages 30-55 · 60% female',
    verticals: ['beauty', 'fashion', 'lifestyle'],
    heroImage: rhImg('atlantis-reef'),
    availableSlots: [
      {
        id: 'sl_atlantis_oct',
        startDate: '2026-10-01',
        endDate: '2026-10-31',
        format: 'pop-up',
        baseRate: 95_000,
        rsAvailable: true,
      },
    ],
  },
  {
    id: 'rh_bangkok_riverside',
    slug: 'bangkok-riverside-plaza',
    name: 'Bangkok Riverside Mall Plaza',
    city: 'Bangkok',
    country: 'Thailand',
    region: 'APAC',
    type: 'mall-activation',
    anchorIP: 'River-front mall · K-content programming partner',
    audienceSize: 880_000,
    audienceProfile: 'TH + SEA tourists · K-content affinity · ages 18-34',
    verticals: ['F&B', 'beauty', 'fashion'],
    heroImage: rhImg('bangkok-riverside'),
    availableSlots: [
      {
        id: 'sl_bangkok_jul',
        startDate: '2026-07-04',
        endDate: '2026-08-04',
        format: 'pop-up',
        baseRate: 36_000,
        rsAvailable: true,
      },
    ],
  },
]

const mockBrands: Brand[] = [
  {
    id: 'b_lumi_beauty',
    slug: 'lumi-beauty-lab',
    name: 'Lumi Beauty Lab',
    origin: 'Seoul, KR',
    brandType: 'content-partner',
    vertical: 'beauty',
    targetRegions: ['APAC', 'GCC'],
    budgetUSD: { min: 50_000, max: 200_000 },
    monthlyReach: 2_300_000,
    pitch: 'K-beauty glass-skin routine engineered for desert + tropical climates.',
    logo: brandLogo('lumi-beauty'),
  },
  {
    id: 'b_hansik_table',
    slug: 'hansik-table',
    name: 'Hansik Table',
    origin: 'Seoul, KR',
    brandType: 'content-partner',
    vertical: 'F&B',
    targetRegions: ['APAC', 'GCC', 'EU'],
    budgetUSD: { min: 200_000, max: 500_000 },
    monthlyReach: 1_100_000,
    pitch: 'Modern Korean dining concept built for international pop-up residencies.',
    logo: brandLogo('hansik-table'),
  },
  {
    id: 'b_studio_neon',
    slug: 'studio-neon',
    name: 'Studio NEON',
    origin: 'Seoul, KR',
    brandType: 'sponsor',
    vertical: 'IP',
    targetRegions: ['APAC', 'GCC'],
    budgetUSD: { min: 500_000, max: 1_500_000 },
    monthlyReach: 4_600_000,
    pitch: 'Webtoon + animation IP with concert-format live rights across three flagship titles.',
    logo: brandLogo('studio-neon'),
  },
  {
    id: 'b_onyx_street',
    slug: 'onyx-streetwear',
    name: 'Onyx Streetwear',
    origin: 'Busan, KR',
    brandType: 'content-partner',
    vertical: 'fashion',
    targetRegions: ['APAC', 'EU', 'NA'],
    budgetUSD: { min: 50_000, max: 200_000 },
    monthlyReach: 890_000,
    pitch: 'Limited-drop streetwear label with a venue-native retail model.',
    logo: brandLogo('onyx-streetwear'),
  },
  {
    id: 'b_sori_audio',
    slug: 'sori-audio',
    name: 'Sori Audio',
    origin: 'Seoul, KR',
    brandType: 'sponsor',
    vertical: 'entertainment',
    targetRegions: ['APAC', 'GCC'],
    budgetUSD: { min: 200_000, max: 500_000 },
    monthlyReach: 1_500_000,
    pitch: 'Premium personal audio brand seeking concert-tier live integrations.',
    logo: brandLogo('sori-audio'),
  },
]

const mockMatches: Match[] = [
  {
    id: 'm_lumi_marina',
    brandId: 'b_lumi_beauty',
    rightHolderId: 'rh_marina_crescent',
    fitScore: 92,
    reasoning: [
      'Vertical fit — Marina Atrium has run 4 beauty pop-ups in last 12 months',
      'Audience overlap — GCC female 25-44 maps directly to Lumi target',
      'Budget alignment — Lumi $50-200k covers the $85k pop-up slot',
      'Climate proof — Lumi formulation already tuned for desert exposure',
    ],
    predictedROI: {
      revenueLowUSD: 220_000,
      revenueHighUSD: 380_000,
      conversionRate: 0.043,
      reachQuality: 'top-tier',
    },
    budgetSimulation: {
      capitalUpfrontUSD: 85_000,
      rsRatio: 0.18,
      breakEvenAttendance: 42_000,
    },
  },
  {
    id: 'm_lumi_atlantis',
    brandId: 'b_lumi_beauty',
    rightHolderId: 'rh_atlantis_reef',
    fitScore: 84,
    reasoning: [
      'Vertical fit — beauty residencies a quarterly fixture at Atlantis',
      'Audience overlap — GCC + EU luxury female 30+ premium tier',
      'Budget headroom — $95k slot at upper end of Lumi range',
    ],
    predictedROI: {
      revenueLowUSD: 180_000,
      revenueHighUSD: 310_000,
      conversionRate: 0.038,
      reachQuality: 'high',
    },
    budgetSimulation: {
      capitalUpfrontUSD: 95_000,
      rsRatio: 0.2,
      breakEvenAttendance: 38_000,
    },
  },
  {
    id: 'm_hansik_sentosa',
    brandId: 'b_hansik_table',
    rightHolderId: 'rh_sentosa_cove',
    fitScore: 89,
    reasoning: [
      'Vertical fit — F&B residencies cleared by Sentosa permit office',
      'Audience overlap — SEA + GCC tourist mix matches Hansik target regions',
      'Format match — main-stage adjacent F&B village allows 6-day residency',
    ],
    predictedROI: {
      revenueLowUSD: 320_000,
      revenueHighUSD: 540_000,
      conversionRate: 0.055,
      reachQuality: 'high',
    },
    budgetSimulation: {
      capitalUpfrontUSD: 180_000,
      rsRatio: 0.22,
      breakEvenAttendance: 58_000,
    },
  },
  {
    id: 'm_neon_alula',
    brandId: 'b_studio_neon',
    rightHolderId: 'rh_alula_stage',
    fitScore: 95,
    reasoning: [
      'Vertical fit — AlUla seeking flagship IP-led concert programming',
      'Audience overlap — GCC premium + global IP tourism aligns with Studio NEON fandom',
      'IP rights — Studio NEON holds clean live rights for three flagship titles',
      'Budget alignment — $320k base rate within Studio NEON sponsor band',
    ],
    predictedROI: {
      revenueLowUSD: 1_200_000,
      revenueHighUSD: 2_400_000,
      conversionRate: 0.071,
      reachQuality: 'top-tier',
    },
    budgetSimulation: {
      capitalUpfrontUSD: 320_000,
      rsRatio: 0.0,
      breakEvenAttendance: 18_000,
    },
  },
]

const mockContracts: Contract[] = [
  {
    id: 'c_lumi_marina',
    dealId: 'd_lumi_marina',
    matchId: 'm_lumi_marina',
    rsRatio: 0.18,
    capitalUpfrontUSD: 85_000,
    totalValueUSD: 124_000,
    startDate: '2026-06-12',
    endDate: '2026-07-10',
    executionScope:
      'Atrium pop-up · sampling station · beauty consultation booth · 2 in-venue activation evenings',
    milestones: [
      {
        id: 'ms_lumi_deposit',
        label: 'Pre-event deposit',
        triggerCondition: 'Contract signed',
        amountUSD: 25_500,
        daysOffsetFromStart: -30,
      },
      {
        id: 'ms_lumi_open',
        label: 'Event-day launch',
        triggerCondition: 'Pop-up open confirmation',
        amountUSD: 59_500,
        daysOffsetFromStart: 0,
      },
      {
        id: 'ms_lumi_rs',
        label: 'Post-event RS settlement',
        triggerCondition: 'POS API close-out',
        amountUSD: 39_000,
        daysOffsetFromStart: 35,
      },
    ],
  },
]

const mockSettlements: Settlement[] = [
  {
    id: 's_lumi_deposit',
    contractMilestoneId: 'ms_lumi_deposit',
    xrplTxHash: 'A7C9D2E1F4B6883C5D9E2A1F7B8C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C',
    amountFrom: { value: 33_575_000, currency: 'KRW' },
    amountTo: { value: 93_700, currency: 'AED' },
    settledAt: '2026-05-13T09:14:22Z',
    status: 'settled',
    feePercent: 0.008,
  },
  {
    id: 's_lumi_open',
    contractMilestoneId: 'ms_lumi_open',
    xrplTxHash: 'B8D0E3F2A5C7994D6E0F3B2A8C9D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D',
    amountFrom: { value: 78_341_500, currency: 'KRW' },
    amountTo: { value: 218_565, currency: 'AED' },
    settledAt: '2026-06-12T14:32:08Z',
    status: 'settled',
    feePercent: 0.007,
  },
]

const mockBenchmarks: Benchmark[] = [
  {
    vertical: 'beauty',
    region: 'GCC',
    rightHolderType: 'mall-activation',
    avgConversionRate: 0.041,
    avgARPUUSD: 87,
    sampleSize: 14,
    lastUpdated: '2026-05-01',
  },
  {
    vertical: 'F&B',
    region: 'APAC',
    rightHolderType: 'live-event',
    avgConversionRate: 0.052,
    avgARPUUSD: 64,
    sampleSize: 9,
    lastUpdated: '2026-05-15',
  },
  {
    vertical: 'IP',
    region: 'GCC',
    rightHolderType: 'live-event',
    avgConversionRate: 0.068,
    avgARPUUSD: 142,
    sampleSize: 5,
    lastUpdated: '2026-04-20',
  },
]

const mockDeals: Deal[] = [
  {
    id: 'd_lumi_marina',
    brandId: 'b_lumi_beauty',
    rightHolderId: 'rh_marina_crescent',
    matchId: 'm_lumi_marina',
    contractId: 'c_lumi_marina',
    status: 'settling',
    currentStep: 5,
    createdAt: '2026-04-22T08:00:00Z',
    posDataAvailable: true,
  },
  {
    id: 'd_hansik_sentosa',
    brandId: 'b_hansik_table',
    rightHolderId: 'rh_sentosa_cove',
    matchId: 'm_hansik_sentosa',
    status: 'contract-drafting',
    currentStep: 3,
    createdAt: '2026-05-18T10:30:00Z',
    posDataAvailable: false,
  },
  {
    id: 'd_neon_alula',
    brandId: 'b_studio_neon',
    rightHolderId: 'rh_alula_stage',
    matchId: 'm_neon_alula',
    status: 'matching',
    currentStep: 2,
    createdAt: '2026-05-23T15:45:00Z',
    posDataAvailable: false,
  },
]

const mockInsights: Insight[] = [
  {
    id: 'i_gcc_2025',
    category: 'Market data',
    publishedAt: '2026-04-18',
    title: 'GCC sponsorship hits 6.88 billion in 2025',
    summary:
      'Saudi Arabia and the UAE drove twelve percent of new deal volume across music and sports.',
    href: '/insights',
  },
  {
    id: 'i_apac_gcc_pricing',
    category: 'Pricing',
    publishedAt: '2026-03-22',
    title: 'Festival pricing benchmarks across ASIA',
    summary:
      'Title sponsorships in Seoul run thirty percent below Dubai for the same audience size.',
    href: '/insights',
  },
  {
    id: 'i_ksa_frontier',
    category: 'Trends',
    publishedAt: '2026-02-09',
    title: 'Why Saudi Arabia is the next sponsorship frontier',
    summary:
      'Vision 2030 and a young population are pulling global brands into the kingdom.',
    href: '/insights',
  },
]

export async function getRightHolders(): Promise<RightHolder[]> {
  return mockRightHolders
}

export async function getInsights(): Promise<Insight[]> {
  return mockInsights
}

export async function getRightHolderBySlug(
  slug: string,
): Promise<RightHolder | null> {
  return mockRightHolders.find((rh) => rh.slug === slug) ?? null
}

export async function getBrands(): Promise<Brand[]> {
  return mockBrands
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  return mockBrands.find((b) => b.slug === slug) ?? null
}

export async function getMatches(): Promise<Match[]> {
  return mockMatches
}

export async function getContracts(): Promise<Contract[]> {
  return mockContracts
}

export async function getSettlements(): Promise<Settlement[]> {
  return mockSettlements
}

export async function getBenchmarks(): Promise<Benchmark[]> {
  return mockBenchmarks
}

export async function getDeals(): Promise<Deal[]> {
  return mockDeals
}

export async function narrowRightHolders(
  collected: ConversationCollected,
): Promise<{ rightHolders: RightHolder[]; matches: Match[] }> {
  const filtered = mockRightHolders.filter((rh) => {
    if (collected.vertical && !rh.verticals.includes(collected.vertical))
      return false
    if (collected.region && rh.region !== collected.region) return false
    if (
      collected.formatPreference &&
      collected.formatPreference !== 'open' &&
      !rhHasFormat(rh, collected.formatPreference)
    )
      return false
    if (collected.budgetCeilingUSD !== undefined) {
      const lowestSlot = Math.min(
        ...rh.availableSlots.map((s) => s.baseRate),
      )
      if (lowestSlot > collected.budgetCeilingUSD) return false
    }
    return true
  })

  const scored = filtered
    .map((rh) => ({
      rh,
      score: scoreFit(rh, collected),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ rh }) => rh)

  const matches = scored
    .map((rh) => mockMatches.find((m) => m.rightHolderId === rh.id))
    .filter((m): m is Match => Boolean(m))

  return { rightHolders: scored, matches }
}

function rhHasFormat(
  rh: RightHolder,
  preference: NonNullable<ConversationCollected['formatPreference']>,
): boolean {
  if (preference === 'open') return true
  if (preference === 'branded-zone') {
    return rh.availableSlots.some(
      (s) => s.format === 'concert-tier' || s.format === 'main-stage',
    )
  }
  return rh.availableSlots.some((s) => s.format === preference)
}

function scoreFit(
  rh: RightHolder,
  collected: ConversationCollected,
): number {
  let score = 50
  if (collected.vertical && rh.verticals.includes(collected.vertical))
    score += 20
  if (collected.region && rh.region === collected.region) score += 15
  if (
    collected.formatPreference &&
    collected.formatPreference !== 'open' &&
    rhHasFormat(rh, collected.formatPreference)
  )
    score += 8
  if (collected.budgetCeilingUSD !== undefined) {
    const lowestSlot = Math.min(...rh.availableSlots.map((s) => s.baseRate))
    if (lowestSlot <= collected.budgetCeilingUSD * 0.7) score += 10
  }
  if (collected.needsAnchorIP && rh.anchorIP.length > 0) score += 4
  return Math.min(99, score)
}

export type { Region, Vertical }
