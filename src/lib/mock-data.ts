import type { Activation, Brand, Venue } from '@/types'

// Hero images use picsum seeded URLs as placeholders until real photography lands.
const venueImg = (seed: string) =>
  `https://picsum.photos/seed/${seed}/1200/800`

const brandLogo = (seed: string) =>
  `https://picsum.photos/seed/${seed}/400/400`

const mockVenues: Venue[] = [
  {
    id: 'v_marina_crescent',
    slug: 'marina-crescent-atrium',
    name: 'Marina Crescent Atrium',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'GCC',
    type: 'mall',
    capacity: 8000,
    monthlyFootfall: 1_400_000,
    description:
      'Six-story atrium inside the Marina Crescent retail complex, programmable for F&B pop-ups, beauty bars, and IP-led brand activations.',
    tags: ['F&B-ready', 'luxury', 'family', 'high-traffic'],
    heroImage: venueImg('marina-crescent'),
    availableFrom: '2026-06-01',
  },
  {
    id: 'v_hanok_pavilion',
    slug: 'hanok-sound-pavilion',
    name: 'Hanok Sound Pavilion',
    city: 'Seoul',
    country: 'South Korea',
    region: 'APAC',
    type: 'pop-up-space',
    capacity: 1200,
    monthlyFootfall: 95_000,
    description:
      'Intimate heritage hanok venue retrofitted for live audio, listening sessions, and small-format brand storytelling in Bukchon.',
    tags: ['culture', 'music', 'intimate', 'heritage'],
    heroImage: venueImg('hanok-pavilion'),
    availableFrom: '2026-07-15',
  },
  {
    id: 'v_sentosa_cove',
    slug: 'sentosa-cove-festival-grounds',
    name: 'Sentosa Cove Festival Grounds',
    city: 'Singapore',
    country: 'Singapore',
    region: 'APAC',
    type: 'festival',
    capacity: 25000,
    monthlyFootfall: 320_000,
    description:
      'Open-air waterfront festival site with full production infrastructure, suited for multi-day brand-anchored music and lifestyle programming.',
    tags: ['open-air', 'summer', 'lifestyle', 'large-format'],
    heroImage: venueImg('sentosa-cove'),
    availableFrom: '2026-08-01',
  },
  {
    id: 'v_alula_stage',
    slug: 'alula-open-stage',
    name: 'AlUla Open Stage',
    city: 'AlUla',
    country: 'Saudi Arabia',
    region: 'GCC',
    type: 'arena',
    capacity: 12000,
    monthlyFootfall: 180_000,
    description:
      'Sandstone-canyon open-air arena programmed under the AlUla cultural calendar — premium evening slots for global IP-led concerts and immersive activations.',
    tags: ['heritage', 'premium', 'evening', 'destination'],
    heroImage: venueImg('alula-stage'),
    availableFrom: '2026-10-10',
  },
]

const mockBrands: Brand[] = [
  {
    id: 'b_lumi_beauty',
    slug: 'lumi-beauty-lab',
    name: 'Lumi Beauty Lab',
    origin: 'Seoul, KR',
    category: 'beauty',
    targetRegions: ['APAC', 'GCC'],
    shortPitch:
      'K-beauty glass-skin routine engineered for desert and tropical climates.',
    logo: brandLogo('lumi-beauty'),
    monthlyReach: 2_300_000,
    tags: ['skincare', 'pop-up-ready', 'sampling'],
  },
  {
    id: 'b_hansik_table',
    slug: 'hansik-table',
    name: 'Hansik Table',
    origin: 'Seoul, KR',
    category: 'F&B',
    targetRegions: ['APAC', 'GCC', 'EU'],
    shortPitch:
      'Modern Korean dining concept built for international pop-up residencies.',
    logo: brandLogo('hansik-table'),
    monthlyReach: 1_100_000,
    tags: ['fine-casual', 'chef-led', 'residency'],
  },
  {
    id: 'b_studio_neon',
    slug: 'studio-neon',
    name: 'Studio NEON',
    origin: 'Seoul, KR',
    category: 'IP',
    targetRegions: ['APAC', 'GCC'],
    shortPitch:
      'Webtoon and animation studio with concert-format live IP rights across three flagship titles.',
    logo: brandLogo('studio-neon'),
    monthlyReach: 4_600_000,
    tags: ['IP', 'concert-rights', 'fandom'],
  },
  {
    id: 'b_onyx_street',
    slug: 'onyx-streetwear',
    name: 'Onyx Streetwear',
    origin: 'Busan, KR',
    category: 'fashion',
    targetRegions: ['APAC', 'EU', 'NA'],
    shortPitch:
      'Limited-drop streetwear label with a venue-native retail model.',
    logo: brandLogo('onyx-streetwear'),
    monthlyReach: 890_000,
    tags: ['drop-model', 'streetwear', 'community'],
  },
]

const mockActivations: Activation[] = [
  {
    id: 'a_lumi_marina',
    brandId: 'b_lumi_beauty',
    venueId: 'v_marina_crescent',
    title: 'Glass Skin Atrium',
    startDate: '2026-03-12',
    endDate: '2026-04-09',
    status: 'completed',
    expectedAttendance: 84_000,
  },
  {
    id: 'a_hansik_sentosa',
    brandId: 'b_hansik_table',
    venueId: 'v_sentosa_cove',
    title: 'Hansik Summer Festival',
    startDate: '2026-05-20',
    endDate: '2026-05-26',
    status: 'live',
    expectedAttendance: 62_000,
  },
  {
    id: 'a_neon_alula',
    brandId: 'b_studio_neon',
    venueId: 'v_alula_stage',
    title: 'NEON Sound Night',
    startDate: '2026-11-14',
    endDate: '2026-11-15',
    status: 'upcoming',
    expectedAttendance: 24_000,
  },
]

export async function getVenues(): Promise<Venue[]> {
  return mockVenues
}

export async function getVenueBySlug(slug: string): Promise<Venue | null> {
  return mockVenues.find((v) => v.slug === slug) ?? null
}

export async function getBrands(): Promise<Brand[]> {
  return mockBrands
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  return mockBrands.find((b) => b.slug === slug) ?? null
}

export async function getActivations(): Promise<Activation[]> {
  return mockActivations
}

export async function getActivationsByVenue(
  venueId: string,
): Promise<Activation[]> {
  return mockActivations.filter((a) => a.venueId === venueId)
}

export async function getActivationsByBrand(
  brandId: string,
): Promise<Activation[]> {
  return mockActivations.filter((a) => a.brandId === brandId)
}
