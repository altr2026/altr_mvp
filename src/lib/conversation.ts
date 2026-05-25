import type {
  AgentTurnResponse,
  ConversationCollected,
  ConversationOption,
  ConversationState,
  ConversationStep,
  FormatPreference,
  Region,
  Vertical,
} from '@/types'
import { narrowRightHolders } from './mock-data'

const VERTICAL_OPTIONS: ConversationOption[] = [
  { id: 'v-fnb', label: 'F&B — restaurant, food, beverage', value: 'F&B' },
  { id: 'v-beauty', label: 'Beauty / skincare', value: 'beauty' },
  {
    id: 'v-fashion',
    label: 'Fashion / streetwear / lifestyle',
    value: 'fashion',
  },
  {
    id: 'v-ip',
    label: 'Entertainment / media / gaming IP',
    value: 'IP',
  },
  { id: 'v-lifestyle', label: 'Health & wellness', value: 'lifestyle' },
]

const REGION_OPTIONS: ConversationOption[] = [
  { id: 'r-gcc', label: 'UAE / Saudi Arabia / GCC', value: 'GCC' },
  { id: 'r-apac', label: 'APAC (Korea, Japan, SEA)', value: 'APAC' },
  { id: 'r-eu', label: 'Europe', value: 'EU' },
  { id: 'r-na', label: 'US', value: 'NA' },
]

const FORMAT_OPTIONS: ConversationOption[] = [
  { id: 'f-booth', label: 'Booth / sampling', value: 'booth' },
  { id: 'f-popup', label: 'Pop-up partnership (RS)', value: 'pop-up' },
  { id: 'f-branded', label: 'Branded zone', value: 'branded-zone' },
  { id: 'f-open', label: 'Open to all', value: 'open' },
]

const BUDGET_OPTIONS: ConversationOption[] = [
  { id: 'b-sub50', label: 'Under $50k', value: '50000' },
  { id: 'b-50to200', label: '$50k – $200k', value: '200000' },
  { id: 'b-200to500', label: '$200k – $500k', value: '500000' },
  { id: 'b-500plus', label: '$500k+', value: '1500000' },
]

const ANCHOR_OPTIONS: ConversationOption[] = [
  {
    id: 'a-anchor',
    label: 'Anchor IP / audience required',
    value: 'true',
  },
  {
    id: 'a-open',
    label: 'Open to newer stages too',
    value: 'false',
  },
]

const VERTICAL_VALUES = new Set<Vertical>([
  'beauty',
  'F&B',
  'fashion',
  'IP',
  'lifestyle',
  'entertainment',
])

const REGION_VALUES = new Set<Region>(['GCC', 'APAC', 'EU', 'NA'])

const FORMAT_VALUES = new Set<FormatPreference>([
  'booth',
  'pop-up',
  'branded-zone',
  'open',
])

export function createSessionId(): string {
  return `s_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`
}

export function initialState(sessionId: string): ConversationState {
  return {
    sessionId,
    step: 'intro',
    collected: {},
  }
}

async function tryLLMFallback(
  userInput: string,
  contextHint: string,
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || !userInput) return null
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 220,
        system: `You are ALTR's agent. ALTR is sponsorship infrastructure for K-content brands and Live IP (right holders) across Asia — search, match, settle, prove ROI from real revenue. Stay on-topic about ALTR, sponsorship deals, Live IP, brands, or related domain. Keep replies to 1–2 sentences, conversational, then nudge the user back to the on-screen options. Current step context: ${contextHint}.`,
        messages: [{ role: 'user', content: userInput }],
      }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      content?: { text?: string }[]
    }
    const reply = data?.content?.[0]?.text
    return typeof reply === 'string' ? reply.trim() : null
  } catch {
    return null
  }
}

