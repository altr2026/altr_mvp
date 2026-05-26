import Link from 'next/link'
import { Footer } from '@/components/site/Footer'

export const metadata = {
  title: 'How festival sponsorship pricing splits across ASIA — ALTR',
  description:
    'Mature APAC versus emerging GCC: same audience size, very different price tags. A look at how pricing actually clears in 2026, and where the arbitrage sits.',
}

const TAGS = ['Pricing', 'Benchmarks', 'APAC', 'GCC']

const STATS = [
  {
    value: '600K',
    label: 'MDLBEAST Soundstorm 2025',
    source:
      'Riyadh · 3 days · the largest EDM festival in the Middle East · 2025',
  },
  {
    value: '$82–91B',
    label: 'Global sports sponsorship',
    source:
      '2025 market size · Fortune Business / Straits / VMR triangulate inside band',
  },
  {
    value: '13.9%',
    label: 'GCC influencer CAGR',
    source:
      'GCC influencer marketing $315M (2025) → $771M (2032) · GlobalRisk Community',
  },
]

export default function AsiaPricingPage() {
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
              Pricing
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-text-3">
              Mar 2026
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-text-3">
              5 min read
            </span>
          </div>

          <h1 className="mt-6 text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-altr-white md:text-[40px] lg:text-[44px] lg:tracking-[-0.035em]">
            APAC sells the same audience size as GCC. The{' '}
            <span className="text-altr-mint">price tags don&apos;t agree</span>.
          </h1>

          <div className="mt-8 flex items-center gap-3 border-y border-white/[0.06] py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-altr-mint/[0.16] font-mono text-[14px] font-semibold text-altr-mint-bright">
              A
            </span>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-altr-white">
                altr · pricing desk
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-text-3">
                Cross-referenced from Ticket Fairy + market reports + altr deal flow
              </span>
            </div>
          </div>

          <p className="mt-8 text-[18px] leading-[1.55] text-altr-text-2 md:text-[20px]">
            Sponsorship pricing isn&apos;t a single number. It&apos;s a thicket
            of CPM lies, throughput models, and bilateral negotiations that
            split sharply between mature APAC and emerging GCC. Same audience
            size doesn&apos;t mean same price tag — not even close.
          </p>

          <p className="mt-7 text-[15px] leading-[1.75] text-altr-text-2 md:text-[16px]">
            Mature APAC has the inventory but compressed margin. Fuji Rock,
            Seoul World DJ Fest, and the Hong Kong rugby/F1 stack run on
            10–15 year sponsor relationships, prime slots locked years out,
            and incremental brand inventory priced at full markup. Buyers
            entering cold pay the spread.
          </p>

          <p className="mt-5 text-[15px] leading-[1.75] text-altr-text-2 md:text-[16px]">
            Emerging GCC is the inverse. MDLBEAST Soundstorm pulled 600K
            attendees in Riyadh in 2025; Riyadh Season pulled 11M+ over its
            full window. The audience volumes are competitive with anything
            APAC offers — but the inventory pipeline isn&apos;t saturated
            yet, and the title-sponsor slots clear at 30–40% below comparable
            APAC properties.
          </p>

          <blockquote className="mt-10 border-l-4 border-altr-lavender pl-6 text-[20px] leading-[1.5] font-medium text-altr-white md:text-[22px]">
            &ldquo;Pricing follows infrastructure, not eyeballs. The
            arbitrage is in markets where the audience arrived before the
            ad inventory did.&rdquo;
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
            The CPM model — which dominated festival sponsorship for two
            decades — is breaking. Throughput models (cost per engaged minute,
            cost per qualified lead, cost per POS lift) are replacing it on
            the buyer side. The 2025 Ticket Fairy benchmark reports flagged it
            bluntly: CPM lies, throughput tells the truth.
          </p>

          <p className="mt-5 text-[15px] leading-[1.75] text-altr-text-2 md:text-[16px]">
            That shift compounds the APAC/GCC pricing gap. APAC properties
            were priced on CPM and still try to defend those rate cards. GCC
            properties came up after the throughput era — they&apos;re willing
            to anchor deals on RS and milestone-triggered settlement out of
            the gate, which is exactly what most modern sponsors want
            anyway.
          </p>

          <p className="mt-5 text-[15px] leading-[1.75] text-altr-text-2 md:text-[16px]">
            Net read: same audience size, very different deal terms.
            Sophisticated brands are already running parallel pipeline — APAC
            for brand presence at known properties, GCC for performance-linked
            ROI. The geography that wins for the next decade is the one with
            the rail to settle both.
          </p>

          <div className="mt-12 rounded-2xl border border-altr-mint-bright/30 bg-altr-mint/[0.06] p-7 md:p-8">
            <p className="text-[15px] leading-[1.65] text-altr-white md:text-[16px]">
              ALTR matches brands to properties priced on their actual ROI
              math — not their rate card. RS slots, milestone payouts,
              3-second settlement. Built for both sides of the APAC/GCC
              spread.
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
                Ticket Fairy — &ldquo;Festival Sponsorship Pricing Strategy:
                CPM Lies, Throughput Tells the Truth&rdquo; (Aug 2025)
              </li>
              <li>
                Fairs and Festivals Event Sponsorship Benchmarks Insights
                Report 2025 (GlobeNewswire, May 2025)
              </li>
              <li>
                MDLBEAST Soundstorm 2025 attendance — public reporting
              </li>
              <li>
                Saudi Arabia and UAE Lead GCC&apos;s $771M Influencer
                Marketing Revolution (Global Risk Community, 2025)
              </li>
              <li>
                ALTR internal deal-flow analysis · Q1 2026
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
