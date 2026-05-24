import Link from 'next/link'
import { Footer } from '@/components/site/Footer'

export const metadata = {
  title: "We started here — Founder's Note · ALTR",
  description:
    "Dubai's F1 hospitality suites hold some of the highest-spending K-content fans on earth. None of them are wearing a Korean brand — because the rail to get them there doesn't exist.",
}

const TAGS = ["Founder's Note", 'GCC', 'K-content', 'Infrastructure']

const STATS: { value: string; label: string; source: string }[] = [
  {
    value: '$14.08B',
    label: 'Korea content exports 2024',
    source: '2nd consecutive record · Ministry of Culture, Sports & Tourism · Feb 2026',
  },
  {
    value: '#1',
    label: 'UAE monthly K-pop spend',
    source: 'Highest of 26 countries globally · KOFICE · 2024',
  },
  {
    value: '~0',
    label: 'Structured K-brand deals',
    source: 'Across 16+ GCC flagship events in 2026 · altr research · 2026',
  },
]

export default function WeStartedHerePage() {
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
              Founder&apos;s Note
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-text-3">
              May 2026
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-text-3">
              3 min read
            </span>
          </div>

          <h1 className="mt-6 text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-altr-white md:text-[40px] lg:text-[48px] lg:tracking-[-0.035em]">
            We started here — not because it&apos;s our whole story, but because
            it&apos;s the clearest proof the{' '}
            <span className="text-altr-mint">rail is missing</span>.
          </h1>

          <div className="mt-8 flex items-center gap-3 border-y border-white/[0.06] py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-altr-mint/[0.16] font-mono text-[14px] font-semibold text-altr-mint-bright">
              A
            </span>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-altr-white">
                altr
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-text-3">
                Founder&apos;s Note
              </span>
            </div>
          </div>

          <p className="mt-8 text-[18px] leading-[1.55] text-altr-text-2 md:text-[20px]">
            Dubai&apos;s F1 hospitality suites hold some of the
            highest-spending K-content fans on earth. None of them are wearing
            a Korean brand. Not because Korean brands are unknown — because
            the infrastructure to get them there doesn&apos;t exist.
          </p>

          <p className="mt-7 text-[15px] leading-[1.75] text-altr-text-2 md:text-[16px]">
            The UAE spends more per capita on K-pop than any other country.
            GCC beauty is growing at 12% annually — the fastest globally.
            Korea&apos;s content exports hit an all-time record of $14.08B in
            2024. And across 16+ flagship GCC events in 2026, the number of
            structured K-brand sponsorship deals sits at roughly zero.
          </p>

          <blockquote className="mt-10 border-l-4 border-altr-lavender pl-6 text-[20px] leading-[1.5] font-medium text-altr-white md:text-[22px]">
            &ldquo;The deal isn&apos;t getting done because nobody built the
            rail. Not because the demand isn&apos;t real.&rdquo;
          </blockquote>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-2 rounded-2xl border border-white/[0.06] bg-altr-card p-6"
              >
                <span className="font-mono text-[26px] leading-none font-bold text-altr-mint-bright md:text-[28px]">
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
            This is where we start — not where we stay. Once the rail works
            here, it works for a Japanese luxury brand entering Saudi Arabia,
            an Indian fintech at a Seoul conference, an Australian festival
            and Korean cosmetics. The geography changes. The infrastructure
            doesn&apos;t.
          </p>

          <div className="mt-12 rounded-2xl border border-altr-mint-bright/30 bg-altr-mint/[0.06] p-7 md:p-8">
            <p className="text-[15px] leading-[1.65] text-altr-white md:text-[16px]">
              We are onboarding a small first cohort of GCC live properties
              and K-content brands. If that&apos;s you, reach out before we
              open publicly.
            </p>
            <Link
              href="/#waitlist"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-altr-mint px-5 py-2.5 text-[13px] font-semibold text-altr-white transition hover:bg-altr-mint-bright"
            >
              Join the cohort →
            </Link>
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
