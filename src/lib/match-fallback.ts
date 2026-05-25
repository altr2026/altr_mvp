import type { MatchResult } from './demo-state'

export const FALLBACK_MATCHES: MatchResult[] = [
  {
    id: 'frieze',
    match_score: 94,
    score_breakdown: {
      audience_fit: 96,
      budget_fit: 91,
      vertical_demand: 95,
      timing_fit: 93,
    },
    why_this_match:
      "Frieze Abu Dhabi's inaugural edition pulls female luxury collectors with median HHI $120K+ — exactly the high-intent, high-AOV audience your acne/barrier line converts on. As a first-overseas activation, you get a curated low-volume environment to validate real sales without competing against established K-beauty inventory.",
    key_signals: [
      'Zero K-beauty present — clean category whitespace at the inaugural edition',
      '68% female, median HHI $120K+ — matches Lumi conversion benchmarks in GCC',
      "Frieze's first MENA edition means premium press + collector previews",
    ],
    roi_prediction: {
      foot_traffic_min: 4200,
      foot_traffic_max: 5800,
      projected_sales_min: 28000,
      projected_sales_max: 41000,
      rs_payout_min: 4200,
      rs_payout_max: 6200,
      rs_rate: 15,
      benchmark_deals: 3,
    },
    altr_edge:
      'A first overseas RS deal needs same-day KRW↔AED settlement and on-chain milestone proof — exactly what ALTR routes across XRPL without a wire-transfer middleman.',
  },
  {
    id: 'art-dubai',
    match_score: 88,
    score_breakdown: {
      audience_fit: 90,
      budget_fit: 89,
      vertical_demand: 86,
      timing_fit: 87,
    },
    why_this_match:
      "Art Dubai's 20th-anniversary edition is the most-attended luxury cultural event in MENA — proven collector + creative-director audience. One K-beauty brand already runs here, which means category demand is validated but you'll need a sharper differentiation angle than at Frieze.",
    key_signals: [
      '60% female, median HHI $90K+ — adjacent to your core ICP',
      'Anniversary halo → press + repeat-collector traffic',
      'Competitive overlap: 1 K-beauty already present',
    ],
    roi_prediction: {
      foot_traffic_min: 3100,
      foot_traffic_max: 4300,
      projected_sales_min: 18000,
      projected_sales_max: 29000,
      rs_payout_min: 2700,
      rs_payout_max: 4400,
      rs_rate: 15,
      benchmark_deals: 2,
    },
    risk_flags: [
      'One incumbent K-beauty brand — clarify positioning vs. theirs in the brief',
    ],
    altr_edge:
      'Competitive overlap means you need post-event POS attribution to prove incremental sales — ALTR wires the POS API directly into the RS settlement.',
  },
  {
    id: 'dsf',
    match_score: 79,
    score_breakdown: {
      audience_fit: 82,
      budget_fit: 88,
      vertical_demand: 72,
      timing_fit: 76,
    },
    why_this_match:
      "DSF gives massive 3.5M-visitor reach across 6 weeks — but the broad demographic and high existing K-beauty awareness means lower conversion per visitor for a first-time overseas brand. Better as a Phase 2 activation after you've validated the AOV at a curated event first.",
    key_signals: [
      '3.5M visitors — broadest reach in GCC during Q3-Q4',
      'High K-beauty saturation — harder to differentiate without paid media',
      "$25K booth fits low end of your budget with RS upside",
    ],
    roi_prediction: {
      foot_traffic_min: 8500,
      foot_traffic_max: 14000,
      projected_sales_min: 22000,
      projected_sales_max: 38000,
      rs_payout_min: 3300,
      rs_payout_max: 5700,
      rs_rate: 15,
      benchmark_deals: 4,
    },
    risk_flags: [
      'High category saturation — strong creative + paid media required to break through',
      "First overseas activation — DSF's scale may dilute brand learnings",
    ],
    altr_edge:
      'Mass-traffic activations need real-time RS payouts on POS close-out — ALTR settles each mall-cluster milestone in seconds, not 30-90 day batched invoicing.',
  },
]

export const LOADING_MESSAGES = [
  'Analyzing K-beauty × GCC audience overlap...',
  'Checking RS deal precedents...',
  'Calculating Q3 2026 timing fit...',
  'Ranking by ROI potential...',
]
