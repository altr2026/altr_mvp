import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/site/Footer'
import {
  getRightHolderBySlug,
  getRightHolders,
} from '@/lib/mock-data'
import type { AvailableSlot, RightHolder } from '@/types'

const TYPE_LABEL: Record<RightHolder['type'], string> = {
  'live-event': 'Live Event',
  'mall-activation': 'Mall Activation',
  'hospitality-popup': 'Hospitality Pop-up',
}

const FORMAT_LABEL: Record<AvailableSlot['format'], string> = {
  booth: 'Booth',
  'pop-up': 'Pop-up',
  'concert-tier': 'Branded Zone',
  'main-stage': 'Title / Naming',
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const formatDateRange = (startISO: string, endISO: string): string => {
  const [sy, sm, sd] = startISO.split('-').map(Number)
  const [ey, em, ed] = endISO.split('-').map(Number)
  const sMonth = MONTHS[sm - 1]
  const eMonth = MONTHS[em - 1]
  if (sy === ey && sm === em && sd === ed)
    return `${sMonth} ${sd}, ${sy}`
  if (sy === ey && sm === em) return `${sMonth} ${sd}–${ed}, ${sy}`
  if (sy === ey) return `${sMonth} ${sd} – ${eMonth} ${ed}, ${sy}`
  return `${sMonth} ${sd}, ${sy} – ${eMonth} ${ed}, ${ey}`
}

const formatPrice = (n: number): string => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n}`
}

const formatReach = (n: number): string => {
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return `${m >= 10 ? m.toFixed(0) : m.toFixed(1)}M`
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

const daysUntil = (iso: string): number => {
  const target = new Date(iso).getTime()
  const now = new Date('2026-05-25').getTime()
  return Math.max(0, Math.round((target - now) / (1000 * 60 * 60 * 24)))
}

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
  if (!rh) return { title: 'Event not found · ALTR' }
  return {
    title: `${rh.name} — Sponsorship options · ALTR`,
    description: rh.tagline ?? rh.anchorIP,
  }
}

export default async function LiveIPDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const rh = await getRightHolderBySlug(slug)
  if (!rh) notFound()

  const starts = rh.availableSlots.map((s) => s.startDate).sort()
  const ends = rh.availableSlots.map((s) => s.endDate).sort()
  const earliestStart = starts[0]
  const latestEnd = ends[ends.length - 1]
  const dateRange = formatDateRange(earliestStart, latestEnd)
  const daysToEvent = daysUntil(earliestStart)
  const slotsSorted = [...rh.availableSlots].sort(
    (a, b) => b.baseRate - a.baseRate,
  )

  return (
    <>
      <section className="relative">
        <div className="relative h-[280px] w-full overflow-hidden md:h-[380px] lg:h-[440px]">
          <Image
            src={rh.heroImage}
            alt={rh.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-altr-bg from-45% via-altr-bg/92 via-70% to-altr-bg/35 to-100%" />
        </div>

        <div className="-mt-32 px-6 md:-mt-44 md:px-8">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/live-ip"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.22em] text-altr-text-2 uppercase transition hover:text-altr-mint-bright"
            >
              ← Back to Live IP
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge tone="lime">Accepting sponsors</Badge>
              <Badge tone="mint">Vetted by ALTR</Badge>
              {daysToEvent > 0 && (
                <Badge tone="text">{daysToEvent} days to event</Badge>
              )}
              <Badge tone="text">{TYPE_LABEL[rh.type]}</Badge>
              <Badge tone="text">{rh.region}</Badge>
            </div>

            <h1 className="mt-5 max-w-4xl text-[28px] font-semibold leading-[1.08] tracking-[-0.03em] text-altr-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] md:text-[40px] lg:text-[48px] lg:tracking-[-0.035em]">
              {rh.name}
            </h1>

            {rh.tagline && (
              <p className="mt-4 max-w-3xl text-[15px] leading-[1.55] text-altr-text-2 md:text-[17px]">
                {rh.tagline}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11.5px] tracking-wider text-altr-text-2 uppercase">
              <span>
                <span className="text-altr-text-3">Dates · </span>
                <span className="text-altr-lime">{dateRange}</span>
              </span>
              <span>
                <span className="text-altr-text-3">Location · </span>
                <span className="text-altr-white">
                  {rh.city}, {rh.country}
                </span>
              </span>
              <span>
                <span className="text-altr-text-3">Reach · </span>
                <span className="text-altr-white">
                  {formatReach(rh.audienceSize)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-white/[0.06] bg-altr-card p-6 md:p-8">
            <h2 className="font-mono text-[10px] tracking-[0.22em] text-altr-text-3 uppercase">
              Anchor IP
            </h2>
            <p className="mt-4 text-[15px] leading-[1.65] text-altr-white md:text-[16px]">
              {rh.anchorIP}
            </p>
            {rh.keywords && rh.keywords.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-1.5">
                {rh.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full border border-white/[0.1] bg-altr-bg/60 px-2.5 py-1 font-mono text-[10px] tracking-wider text-altr-text-2 uppercase"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-altr-card p-6 md:p-8">
            <h2 className="font-mono text-[10px] tracking-[0.22em] text-altr-text-3 uppercase">
              Audience
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {(rh.audienceHighlights ?? []).map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-[13.5px] leading-[1.55] text-altr-text-2"
                >
                  <span className="mt-[7px] inline-block h-1 w-1 flex-shrink-0 rounded-[1px] bg-altr-mint-bright" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-white/[0.06] pt-4 text-[12px] leading-[1.55] text-altr-text-3">
              {rh.audienceProfile}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2 className="text-[22px] font-semibold tracking-[-0.025em] text-altr-white md:text-[28px]">
              Sponsorship options
            </h2>
            <span className="font-mono text-[11px] tracking-[0.2em] text-altr-text-3 uppercase">
              {slotsSorted.length} tiers
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {slotsSorted.map((slot) => (
              <SlotCard key={slot.id} slot={slot} slug={rh.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pt-6 pb-16 md:px-8 md:pt-10 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-altr-mint-bright/30 bg-altr-mint/[0.06] p-7 md:p-9">
            <h3 className="text-[18px] font-semibold text-altr-white md:text-[22px]">
              Want this stage — or have a more specific brief?
            </h3>
            <p className="mt-3 max-w-2xl text-[14px] leading-[1.6] text-altr-text-2">
              Join the early-access cohort to get matched with{' '}
              <span className="text-altr-mint-bright">{rh.name}</span> and other
              vetted Live IP across ASIA. Or ask the ALTR agent (bottom right) any
              follow-up question about pricing, audience, or formats.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/#waitlist"
                className="rounded-lg bg-altr-mint px-5 py-2.5 text-[13px] font-semibold text-altr-white transition hover:bg-altr-mint-bright"
              >
                Secure your spot →
              </Link>
              <Link
                href="/live-ip"
                className="rounded-lg border border-white/[0.1] px-5 py-2.5 text-[13px] font-medium text-altr-text-2 transition hover:border-white/[0.2] hover:text-altr-white"
              >
                Browse other Live IP
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode
  tone: 'lime' | 'mint' | 'text'
}) {
  const cls =
    tone === 'lime'
      ? 'border-altr-lime/40 bg-altr-lime/[0.08] text-altr-lime'
      : tone === 'mint'
        ? 'border-altr-mint-bright/30 bg-altr-mint/[0.08] text-altr-mint-bright'
        : 'border-white/[0.1] bg-altr-bg/60 text-altr-text-2'
  return (
    <span
      className={`inline-flex items-center rounded border px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase backdrop-blur ${cls}`}
    >
      {children}
    </span>
  )
}

function SlotCard({ slot, slug }: { slot: AvailableSlot; slug: string }) {
  const dateRange = formatDateRange(slot.startDate, slot.endDate)
  const formatLabel = FORMAT_LABEL[slot.format]
  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-white/[0.07] bg-altr-card p-6 transition hover:border-altr-mint-bright/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] tracking-[0.2em] text-altr-mint-bright uppercase">
            {formatLabel}
          </span>
          <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-altr-white md:text-[18px]">
            {slot.tierName ?? formatLabel}
          </h3>
        </div>
        <span className="font-mono text-[20px] font-bold text-altr-lime md:text-[22px]">
          {formatPrice(slot.baseRate)}
        </span>
      </div>

      {slot.tierTagline && (
        <p className="text-[13.5px] leading-[1.5] text-altr-text-2">
          {slot.tierTagline}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-y border-white/[0.06] py-3 font-mono text-[10px] tracking-[0.18em] text-altr-text-3 uppercase">
        <span>
          <span className="text-altr-text-3">Window · </span>
          <span className="text-altr-white">{dateRange}</span>
        </span>
        {slot.availability && (
          <span>
            <span className="text-altr-text-3">Avail · </span>
            <span className="text-altr-white">{slot.availability}</span>
          </span>
        )}
        {slot.rsAvailable && (
          <span className="text-altr-lime">RS</span>
        )}
      </div>

      {slot.includes && slot.includes.length > 0 && (
        <ul className="flex flex-col gap-2">
          {slot.includes.map((line) => (
            <li
              key={line}
              className="flex items-start gap-2 text-[13px] leading-[1.5] text-altr-text-2"
            >
              <span className="mt-[7px] inline-block h-1 w-1 flex-shrink-0 rounded-[1px] bg-altr-mint-bright" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
        <Link
          href="/#waitlist"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-white/[0.1] bg-altr-bg/40 px-3 text-[12.5px] font-semibold text-altr-text-2 transition hover:border-white/[0.2] hover:text-altr-white"
        >
          Contact request
        </Link>
        <Link
          href={`/deal/preview/${slug}`}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-altr-mint-bright/30 bg-altr-mint/[0.08] px-3 text-[12.5px] font-semibold text-altr-mint-bright transition hover:border-altr-mint hover:bg-altr-mint/[0.18]"
        >
          Make an offer →
        </Link>
      </div>
    </article>
  )
}
