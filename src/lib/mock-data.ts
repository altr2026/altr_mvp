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

const rhImg = (tags: string, seed: string) =>
  `https://loremflickr.com/1200/800/${tags}?lock=${seed}`

const brandLogo = (seed: string) =>
  `https://picsum.photos/seed/${seed}/400/400`

const mockRightHolders: RightHolder[] = [
  {
    id: 'rh_gitex_2026',
    slug: 'gitex-global-2026',
    name: 'GITEX Global 2026',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'GCC',
    type: 'live-event',
    anchorIP:
      "World's largest tech & AI show · 6,800 exhibitors · 180 countries · first Dubai Exhibition Centre edition",
    audienceSize: 200_000,
    audienceProfile:
      'C-suite buyers, founders, investors · Dec 7–11, 2026 · Dubai Exhibition Centre',
    verticals: ['IP'],
    heroImage: rhImg('technology,conference,expo', 'gitex-2026'),
    availableSlots: [
      {
        id: 'sl_gitex_booth',
        startDate: '2026-12-07',
        endDate: '2026-12-11',
        format: 'booth',
        baseRate: 65_000,
        rsAvailable: false,
      },
      {
        id: 'sl_gitex_pavilion',
        startDate: '2026-12-07',
        endDate: '2026-12-11',
        format: 'main-stage',
        baseRate: 320_000,
        rsAvailable: false,
      },
    ],
  },
  {
    id: 'rh_f1_abu_dhabi',
    slug: 'f1-abu-dhabi-2026',
    name: 'F1 Abu Dhabi Grand Prix 2026',
    city: 'Abu Dhabi',
    country: 'United Arab Emirates',
    region: 'GCC',
    type: 'live-event',
    anchorIP:
      'F1 season finale · Yas Marina Circuit · 16/360 new hospitality packages · global broadcast',
    audienceSize: 60_000,
    audienceProfile:
      'High-net-worth, VIP, lifestyle premium · Dec 4–6, 2026 · Yas Marina',
    verticals: ['lifestyle', 'entertainment'],
    heroImage: rhImg('formula1,racing,grandprix', 'f1-abudhabi-2026'),
    availableSlots: [
      {
        id: 'sl_f1_hospitality',
        startDate: '2026-12-04',
        endDate: '2026-12-06',
        format: 'pop-up',
        baseRate: 180_000,
        rsAvailable: false,
      },
      {
        id: 'sl_f1_concert',
        startDate: '2026-12-04',
        endDate: '2026-12-06',
        format: 'main-stage',
        baseRate: 850_000,
        rsAvailable: false,
      },
    ],
  },
  {
    id: 'rh_frieze_abu_dhabi',
    slug: 'frieze-abu-dhabi-2026',
    name: 'Frieze Abu Dhabi (Inaugural)',
    city: 'Abu Dhabi',
    country: 'United Arab Emirates',
    region: 'GCC',
    type: 'live-event',
    anchorIP:
      'Frieze global network MENA debut · Deutsche Bank lead partner · Manarat Al Saadiyat',
    audienceSize: 35_000,
    audienceProfile:
      'Luxury collectors, global galleries, cultural institutions · Nov 19–22, 2026',
    verticals: ['lifestyle', 'fashion'],
    heroImage: rhImg('artfair,gallery,contemporaryart', 'frieze-abudhabi'),
    availableSlots: [
      {
        id: 'sl_frieze_booth',
        startDate: '2026-11-19',
        endDate: '2026-11-22',
        format: 'booth',
        baseRate: 42_000,
        rsAvailable: false,
      },
      {
        id: 'sl_frieze_zone',
        startDate: '2026-11-19',
        endDate: '2026-11-22',
        format: 'concert-tier',
        baseRate: 220_000,
        rsAvailable: false,
      },
    ],
  },
  {
    id: 'rh_art_dubai_2026',
    slug: 'art-dubai-2026',
    name: 'Art Dubai 2026 (20th Anniversary)',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'GCC',
    type: 'live-event',
    anchorIP:
      '20th anniversary · 130 galleries · 35 countries · Global Art Forum 20th edition',
    audienceSize: 30_000,
    audienceProfile:
      'Art collectors, cultural institutions, luxury brands · May 15–17, 2026 · Madinat Jumeirah',
    verticals: ['lifestyle', 'fashion'],
    heroImage: rhImg('artgallery,sculpture,exhibition', 'art-dubai-20'),
    availableSlots: [
      {
        id: 'sl_artdubai_booth',
        startDate: '2026-05-15',
        endDate: '2026-05-17',
        format: 'booth',
        baseRate: 38_000,
        rsAvailable: false,
      },
      {
        id: 'sl_artdubai_zone',
        startDate: '2026-05-15',
        endDate: '2026-05-17',
        format: 'concert-tier',
        baseRate: 180_000,
        rsAvailable: false,
      },
    ],
  },
  {
    id: 'rh_dsf',
    slug: 'dubai-shopping-festival-2026',
    name: 'Dubai Shopping Festival (DSF)',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'GCC',
    type: 'mall-activation',
    anchorIP:
      "Dubai's largest shopping + entertainment festival · 3.5M annual visitors · citywide · concerts + fireworks",
    audienceSize: 3_500_000,
    audienceProfile:
      'Consumer mass-market + GCC tourists · Dec 2026 – Jan 2027 · citywide',
    verticals: ['beauty', 'F&B', 'fashion', 'lifestyle'],
    heroImage: rhImg('shopping,festival,night', 'dsf-2026'),
    availableSlots: [
      {
        id: 'sl_dsf_booth',
        startDate: '2026-12-15',
        endDate: '2027-01-29',
        format: 'booth',
        baseRate: 25_000,
        rsAvailable: true,
      },
      {
        id: 'sl_dsf_popup',
        startDate: '2026-12-15',
        endDate: '2027-01-29',
        format: 'pop-up',
        baseRate: 95_000,
        rsAvailable: true,
      },
      {
        id: 'sl_dsf_title',
        startDate: '2026-12-15',
        endDate: '2027-01-29',
        format: 'main-stage',
        baseRate: 850_000,
        rsAvailable: false,
      },
    ],
  },
  {
    id: 'rh_global_village',
    slug: 'global-village-season-31',
    name: 'Global Village Season 31',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'GCC',
    type: 'mall-activation',
    anchorIP:
      'Multicultural pavilions + live entertainment · 6-month season · top-visited Dubai attraction',
    audienceSize: 7_000_000,
    audienceProfile:
      'Family + multicultural tourists · Oct 2026 – Apr 2027 · season-long',
    verticals: ['F&B', 'lifestyle', 'entertainment'],
    heroImage: rhImg('festival,fireworks,pavilion', 'global-village-31'),
    availableSlots: [
      {
        id: 'sl_gv_popup_1mo',
        startDate: '2026-11-01',
        endDate: '2026-12-01',
        format: 'pop-up',
        baseRate: 48_000,
        rsAvailable: true,
      },
      {
        id: 'sl_gv_zone_season',
        startDate: '2026-10-15',
        endDate: '2027-04-15',
        format: 'concert-tier',
        baseRate: 240_000,
        rsAvailable: true,
      },
    ],
  },
  {
    id: 'rh_dubai_world_cup',
    slug: 'dubai-world-cup-2026',
    name: 'Dubai World Cup 2026',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'GCC',
    type: 'live-event',
    anchorIP:
      "World's richest horse race · World Athletics Platinum Label · Meydan Racecourse · high-fashion + luxury crossover",
    audienceSize: 60_000,
    audienceProfile:
      'High-net-worth, luxury fashion crossover · March 28, 2026 (annual) · Meydan',
    verticals: ['fashion', 'lifestyle', 'entertainment'],
    heroImage: rhImg('horseracing,racetrack,jockey', 'dubai-world-cup-2026'),
    availableSlots: [
      {
        id: 'sl_dwc_vipbox',
        startDate: '2026-03-28',
        endDate: '2026-03-28',
        format: 'pop-up',
        baseRate: 42_000,
        rsAvailable: false,
      },
      {
        id: 'sl_dwc_racesponsor',
        startDate: '2026-03-28',
        endDate: '2026-03-28',
        format: 'main-stage',
        baseRate: 720_000,
        rsAvailable: false,
      },
    ],
  },
  {
    id: 'rh_leap_2026',
    slug: 'leap-2026',
    name: 'LEAP 2026',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    region: 'GCC',
    type: 'live-event',
    anchorIP:
      "Saudi Arabia's largest tech conference · $42B+ accumulated investment · AI / cloud / digital infra focus",
    audienceSize: 200_000,
    audienceProfile:
      'Startups, investors, gov officials · Aug 31 – Sep 3, 2026 · Riyadh Exhibition Centre',
    verticals: ['IP'],
    heroImage: rhImg('conference,audience,stage', 'leap-2026'),
    availableSlots: [
      {
        id: 'sl_leap_booth',
        startDate: '2026-08-31',
        endDate: '2026-09-03',
        format: 'booth',
        baseRate: 55_000,
        rsAvailable: false,
      },
      {
        id: 'sl_leap_pavilion',
        startDate: '2026-08-31',
        endDate: '2026-09-03',
        format: 'main-stage',
        baseRate: 380_000,
        rsAvailable: false,
      },
    ],
  },
  {
    id: 'rh_ataya',
    slug: 'ataya-exhibition-2026',
    name: 'Ataya Exhibition (15th Edition)',
    city: 'Abu Dhabi',
    country: 'United Arab Emirates',
    region: 'GCC',
    type: 'live-event',
    anchorIP:
      'Emirates Red Crescent flagship · Sheikha Shamsa patronage · proceeds to humanitarian causes · 15 years',
    audienceSize: 25_000,
    audienceProfile:
      'UAE royal family + women-led consumers · Jan 12–17, 2026 · ADNEC Marina Hall',
    verticals: ['beauty', 'fashion', 'lifestyle'],
    heroImage: rhImg('luxury,jewelry,exhibition', 'ataya-2026'),
    availableSlots: [
      {
        id: 'sl_ataya_booth',
        startDate: '2026-01-12',
        endDate: '2026-01-17',
        format: 'booth',
        baseRate: 18_000,
        rsAvailable: true,
      },
      {
        id: 'sl_ataya_popup',
        startDate: '2026-01-12',
        endDate: '2026-01-17',
        format: 'pop-up',
        baseRate: 52_000,
        rsAvailable: true,
      },
    ],
  },
  {
    id: 'rh_sharjah_triennial',
    slug: 'sharjah-architecture-triennial-2026',
    name: 'Sharjah Architecture Triennial (3rd Edition)',
    city: 'Sharjah',
    country: 'United Arab Emirates',
    region: 'GCC',
    type: 'live-event',
    anchorIP:
      "Theme: 'Architecture Otherwise — Building Civic Infrastructure for the Future' · historic + contemporary venues across Sharjah",
    audienceSize: 18_000,
    audienceProfile:
      'Architects, designers, cultural institutions, sustainability brands · Nov 2026 – Mar 2027',
    verticals: ['lifestyle', 'fashion'],
    heroImage: rhImg('architecture,modernbuilding,facade', 'sharjah-triennial-3'),
    availableSlots: [
      {
        id: 'sl_sharjah_booth',
        startDate: '2026-11-01',
        endDate: '2027-03-01',
        format: 'booth',
        baseRate: 22_000,
        rsAvailable: false,
      },
      {
        id: 'sl_sharjah_zone',
        startDate: '2026-11-01',
        endDate: '2027-03-01',
        format: 'concert-tier',
        baseRate: 90_000,
        rsAvailable: false,
      },
    ],
  },
  {
    id: 'rh_emirates_litfest',
    slug: 'emirates-literature-festival-2026',
    name: 'Emirates Literature Festival 2026',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'GCC',
    type: 'live-event',
    anchorIP:
      "Middle East's largest literary festival · Mohammed Bin Rashid Library · opinion-leader audience",
    audienceSize: 40_000,
    audienceProfile:
      'Highly educated, high-income opinion leaders · Jan 21–27, 2026',
    verticals: ['IP', 'lifestyle'],
    heroImage: rhImg('books,library,literature', 'emirates-litfest-2026'),
    availableSlots: [
      {
        id: 'sl_litfest_booth',
        startDate: '2026-01-21',
        endDate: '2026-01-27',
        format: 'booth',
        baseRate: 15_000,
        rsAvailable: false,
      },
      {
        id: 'sl_litfest_zone',
        startDate: '2026-01-21',
        endDate: '2026-01-27',
        format: 'concert-tier',
        baseRate: 48_000,
        rsAvailable: false,
      },
    ],
  },
  {
    id: 'rh_whx_2026',
    slug: 'world-health-expo-2026',
    name: 'World Health Expo (WHX) 2026',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'GCC',
    type: 'live-event',
    anchorIP:
      'Rebrand of Arab Health · global healthcare buyers + innovators · WHX Labs co-located (Feb 10–13)',
    audienceSize: 110_000,
    audienceProfile:
      'Healthcare execs, B2B buyers, MedTech innovators · Feb 9–12, 2026 · Dubai Exhibition Centre',
    verticals: ['lifestyle'],
    heroImage: rhImg('healthcare,medical,laboratory', 'whx-2026'),
    availableSlots: [
      {
        id: 'sl_whx_booth',
        startDate: '2026-02-09',
        endDate: '2026-02-12',
        format: 'booth',
        baseRate: 32_000,
        rsAvailable: false,
      },
      {
        id: 'sl_whx_pavilion',
        startDate: '2026-02-09',
        endDate: '2026-02-12',
        format: 'main-stage',
        baseRate: 280_000,
        rsAvailable: false,
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
    id: 'm_lumi_dsf',
    brandId: 'b_lumi_beauty',
    rightHolderId: 'rh_dsf',
    fitScore: 93,
    reasoning: [
      'Vertical fit — DSF runs a dedicated beauty + lifestyle zone every season',
      'Audience overlap — 3.5M visitors, strong GCC female 18-44 consumer base',
      'Budget alignment — Lumi $50-200k covers the $95k pop-up slot with headroom',
      'Climate proof — Lumi formulation already tuned for desert exposure',
    ],
    predictedROI: {
      revenueLowUSD: 280_000,
      revenueHighUSD: 510_000,
      conversionRate: 0.041,
      reachQuality: 'top-tier',
    },
    budgetSimulation: {
      capitalUpfrontUSD: 95_000,
      rsRatio: 0.18,
      breakEvenAttendance: 52_000,
    },
  },
  {
    id: 'm_lumi_ataya',
    brandId: 'b_lumi_beauty',
    rightHolderId: 'rh_ataya',
    fitScore: 87,
    reasoning: [
      'Vertical fit — Ataya curates women-led beauty + lifestyle brands',
      'Audience overlap — UAE royal family + high-net-worth women consumers',
      'Mission halo — Emirates Red Crescent CSR brand alignment',
      'Entry cost — $18k booth makes it a low-risk market beachhead',
    ],
    predictedROI: {
      revenueLowUSD: 110_000,
      revenueHighUSD: 220_000,
      conversionRate: 0.058,
      reachQuality: 'high',
    },
    budgetSimulation: {
      capitalUpfrontUSD: 52_000,
      rsRatio: 0.15,
      breakEvenAttendance: 6_400,
    },
  },
  {
    id: 'm_hansik_global_village',
    brandId: 'b_hansik_table',
    rightHolderId: 'rh_global_village',
    fitScore: 91,
    reasoning: [
      'Vertical fit — Global Village hosts country-led F&B pavilions year-round',
      'Audience overlap — 7M season visitors, multicultural + family-led F&B spend',
      'Format match — branded zone supports 6-month residency without permit overhead',
      'K-content tailwind — KR pavilion programming gaining repeat sponsorship interest',
    ],
    predictedROI: {
      revenueLowUSD: 480_000,
      revenueHighUSD: 920_000,
      conversionRate: 0.062,
      reachQuality: 'top-tier',
    },
    budgetSimulation: {
      capitalUpfrontUSD: 240_000,
      rsRatio: 0.22,
      breakEvenAttendance: 78_000,
    },
  },
  {
    id: 'm_neon_leap',
    brandId: 'b_studio_neon',
    rightHolderId: 'rh_leap_2026',
    fitScore: 92,
    reasoning: [
      "Vertical fit — LEAP's entertainment-tech track features animation + IP showcases",
      'Audience overlap — Saudi gaming + youth market aligns with NEON fandom',
      'IP rights — NEON holds clean live + AR rights for three flagship titles',
      'Sovereign tailwind — Vision 2030 entertainment investment is actively sourcing K-IP',
    ],
    predictedROI: {
      revenueLowUSD: 850_000,
      revenueHighUSD: 1_900_000,
      conversionRate: 0.058,
      reachQuality: 'top-tier',
    },
    budgetSimulation: {
      capitalUpfrontUSD: 380_000,
      rsRatio: 0.0,
      breakEvenAttendance: 22_000,
    },
  },
  {
    id: 'm_onyx_art_dubai',
    brandId: 'b_onyx_street',
    rightHolderId: 'rh_art_dubai_2026',
    fitScore: 84,
    reasoning: [
      'Vertical fit — Art Dubai 20th anniversary leans on streetwear / luxury crossover',
      'Audience overlap — Collectors + creative directors with discretionary spend',
      'Drop strategy — limited-run releases dovetail with fair-window FOMO',
      'Budget alignment — $38k booth fits Onyx $50-200k range',
    ],
    predictedROI: {
      revenueLowUSD: 95_000,
      revenueHighUSD: 180_000,
      conversionRate: 0.047,
      reachQuality: 'high',
    },
    budgetSimulation: {
      capitalUpfrontUSD: 38_000,
      rsRatio: 0.18,
      breakEvenAttendance: 4_800,
    },
  },
  {
    id: 'm_sori_f1',
    brandId: 'b_sori_audio',
    rightHolderId: 'rh_f1_abu_dhabi',
    fitScore: 88,
    reasoning: [
      'Vertical fit — F1 finale concert track is a flagship audio activation moment',
      'Audience overlap — VIP + lifestyle premium aligns with Sori positioning',
      'Format match — pop-up hospitality suite + branded listening lounge',
      'Budget alignment — $180k pop-up fits Sori $200-500k band with comfortable headroom',
    ],
    predictedROI: {
      revenueLowUSD: 320_000,
      revenueHighUSD: 640_000,
      conversionRate: 0.052,
      reachQuality: 'top-tier',
    },
    budgetSimulation: {
      capitalUpfrontUSD: 180_000,
      rsRatio: 0.0,
      breakEvenAttendance: 12_000,
    },
  },
]

const mockContracts: Contract[] = [
  {
    id: 'c_lumi_dsf',
    dealId: 'd_lumi_dsf',
    matchId: 'm_lumi_dsf',
    rsRatio: 0.18,
    capitalUpfrontUSD: 95_000,
    totalValueUSD: 168_000,
    startDate: '2026-12-15',
    endDate: '2027-01-29',
    executionScope:
      'DSF beauty zone pop-up · sampling + consultation booth · 3 in-festival activation evenings',
    milestones: [
      {
        id: 'ms_lumi_deposit',
        label: 'Pre-event deposit',
        triggerCondition: 'Contract signed',
        amountUSD: 28_500,
        daysOffsetFromStart: -30,
      },
      {
        id: 'ms_lumi_open',
        label: 'Event-day launch',
        triggerCondition: 'Pop-up open confirmation',
        amountUSD: 66_500,
        daysOffsetFromStart: 0,
      },
      {
        id: 'ms_lumi_rs',
        label: 'Post-event RS settlement',
        triggerCondition: 'POS API close-out',
        amountUSD: 73_000,
        daysOffsetFromStart: 50,
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
    id: 'd_lumi_dsf',
    brandId: 'b_lumi_beauty',
    rightHolderId: 'rh_dsf',
    matchId: 'm_lumi_dsf',
    contractId: 'c_lumi_dsf',
    status: 'settling',
    currentStep: 5,
    createdAt: '2026-10-22T08:00:00Z',
    posDataAvailable: true,
  },
  {
    id: 'd_hansik_global_village',
    brandId: 'b_hansik_table',
    rightHolderId: 'rh_global_village',
    matchId: 'm_hansik_global_village',
    status: 'contract-drafting',
    currentStep: 3,
    createdAt: '2026-05-18T10:30:00Z',
    posDataAvailable: false,
  },
  {
    id: 'd_neon_leap',
    brandId: 'b_studio_neon',
    rightHolderId: 'rh_leap_2026',
    matchId: 'm_neon_leap',
    status: 'matching',
    currentStep: 2,
    createdAt: '2026-05-23T15:45:00Z',
    posDataAvailable: false,
  },
]

const mockInsights: Insight[] = [
  {
    id: 'i_we_started_here',
    category: "Founder's Note",
    publishedAt: '2026-05-25',
    title: 'We started here',
    summary:
      "Dubai's F1 hospitality suites hold some of the highest-spending K-content fans on earth. None of them are wearing a Korean brand — not because the demand isn't real, but because nobody built the rail.",
    href: '/insights/we-started-here',
  },
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