export async function runAgentTurn(
  state: ConversationState,
  userInput: string,
): Promise<AgentTurnResponse> {
  const trimmed = userInput.trim()

  switch (state.step) {
    case 'intro':
      return {
        state: { ...state, step: 'vertical' },
        reply:
          "I'm ALTR. I'll narrow down the right stage for your brand in about a minute. First — what vertical are you in?",
        options: VERTICAL_OPTIONS,
        done: false,
      }

    case 'vertical': {
      const vertical = matchVertical(trimmed)
      if (!vertical) {
        const llm = await tryLLMFallback(
          trimmed,
          'Asking the user to pick their brand vertical (F&B, Beauty, Fashion, Entertainment IP, Health & wellness)',
        )
        return {
          state,
          reply: llm ?? 'Pick one of the verticals below to continue.',
          options: VERTICAL_OPTIONS,
          done: false,
        }
      }
      const collected: ConversationCollected = { ...state.collected, vertical }
      return {
        state: { ...state, step: 'region', collected },
        reply: `${verticalLabel(vertical)}. Which market are you targeting?`,
        options: REGION_OPTIONS,
        done: false,
      }
    }

    case 'region': {
      const region = matchRegion(trimmed)
      if (!region) {
        const llm = await tryLLMFallback(
          trimmed,
          'Asking the user which market they want to enter (GCC, APAC, Europe, US)',
        )
        return {
          state,
          reply: llm ?? 'Pick a region below.',
          options: REGION_OPTIONS,
          done: false,
        }
      }
      const collected: ConversationCollected = { ...state.collected, region }
      return {
        state: { ...state, step: 'format', collected },
        reply:
          "Got it. How do you want to show up on stage? All options are inside existing Live IP — not standalone stores.",
        options: FORMAT_OPTIONS,
        done: false,
      }
    }

    case 'format': {
      const formatPreference = matchFormat(trimmed)
      if (!formatPreference) {
        const llm = await tryLLMFallback(
          trimmed,
          'Asking the user how they want to show up on stage (Booth, Pop-up RS, Branded zone, Open to all)',
        )
        return {
          state,
          reply: llm ?? 'Pick a format below.',
          options: FORMAT_OPTIONS,
          done: false,
        }
      }
      const collected: ConversationCollected = {
        ...state.collected,
        formatPreference,
      }
      return {
        state: { ...state, step: 'budget', collected },
        reply: `${formatLabel(formatPreference)}. What budget ceiling are we working with for this activation?`,
        options: BUDGET_OPTIONS,
        done: false,
      }
    }

    case 'budget': {
      const ceiling = matchBudget(trimmed)
      if (ceiling === null) {
        const llm = await tryLLMFallback(
          trimmed,
          'Asking the user for their budget tier (<$50k, $50-200k, $200-500k, $500k+)',
        )
        return {
          state,
          reply: llm ?? 'Pick a budget tier below.',
          options: BUDGET_OPTIONS,
          done: false,
        }
      }
      const collected: ConversationCollected = {
        ...state.collected,
        budgetCeilingUSD: ceiling,
      }
      return {
        state: { ...state, step: 'anchor-need', collected },
        reply:
          'Last one — do you need a stage with an existing anchor IP or audience, or are you open to newer stages?',
        options: ANCHOR_OPTIONS,
        done: false,
      }
    }

    case 'anchor-need': {
      const needsAnchor = matchAnchor(trimmed)
      if (needsAnchor === null) {
        const llm = await tryLLMFallback(
          trimmed,
          'Asking the user whether they need a stage with anchor IP/audience or are open to newer stages',
        )
        return {
          state,
          reply: llm ?? 'Pick one of the two options.',
          options: ANCHOR_OPTIONS,
          done: false,
        }
      }
      const collected: ConversationCollected = {
        ...state.collected,
        needsAnchorIP: needsAnchor,
      }
      const nextState: ConversationState = {
        ...state,
        step: 'results',
        collected,
      }
      const narrowed = await narrowRightHolders(collected)
      return {
        state: nextState,
        reply: buildResultsReply(narrowed.rightHolders.length, collected),
        done: true,
        results: narrowed,
      }
    }

    case 'narrowing':
    case 'results': {
      if (!trimmed) {
        return {
          state,
          reply:
            "Concierge mode — ask about pricing, audience, formats, or any event you saw. ↻ resets the search.",
          done: true,
        }
      }
      const llm = await tryLLMFallback(
        trimmed,
        "Concierge mode after a brand has been matched with Live IP across ASIA. The user is reading event detail pages and asking follow-up questions about pricing, audience, sponsorship formats, RS terms, or specific events (GITEX, F1 Abu Dhabi, Frieze Abu Dhabi, Art Dubai, DSF, Global Village, Dubai World Cup, LEAP, Ataya, Sharjah Triennial, Emirates LitFest, WHX). Answer with concrete numbers when helpful.",
      )
      return {
        state,
        reply:
          llm ??
          "I'd answer that in concierge mode — but the LLM key isn't wired yet. Drop a note via the early-access form and we'll reply within 24h.",
        done: true,
      }
    }
  }
}

