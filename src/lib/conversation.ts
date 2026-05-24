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
  { id: 'v-beauty', label: 'Beauty', value: 'beauty' },
  { id: 'v-fnb', label: 'F&B', value: 'F&B' },
  { id: 'v-fashion', label: 'Fashion', value: 'fashion' },
  { id: 'v-ip', label: 'IP / Entertainment', value: 'IP' },
  { id: 'v-lifestyle', label: 'Lifestyle', value: 'lifestyle' },
]

const REGION_OPTIONS: ConversationOption[] = [
  { id: 'r-gcc', label: 'GCC (UAE, KSA, Qatar)', value: 'GCC' },
  { id: 'r-apac', label: 'APAC (SG, JP, TH, ID)', value: 'APAC' },
  { id: 'r-eu', label: 'Europe', value: 'EU' },
  { id: 'r-na', label: 'North America', value: 'NA' },
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
        return {
          state,
          reply: 'Pick one of the verticals below to continue.',
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
        return {
          state,
          reply: 'Pick a region below.',
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
        return {
          state,
          reply: 'Pick a format below.',
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
        return {
          state,
          reply: 'Pick a budget tier below.',
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
        return {
          state,
          reply: 'Pick one of the two options.',
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
    case 'results':
      return {
        state,
        reply:
          "We've already narrowed this round. Reset to start a new search.",
        done: true,
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
