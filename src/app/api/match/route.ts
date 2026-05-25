import { NextResponse } from 'next/server'
import { FALLBACK_MATCHES } from '@/lib/match-fallback'
import type { BrandProfile, MatchResponse, MatchResult } from '@/lib/demo-state'

const SYSTEM_PROMPT = `You are the matching intelligence engine for altr, a sponsorship infrastructure platform connecting K-content brands with Live IP (events, venues, festivals) across APAC and GCC.

Your job is to analyze a K-brand's profile and explain why each of 3 pre-selected Live IP matches fits — and what ROI they can realistically expect.

You must respond in valid JSON only. No preamble, no markdown, no explanation outside the JSON.

The 3 Live IPs to analyze are always:
1. Frieze Abu Dhabi (Inaugural) — Art & Culture Festival, Abu Dhabi UAE, Q3 2026, 35K visitors, 68% female, median HHI $120K+, no K-beauty brand currently present
2. Dubai Shopping Festival (DSF) — Retail Festival, Dubai UAE, Q3 2026, 3.5M visitors, broad demographic, high K-beauty awareness already
3. Art Dubai 2026 — Art Fair, Dubai UAE, Q3 2026, 25K visitors, 60% female, median HHI $90K+, 1 K-beauty brand present

Respond with this exact JSON structure:
{
  "matches": [
    {
      "id": "frieze",
      "match_score": 94,
      "score_breakdown": {
        "audience_fit": 96,
        "budget_fit": 91,
        "vertical_demand": 95,
        "timing_fit": 93
      },
      "why_this_match": "2-3 sentence explanation of why this Live IP fits this specific brand's goals",
      "key_signals": ["signal 1", "signal 2", "signal 3"],
      "roi_prediction": {
        "foot_traffic_min": 4200,
        "foot_traffic_max": 5800,
        "projected_sales_min": 28000,
        "projected_sales_max": 41000,
        "rs_payout_min": 4200,
        "rs_payout_max": 6200,
        "rs_rate": 15,
        "benchmark_deals": 3
      },
      "risk_flags": ["risk 1 if any"],
      "altr_edge": "One sentence on why this deal specifically needs altr's cross-border RS settlement"
    }
  ]
}

ids must be one of: "frieze", "dsf", "art-dubai". Return all 3 matches, ranked by match_score descending.`

const buildUserPrompt = (b: BrandProfile): string =>
  `Analyze match quality for this K-brand:

Brand: ${b.brandName}
Vertical: ${b.vertical} — ${b.subCategory}
Current markets: ${b.currentMarkets.join(', ')}
Target market: ${b.targetMarket}
Activation goal: ${b.activationGoal}
Activation format: ${b.activationFormat}
Budget: ${b.budgetRange}
Timeline: ${b.timeline}
Overseas experience: ${b.overseasHistory}

Generate match analysis for all 3 Live IPs.
Tailor the "why_this_match" and "key_signals" specifically to this brand's stated goal (${b.activationGoal}) and overseas experience level (${b.overseasHistory}).`

const isValidMatch = (m: unknown): m is MatchResult => {
  if (!m || typeof m !== 'object') return false
  const obj = m as Record<string, unknown>
  const ok =
    (obj.id === 'frieze' || obj.id === 'dsf' || obj.id === 'art-dubai') &&
    typeof obj.match_score === 'number' &&
    typeof obj.why_this_match === 'string' &&
    Array.isArray(obj.key_signals) &&
    typeof obj.altr_edge === 'string' &&
    typeof obj.roi_prediction === 'object' &&
    typeof obj.score_breakdown === 'object'
  return ok
}

export async function POST(request: Request): Promise<NextResponse<MatchResponse>> {
  let brand: BrandProfile
  try {
    brand = (await request.json()) as BrandProfile
  } catch {
    return NextResponse.json(
      { matches: FALLBACK_MATCHES, source: 'fallback' },
      { status: 200 },
    )
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { matches: FALLBACK_MATCHES, source: 'fallback' },
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
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildUserPrompt(brand) }],
      }),
    })

    if (!res.ok) {
      return NextResponse.json(
        { matches: FALLBACK_MATCHES, source: 'fallback' },
        { status: 200 },
      )
    }

    const data = (await res.json()) as {
      content?: { text?: string }[]
    }
    const text = data?.content?.[0]?.text?.trim()
    if (!text) {
      return NextResponse.json(
        { matches: FALLBACK_MATCHES, source: 'fallback' },
        { status: 200 },
      )
    }

    let parsed: unknown
    try {
      const jsonStart = text.indexOf('{')
      const jsonEnd = text.lastIndexOf('}')
      const slice = jsonStart >= 0 ? text.slice(jsonStart, jsonEnd + 1) : text
      parsed = JSON.parse(slice)
    } catch {
      return NextResponse.json(
        { matches: FALLBACK_MATCHES, source: 'fallback' },
        { status: 200 },
      )
    }

    const matches = (parsed as { matches?: unknown[] })?.matches
    if (!Array.isArray(matches) || matches.length === 0 || !matches.every(isValidMatch)) {
      return NextResponse.json(
        { matches: FALLBACK_MATCHES, source: 'fallback' },
        { status: 200 },
      )
    }

    const sorted = [...(matches as MatchResult[])].sort(
      (a, b) => b.match_score - a.match_score,
    )

    return NextResponse.json({ matches: sorted, source: 'api' }, { status: 200 })
  } catch {
    return NextResponse.json(
      { matches: FALLBACK_MATCHES, source: 'fallback' },
      { status: 200 },
    )
  }
}
