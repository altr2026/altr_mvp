import Link from 'next/link'
import { Footer } from '@/components/site/Footer'

export const metadata = {
  title: 'Why Saudi Arabia is the next sponsorship frontier — ALTR',
  description:
    "Vision 2030, Expo 2030, FIFA 2034, and $13.3B already committed to leisure CAPEX. Brands that aren't booking GCC pipeline now are booking too late.",
}

const TAGS = ['Trends', 'Saudi Arabia', 'Vision 2030', 'Frontier']

const STATS = [
  {
    value: '$13.3B',
    label: 'Leisure CAPEX · 2024–25',
    source:
      'SAR 50B committed · Qiddiya, NEOM, mid-tier venues · Vision 2030',
  },
  {
    value: '+17% YoY',
    label: 'Domestic tourism · Summer 2025',
    source:
      'Saudi Ministry of Tourism · bundled hotel-and-attraction passes drove the lift',
  },
  {
    value: '$7.56B',
    label: 'Saudi beauty market · 2025',
    source:
      'Projected $10.84B by 2031 · Mordor Intelligence · 7.5% CAGR',
  },
]

export default function SaudiFrontierPage() {
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
              Trends
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-text-3">
              Feb 2026
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-text-3">
              4 min read
            </span>
          </div>

          <h1 className="mt-6 text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-altr-white md:text-[40px] lg:text-[44px] lg:tracking-[-0.035em]">
            Saudi Arabia isn&apos;t a frontier market anymore. It&apos;s a{' '}
            <span className="text-altr-mint">booked pipeline</span>.
          </h1>

          <div className="mt-8 flex items-center gap-3 border-y border-white/[0.06] py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-altr-mint/[0.16] font-mono text-[14px] font-semibold text-altr-mint-bright">
              A
            </span>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-altr-white">
                altr · trends desk
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-text-3">
                Cross-referenced from Vision 2030 + Mordor + Campaign ME
              </span>
            </div>
          </div>

          <p className="mt-8 text-[18px] leading-[1.55] text-altr-text-2 md:text-[20px]">
            The &ldquo;Saudi is the next frontier&rdquo; pitch has been the
            same deck for five years. What changed in 2025 is that the
            anchor events stopped being theoretical — they got booked,
            announced, and budgeted. Brands that wait for proof of concept
            are now waiting for sold-out inventory.
          </p>

          <p className="mt-7 text-[15px] leading-[1.75] text-altr-text-2 md:text-[16px]">
            Three pillars shifted the timing. <strong>Vision 2030</strong> is
            now in its delivery years — Saudi&apos;s commercial entertainment
            industry, near-zero in 2018, was SAR 20–25B (~$5.3–6.7B) in 2025
            and is forecast to compound at 12.4% CAGR through 2031.{' '}
            <strong>Expo 2030</strong> is awarded to Riyadh; build-out is
            already shaping hospitality and sponsorship-slot pricing.{' '}
            <strong>FIFA World Cup 2034</strong> sits behind both, locking in
            broadcast and brand inventory through the next decade.
          </p>

          <blockquote className="mt-10 border-l-4 border-altr-lavender pl-6 text-[20px] leading-[1.5] font-medium text-altr-white md:text-[22px]">
            &ldquo;Brands that aren&apos;t booking GCC pipeline now are
            booking too late.&rdquo;
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
            The demand side moved with it. Saudi domestic tourism grew 17%
            year-over-year in summer 2025, driven by bundled hotel-and-attraction
            packages. Saudi beauty alone is a $7.56B market in 2025, projected
            to hit $10.84B by 2031 — and Korean retailers (CJ Olive Young,
            most visibly, via the Life Healthcare partnership signed in Abu
            Dhabi in late 2025) are routing distribution through the GCC into
            Saudi instead of waiting on a direct entry.
          </p>

          <p className="mt-5 text-[15px] leading-[1.75] text-altr-text-2 md:text-[16px]">
            What that means for sponsorship pipeline: the highest-leverage
            slots — Riyadh Season anchor sponsors, Soundstorm title positions,
            Expo 2030 pavilion partnerships — are booked 18–24 months out.
            The mid-tier festival inventory still has windows, but pricing is
            firming month by month as the broader supply chain (hospitality,
            FX rails, settlement infrastructure) catches up to demand.
          </p>

          <p className="mt-5 text-[15px] leading-[1.75] text-altr-text-2 md:text-[16px]">
            The brands that win the next cycle aren&apos;t the ones with the
            biggest budgets. They&apos;re the ones whose deal infrastructure
            — contract drafting, escrow, FX, on-chain settlement — can move
            as fast as the booking windows. That&apos;s where ALTR sits.
          </p>

          <div className="mt-12 rounded-2xl border border-altr-mint-bright/30 bg-altr-mint/[0.06] p-7 md:p-8">
            <p className="text-[15px] leading-[1.65] text-altr-white md:text-[16px]">
              The first ALTR cohort is matching against Saudi and UAE
              pipeline right now — Frieze Abu Dhabi, Dubai Shopping Festival,
              and tier-2 properties feeding into the Expo 2030 / FIFA 2034
              window.
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
                Vision 2030 Annual Report 2025 (vision2030.gov.sa)
              </li>
              <li>
                Saudi Arabia Entertainment Market Report 2025–2033
                (GlobeNewswire, May 2025)
              </li>
              <li>
                Saudi Arabia Entertainment and Amusement Report 2026
                (GlobeNewswire, Feb 2026)
              </li>
              <li>
                Saudi Arabia Beauty and Personal Care Market 2031 (Mordor
                Intelligence)
              </li>
              <li>
                CJ Olive Young × Life Healthcare GCC partnership (HPC
                MagMEA, Nov 2025)
              </li>
              <li>
                Saudi Ministry of Tourism · summer 2025 domestic tourism
                figures
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
