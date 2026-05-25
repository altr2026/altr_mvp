import type { StageScreening } from './stage-state'

export const FALLBACK_SCREENING: StageScreening = {
  positioning:
    'A premium mall-anchored stage with proven K-content audience signal and POS-integrated activations — sits in the "easy-RS" sweet spot for first-overseas K-brands entering GCC.',
  audience_strength:
    'Mid-to-high-net-worth GCC consumer base with confirmed K-content affinity from your 2024 K-pop residency. The 18-34 female skew + RS POS visibility is the exact profile K-beauty and K-fashion brands convert against. Trade buyers and KR/JP visitor flow adds press + repeat-customer compounding.',
  category_whitespace:
    'K-beauty acne/barrier, K-streetwear drops, K-snacks ready-to-eat — all under-indexed in your wing right now. F&B partnerships have headroom for branded counters during festival windows.',
  sponsor_recommendations: [
    {
      vertical: 'K-beauty (acne/barrier · brightening)',
      rationale:
        '18-34 female + GCC HHI overlap is the highest-converting K-beauty segment globally. Your POS integration means RS deals settle on real revenue, not just sampling reach.',
      estimated_demand: 'top-tier',
    },
    {
      vertical: 'K-streetwear / contemporary fashion',
      rationale:
        'Limited-drop streetwear pairs naturally with mall pop-up format. Anniversary halo from K-pop residency drives FOMO-driven AOV.',
      estimated_demand: 'high',
    },
    {
      vertical: 'K-F&B (premium snacks · ready-to-drink)',
      rationale:
        'Branded counters during festival windows close the gap between brand awareness and trial. POS data feeds direct attribution for repeat-rate benchmarks.',
      estimated_demand: 'medium',
    },
  ],
  pricing_benchmark: {
    booth_low: 18000,
    booth_high: 32000,
    pop_up_low: 52000,
    pop_up_high: 95000,
    title_low: 240000,
    title_high: 420000,
    currency: 'USD',
  },
  risk_flags: [
    'No public K-beauty incumbents = clean slate, but also no priced benchmark — first deal will set anchor pricing.',
    '6-month residency commitment may exceed first-time-overseas brand risk tolerance; offer 1-month pop-up variant as on-ramp.',
  ],
  altr_edge:
    'A mall-anchored RS deal across K-brand × GCC needs POS-tied milestone settlement and cross-border FX (KRW ↔ AED). ALTR routes both through XRPL in seconds — no 30-90 day batched invoicing, no wire reconciliation.',
}

export const STAGE_LOADING_MESSAGES = [
  'Reading audience signal + POS history...',
  'Mapping K-content category whitespace...',
  'Benchmarking RS pricing vs comparable GCC stages...',
  'Surfacing sponsor verticals with proven demand...',
]
