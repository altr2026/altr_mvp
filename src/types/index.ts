export type Region = 'GCC' | 'APAC' | 'EU' | 'NA'

export type VenueType =
  | 'resort'
  | 'mall'
  | 'festival'
  | 'arena'
  | 'hotel'
  | 'pop-up-space'

export type Venue = {
  id: string
  slug: string
  name: string
  city: string
  country: string
  region: Region
  type: VenueType
  capacity: number
  monthlyFootfall: number
  description: string
  tags: string[]
  heroImage: string
  availableFrom: string
}

export type BrandCategory =
  | 'F&B'
  | 'beauty'
  | 'fashion'
  | 'IP'
  | 'lifestyle'
  | 'entertainment'

export type Brand = {
  id: string
  slug: string
  name: string
  origin: string
  category: BrandCategory
  targetRegions: Region[]
  shortPitch: string
  logo: string
  monthlyReach: number
  tags: string[]
}

export type ActivationStatus = 'upcoming' | 'live' | 'completed'

export type Activation = {
  id: string
  brandId: string
  venueId: string
  title: string
  startDate: string
  endDate: string
  status: ActivationStatus
  expectedAttendance: number
}

export type ApiResponse<T> = {
  data: T
}

export type ApiError = {
  error: string
}