function matchVertical(input: string): Vertical | null {
  const lower = input.toLowerCase()
  for (const v of VERTICAL_VALUES) {
    if (v.toLowerCase() === lower) return v
  }
  if (lower.includes('beauty')) return 'beauty'
  if (lower.includes('food') || lower.includes('f&b') || lower.includes('fnb'))
    return 'F&B'
  if (lower.includes('fashion') || lower.includes('apparel')) return 'fashion'
  if (lower.includes('ip') || lower.includes('entertainment')) return 'IP'
  if (lower.includes('lifestyle')) return 'lifestyle'
  return null
}

function verticalLabel(v: Vertical): string {
  if (v === 'F&B') return 'F&B'
  if (v === 'IP') return 'IP / entertainment'
  return v.charAt(0).toUpperCase() + v.slice(1)
}

function matchRegion(input: string): Region | null {
  const upper = input.toUpperCase()
  for (const r of REGION_VALUES) {
    if (upper === r) return r
  }
  if (upper.includes('GCC') || upper.includes('GULF')) return 'GCC'
  if (upper.includes('APAC') || upper.includes('ASIA')) return 'APAC'
  if (upper.includes('EU') || upper.includes('EUROPE')) return 'EU'
  if (upper.includes('NORTH AMERICA') || upper === 'NA' || upper === 'US')
    return 'NA'
  return null
}

function matchFormat(input: string): FormatPreference | null {
  const lower = input.toLowerCase().trim()
  for (const f of FORMAT_VALUES) {
    if (f === lower) return f
  }
  if (lower.includes('booth') || lower.includes('sampling')) return 'booth'
  if (lower.includes('pop-up') || lower.includes('popup') || lower === 'rs')
    return 'pop-up'
  if (lower.includes('branded') || lower.includes('zone'))
    return 'branded-zone'
  if (lower.includes('open') || lower.includes('all')) return 'open'
  return null
}

function formatLabel(f: FormatPreference): string {
  const map: Record<FormatPreference, string> = {
    booth: 'Booth / sampling',
    'pop-up': 'Pop-up partnership',
    'branded-zone': 'Branded zone',
    open: 'Open to all',
  }
  return map[f]
}

function matchBudget(input: string): number | null {
  const direct = Number(input)
  if (!Number.isNaN(direct) && direct > 0) return direct
  const lower = input.toLowerCase()
  if (lower.includes('under') || lower.includes('<50') || lower.includes('< 50'))
    return 50_000
  if (lower.includes('50') && lower.includes('200')) return 200_000
  if (lower.includes('200') && lower.includes('500')) return 500_000
  if (lower.includes('500') || lower.includes('1m') || lower.includes('1.5m'))
    return 1_500_000
  return null
}

function matchAnchor(input: string): boolean | null {
  const lower = input.toLowerCase()
  if (lower === 'true') return true
  if (lower === 'false') return false
  if (lower.includes('anchor') || lower.includes('required')) return true
  if (lower.includes('open') || lower.includes('newer')) return false
  return null
}

function buildResultsReply(
  count: number,
  collected: ConversationCollected,
): string {
  if (count === 0) {
    return `No stages in our current network match ${verticalLabel(collected.vertical ?? 'lifestyle')} × ${collected.region} at this budget. Want to relax one filter?`
  }
  const filters = [
    collected.vertical ? verticalLabel(collected.vertical) : null,
    collected.region,
    collected.formatPreference && collected.formatPreference !== 'open'
      ? formatLabel(collected.formatPreference)
      : null,
    collected.budgetCeilingUSD
      ? `≤ $${(collected.budgetCeilingUSD / 1000).toFixed(0)}k`
      : null,
    collected.needsAnchorIP ? 'anchor IP' : null,
  ]
    .filter(Boolean)
    .join(' · ')
  const noun = count === 1 ? 'stage' : 'stages'
  return `Found ${count} ${noun} matching ${filters}. Ranked by fit score — top match shows the agent's reasoning.`
}

export {
  VERTICAL_OPTIONS,
  REGION_OPTIONS,
  FORMAT_OPTIONS,
  BUDGET_OPTIONS,
  ANCHOR_OPTIONS,
  type ConversationStep,
}
