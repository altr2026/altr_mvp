export type Region = 'GCC' | 'APAC' | 'EU' | 'NA'

export type Vertical =
  | 'beauty'
  | 'F&B'
  | 'fashion'
  | 'IP'
  | 'lifestyle'
  | 'entertainment'

export type RightHolderType =
  | 'live-event'
  | 'hospitality-popup'
  | 'mall-activation'

export type BrandType = 'sponsor' | 'content-partner'

export type DealStep = 1 | 2 | 3 | 4 | 5 | 6

export type DealStatus =
  | 'matching'
  | 'contract-drafting'
  | 'executing'
  | 'settling'
  | 'completed'

export type AvailableSlot = {
  id: string
  startDate: string
  endDate: string
  format: 'pop-up' | 'booth' | 'concert-tier' | 'main-stage'
  baseRate: number
  rsAvailable: boolean
}

export type RightHolder = {
  id: string
  slug: string
  name: string
  city: string
  country: string
  region: Region
  type: RightHolderType
  anchorIP: string
  audienceSize: number
  audienceProfile: string
  verticals: Vertical[]
  heroImage: string
  availableSlots: AvailableSlot[]
}

export type Brand = {
  id: string
  slug: string
  name: string
  origin: string
  brandType: BrandType
  vertical: Vertical
  targetRegions: Region[]
  budgetUSD: { min: number; max: number }
  monthlyReach: number
  pitch: string
  logo: string
}

export type Match = {
  id: string
  brandId: string
  rightHolderId: string
  fitScore: number
  reasoning: string[]
  predictedROI: {
    revenueLowUSD: number
    revenueHighUSD: number
    conversionRate: number
    reachQuality: 'low' | 'medium' | 'high' | 'top-tier'
  }
  budgetSimulation: {
    capitalUpfrontUSD: number
    rsRatio: number
    breakEvenAttendance: number
  }
}

export type ContractMilestone = {
  id: string
  label: string
  triggerCondition: string
  amountUSD: number
  daysOffsetFromStart: number
}

export type Contract = {
  id: string
  dealId: string
  matchId: string
  rsRatio: number
  capitalUpfrontUSD: number
  totalValueUSD: number
  startDate: string
  endDate: string
  executionScope: string
  milestones: ContractMilestone[]
}

export type Settlement = {
  id: string
  contractMilestoneId: string
  xrplTxHash: string
  amountFrom: { value: number; currency: string }
  amountTo: { value: number; currency: string }
  settledAt: string
  status: 'pending' | 'settled' | 'failed'
  feePercent: number
}

export type Benchmark = {
  vertical: Vertical
  region: Region
  rightHolderType: RightHolderType
  avgConversionRate: number
  avgARPUUSD: number
  sampleSize: number
  lastUpdated: string
}

export type Deal = {
  id: string
  brandId: string
  rightHolderId: string
  matchId: string
  contractId?: string
  status: DealStatus
  currentStep: DealStep
  createdAt: string
  posDataAvailable: boolean
}

export type FormatPreference = 'booth' | 'pop-up' | 'branded-zone' | 'open'

export type ConversationStep =
  | 'intro'
  | 'vertical'
  | 'region'
  | 'format'
  | 'budget'
  | 'anchor-need'
  | 'narrowing'
  | 'results'

export type ConversationCollected = {
  vertical?: Vertical
  region?: Region
  formatPreference?: FormatPreference
  budgetCeilingUSD?: number
  needsAnchorIP?: boolean
}

export type ConversationState = {
  sessionId: string
  step: ConversationStep
  collected: ConversationCollected
}

export type ConversationOption = {
  id: string
  label: string
  value: string
}

export type AgentTurnRequest = {
  state: ConversationState
  userInput: string
}

export type AgentTurnResponse = {
  state: ConversationState
  reply: string
  options?: ConversationOption[]
  done: boolean
  results?: {
    rightHolders: RightHolder[]
    matches: Match[]
  }
}

export type InsightCategory = 'Market data' | 'Pricing' | 'Trends'

export type Insight = {
  id: string
  category: InsightCategory
  publishedAt: string
  title: string
  summary: string
  href: string
}

export type WaitlistRole = 'live-ip' | 'brand'

export type WaitlistSubmission = {
  role: WaitlistRole
  email: string
  orgName: string
  vertical?: string
  location?: string
  sizeBracket?: string
  budgetBracket?: string
  sponsorshipFormat?: string
  activationWindow?: string
  duration?: string
  notes?: string
}

export type ApiResponse<T> = {
  data: T
}

export type ApiError = {
  error: string
}
