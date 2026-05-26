import Link from 'next/link'
import { Footer } from '@/components/site/Footer'

export const metadata = {
  title: 'Saudi entertainment crosses SAR 20B — ALTR',
  description:
    'Saudi entertainment has gone from near-zero in 2018 to a $5–6B annual market by 2025. Riyadh Season pulled 11M+ visitors. Another $13.3B in leisure CAPEX is committed.',
}

const TAGS = ['Market data', 'GCC', 'Saudi Arabia', 'Investment']

const STATS = [
  {
    value: 'SAR 20–25B',
    label: 'Saudi entertainment · annual',
    source:
      '~$5.3–6.7B · up from near-zero in 2018 · Vision 2030 scorecard · 2025',
  },
  {
    value: '$13.3B',
    label: 'Leisure CAPEX · 2024–25',
    source:
      'SAR 50B committed across Qiddiya, NEOM mixed-reality zones, and adjacent infra',
  },
  {
    value: '11M+',
    label: 'Riyadh Season 2025 visitors',
    source:
      'Crossed 11M attendees before closing week; 8M by mid-season',
  },
]

export default function GCCSponsorshipPage() {
  return (
    <>
      <article className="px-6 pt-8 pb-16 md:px-8 md:pt-12 md:pb-24">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/insights"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-text-3 transition hover:text-altr-mint-bright"
          >
            ← Insights
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded border border-altr-mint-bright/30 bg-altr-mint/[0.06] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-altr-mint-bright">
              Market data
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-text-3">
              Apr 2026
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-text-3">
              4 min read
            </span>
          </div>

          <h1 className="mt-6 text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-altr-white md:text-[40px] lg:text-[44px] lg:tracking-[-0.035em]">
            Saudi entertainment is now a $5–6B market — and the{' '}
            <span className="text-altr-mint">capital is still landing</span>.
          </h1>

          <div className="mt-8 flex items-center gap-3 border-y border-white/[0.06] py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-altr-mint/[0.16] font-mono text-[14px] font-semibold text-altr-mint-bright">
              A
            </span>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-altr-white">
                altr · market desk
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-text-3">
                Sourced from Vision 2030 scorecard + Statista
              </span>
            </div>
          </div>

          <p className="mt-8 text-[18px] leading-[1.55] text-altr-text-2 md:text-[20px]">
            In 2018, Saudi Arabia&apos;s commercial entertainment industry was
            a rounding error. By 2025 it&apos;s SAR 20–25B in annual spend —
            roughly $5.3–6.7B — and the leisure CAPEX behind it tells you the
            ramp is just getting started.
          </p>

          <p className="mt-7 text-[15px] leading-[1.75] text-altr-text-2 md:text-[16px]">
            Over 2024–25 alone, Saudi committed SAR 50B (~$13.3B) into
            entertainment and leisure infrastructure — Qiddiya, NEOM&apos;s
            mixed-reality zones, and a layer of mid-tier venues that
            didn&apos;t exist five years ago. The flagship demand signal:
            Riyadh Season 2025 crossed 1M visitors in 13 days, 8M by
            mid-season, and 11M+ by closing week. That&apos;s a 90-day window
            absorbing audience volume on par with the Coachella + Lollapalooza
            footprint stacked.
          </p>

          <blockquote className="mt-10 border-l-4 border-altr-lavender pl-6 text-[20px] leading-[1.5] font-medium text-altr-white md:text-[22px]">
            &ldquo;Near-zero industry to one of the fastest-growing
            entertainment markets on earth — in seven years.&rdquo;
          </blockquote>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-2 rounded-2xl border border-white/[0.06] bg-altr-card p-6"
              >
                <span className="font-mono text-[22px] leading-none font-bold text-altr-mint-bright md:text-[24px]">
                  {stat.value}
                </span>
                <span className="text-[13px] font-medium text-altr-white">
                  {stat.label}
                </span>
                <span className="text-[11.5px] leading-[1.5] text-altr-text-3">
                  {stat.source}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-10 text-[15px] leading-[1.75] text-altr-text-2 md:text-[16px]">
            For context: the global sports sponsorship market sits at roughly
            $83–91B in 2025 (Fortune, Straits, Verified Market Research
            triangulate inside that band). Saudi entertainment alone is now
            ~6% of that global pie — pulled by a population that was
            functionally locked out of commercial entertainment a decade ago.
            The growth runway forecasted through 2031 is 12.4% CAGR.
          </p>

          <p className="mt-7 text-[15px] leading-[1.75] text-altr-text-2 md:text-[16px]">
            What this means for sponsorship inventory: Saudi is no longer a
            test market. It&apos;s where the cohort of global brands chasing
            yield in saturated APAC and EU markets is rotating into. The deal
            terms there still favor the buyer — sponsorship slots at flagship
            properties are priced 30–40% below comparable EU/APAC inventory
            for equivalent audience size. That gap closes as Expo 2030 and
            FIFA 2034 hit booking windows.
          </p>

          <div className="mt-12 rounded-2xl border border-altr-mint-bright/30 bg-altr-mint/[0.06] p-7 md:p-8">
            <p className="text-[15px] leading-[1.65] text-altr-white md:text-[16px]">
              ALTR&apos;s cohort is matched against the live GCC pipeline
              right now — Frieze Abu Dhabi, Dubai Shopping Festival, and a
              dozen tier-2 properties that haven&apos;t hit search yet. If
              you&apos;re a brand or a property looking to be in the next
              wave, reach out.
            </p>
            <Link
              href="/#waitlist"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-altr-mint px-5 py-2.5 text-[13px] font-semibold text-altr-white transition hover:bg-altr-mint-bright"
            >
              Join the cohort →
            </Link>
          </div>

          <div className="mt-10 rounded-xl border border-white/[0.06] bg-black/30 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-text-3">
              Sources
            </p>
            <ul className="mt-3 flex flex-col gap-1.5 text-[12px] leading-[1.6] text-altr-text-2">
              <li>
                Vision 2030 Culture &amp; Entertainment Economy Scorecard
                (vision2030.ai/tracker)
              </li>
              <li>
                Saudi Arabia Entertainment Market Report 2025–2033
                (GlobeNewswire, May 2025)
              </li>
              <li>
                Vision 2030 Annual Report 2025 (vision2030.gov.sa)
              </li>
              <li>
                Global Sports Sponsorship Market estimates (Fortune Business
                Insights / Straits Research / Verified Market Research, 2025)
              </li>
            </ul>
          </div>

          <div className="mt-12 flex flex-wrap gap-2 border-t border-white/[0.06] pt-6">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.08] bg-altr-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-text-2"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </>
  )
}
