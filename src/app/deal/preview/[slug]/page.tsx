import { notFound } from 'next/navigation'
import { Footer } from '@/components/site/Footer'
import { getRightHolderBySlug, getRightHolders } from '@/lib/mock-data'
import { DealPreview } from './DealPreview'

export async function generateStaticParams() {
  const rhs = await getRightHolders()
  return rhs.map((rh) => ({ slug: rh.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const rh = await getRightHolderBySlug(slug)
  if (!rh) return { title: 'Deal preview · ALTR' }
  return {
    title: `Deal preview: COSRX × ${rh.name} — ALTR`,
    description:
      'Walk through the post-match deal lifecycle: terms, settlement rail, milestones, settlement, ROI report.',
  }
}

const ipShortFor = (name: string): string => {
  const cleaned = name.replace(/\(.*?\)/g, '').trim()
  return cleaned.split(/[—–-]/)[0].trim().split(/\s+/).slice(0, 2).join(' ')
}

export default async function DealPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const rh = await getRightHolderBySlug(slug)
  if (!rh) notFound()

  return (
    <>
      <DealPreview
        slug={slug}
        ipName={rh.name}
        ipShort={ipShortFor(rh.name)}
        ipCity={rh.city}
        ipCountry={rh.country}
      />
      <Footer />
    </>
  )
}
