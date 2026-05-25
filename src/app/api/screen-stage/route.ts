import { NextResponse } from 'next/server'
import { FALLBACK_SCREENING } from '@/lib/stage-fallback'
import type {
  StageProfile,
  StageScreening,
  StageScreeningResponse,
} from '@/lib/stage-state'

const SYSTEM_PROMPT = `You are the screening intelligence engine for altr — a sponsorship infrastructure platform that matches Live IP (events, venues, festivals, mall activations across APAC and GCC) with K-content brands and other vertical sponsors.

A Live IP rights holder is submitting their stage profile for screening. Your job is to:
1. Read the submitted signals carefully
2. Position the stage in the cross-border sponsorship market
3. Identify audience strength + category whitespace
4. Recommend 2-3 sponsor verticals that fit, with reasoning
5. Provide rough pricing benchmarks (USD)
6. Surface 1-3 risk flags
7. State why altr's settlement layer specifically helps this stage

You must respond in valid JSON only. No preamble, no markdown.

Respond with this exact JSON structure:
{
  "positioning": "1 sentence — how this stage sits in the cross-border sponsorship market",
  "audience_strength": "2-3 sentence analysis of audience signal vs comparable stages",
  "category_whitespace": "2-3 sentence analysis of which brand categories are under-indexed for this audience",
  "sponsor_recommendations": [
    {
      "vertical": "specific vertical (e.g., 'K-beauty acne/barrier')",
      "rationale": "1-2 sentences on why this vertical fits",
      "estimated_demand": "low | medium | high | top-tier"
    }
  ],
  "pricing_benchmark": {
    "booth_low": 18000,
    "booth_high": 32000,
    "pop_up_low": 52000,
    "pop_up_high": 95000,
    "title_low": 240000,
    "title_high": 420000,
    "currency": "USD"
  },
  "risk_flags": ["1-3 specific risks for this stage's positioning"],
  "altr_edge": "1 sentence — why this stage specifically benefits from altr's RS-on-XRPL settlement rail"
}

estimated_demand must be one of: low, medium, high, top-tier.
Return 2-3 sponsor_recommendations, ordered by estimated_demand (top-tier first).`

const buildUserPrompt = (s: StageProfile): string =>
  `Screen this Live IP for cross-border sponsor matching:

Stage name: ${s.stageName}
Type: ${s.stageType} — ${s.subCategory}
Location: ${s.city}, ${s.country}
Anchor IP / uniqueness: ${s.anchorIP}

Audience:
- Size per edition: ${s.audienceSize}
- Profile: ${s.audienceProfile.join(', ')}
- Geographic mix: ${s.geographicMix}

Sponsorship offering:
- Formats: ${s.formatsOffered.join(', ')}
- RS eligibility: ${s.rsEligible}
- Next window: ${s.nextEdition} (${s.windowDuration})

Target sponsors:
- Verticals: ${s.targetSponsorVerticals.join(', ')}
- Origin: ${s.targetSponsorOrigin.join(', ')}
- Budget tier: ${s.budgetTier}
- Partnership types: ${s.partnershipTypes.join(', ')}

Operational:
- Prior overseas-brand experience: ${s.prevOverseasBrands}
- Notes: ${s.notes || '(none)'}

Tailor recommendations to the stated target verticals (${s.targetSponsorVerticals.join(', ') || 'open'}) and origin (${s.targetSponsorOrigin.join(', ') || 'open'}). Anchor pricing to comparable stages in the region.`

const isValidScreening = (x: unknown): x is StageScreening => {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.positioning === 'string' &&
    typeof o.audience_strength === 'string' &&
    typeof o.category_whitespace === 'string' &&
    Array.isArray(o.sponsor_recommendations) &&
    typeof o.pricing_benchmark === 'object' &&
    Array.isArray(o.risk_flags) &&
    typeof o.altr_edge === 'string'
  )
}

export async function POST(
  request: Request,
): Promise<NextResponse<StageScreeningResponse>> {
  let stage: StageProfile
  try {
    stage = (await request.json()) as StageProfile
  } catch {
    return NextResponse.json(
      { screening: FALLBACK_SCREENING, source: 'fallback' },
      { status: 200 },
    )
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { screening: FALLBACK_SCREENING, source: 'fallback' },
      { status: 200 },
    )
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildUserPrompt(stage) }],
      }),
    })

    if (!res.ok) {
      return NextResponse.json(
        { screening: FALLBACK_SCREENING, source: 'fallback' },
        { status: 200 },
      )
    }

    const data = (await res.json()) as { content?: { text?: string }[] }
    const text = data?.content?.[0]?.text?.trim()
    if (!text) {
      return NextResponse.json(
        { screening: FALLBACK_SCREENING, source: 'fallback' },
        { status: 200 },
      )
    }

    let parsed: unknown
    try {
      const start = text.indexOf('{')
      const end = text.lastIndexOf('}')
      const slice = start >= 0 ? text.slice(start, end + 1) : text
      parsed = JSON.parse(slice)
    } catch {
      return NextResponse.json(
        { screening: FALLBACK_SCREENING, source: 'fallback' },
        { status: 200 },
      )
    }

    if (!isValidScreening(parsed)) {
      return NextResponse.json(
        { screening: FALLBACK_SCREENING, source: 'fallback' },
        { status: 200 },
      )
    }

    return NextResponse.json(
      { screening: parsed, source: 'api' },
      { status: 200 },
    )
  } catch {
    return NextResponse.json(
      { screening: FALLBACK_SCREENING, source: 'fallback' },
      { status: 200 },
    )
  }
}
