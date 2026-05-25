import type { BrandProfile } from './demo-state'
import type { ConversationCollected, FormatPreference, Region, Vertical } from '@/types'

const VERTICAL_MAP: Record<string, Vertical> = {
  'Beauty / Skincare': 'beauty',
  Beauty: 'beauty',
  'F&B': 'F&B',
  Fashion: 'fashion',
  'Entertainment / IP': 'IP',
  'Health & wellness': 'lifestyle',
}

const REGION_MAP: Record<string, Region> = {
  'UAE / GCC': 'GCC',
  'Saudi Arabia': 'GCC',
  Japan: 'APAC',
  'Southeast Asia': 'APAC',
  Europe: 'EU',
  US: 'NA',
}

const FORMAT_MAP: Record<string, FormatPreference> = {
  'Pop-up (Revenue Share)': 'pop-up',
  'Booth / sampling': 'booth',
  'Branded zone': 'branded-zone',
  'Title sponsor': 'branded-zone',
  'Open to all': 'open',
}

const BUDGET_MAP: Record<string, number> = {
  'Under $10K': 10000,
  '$10K – $50K': 50000,
  '$50K – $200K': 200000,
  '$200K – $500K': 500000,
  '$500K+': 1500000,
}

export function brandProfileToCollected(brand: BrandProfile): ConversationCollected {
  const vertical = VERTICAL_MAP[brand.vertical]
  const region = REGION_MAP[brand.targetMarket]
  const formatPreference = FORMAT_MAP[brand.activationFormat]
  const budgetCeilingUSD = BUDGET_MAP[brand.budgetRange]
  return {
    ...(vertical && { vertical }),
    ...(region && { region }),
    ...(formatPreference && { formatPreference }),
    ...(budgetCeilingUSD !== undefined && { budgetCeilingUSD }),
  }
}

export function summarizeBrand(brand: BrandProfile): string {
  const parts: string[] = []
  if (brand.brandName) parts.push(brand.brandName)
  if (brand.vertical) parts.push(brand.vertical.toLowerCase())
  if (brand.targetMarket) parts.push(`→ ${brand.targetMarket}`)
  if (brand.activationFormat) parts.push(brand.activationFormat.toLowerCase())
  if (brand.budgetRange) parts.push(brand.budgetRange)
  return parts.join(' · ')
}

export function hasCompleteBrand(brand: BrandProfile): boolean {
  return Boolean(
    brand.brandName &&
      brand.vertical &&
      brand.targetMarket &&
      brand.activationFormat &&
      brand.budgetRange,
  )
}
