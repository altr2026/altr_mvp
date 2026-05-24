import Link from 'next/link'
import { Footer } from '@/components/site/Footer'

export const metadata = {
  title: 'About — ALTR',
  description:
    'ALTR is the operating system for sponsorship across ASIA. Match, contract, settle in seconds, and prove ROI from real revenue.',
}

const PILLARS = [
  {
    label: 'Match by mandate',
    body: 'Pre-deal intelligence narrows the right stage for each brand from POS-tracked benchmarks and audience overlap — not catalogue browsing.',
  },
  {
    label: 'Settle in seconds',
    body: 'Milestone-triggered, multi-currency settlement at the speed of a swipe. Cross-border RS deals stop bleeding to multi-day wires and stacked fees.',
  },
  {
    label: 'Prove ROI',
    body: 'POS API pulls actual sales data into ALTR. RS auto-calculates. ROI is the revenue itself, not an impression model.',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="px-6 pt-16 pb-12 md:px-8 md:pt-24 md:pb-16">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded border border-altr-mint-bright/30 bg-altr-mint/[0.06] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-altr-mint-bright">
            About ALTR
          </span>
          <h1 className="mt-6 max-w-4xl text-[28px] font-semibold leading-[1.1] tracking-[-0.035em] md:text-[44px]">
            The operating system{' '}
            <span className="text-altr-mint">for sponsorship</span> across
            ASIA.
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-[1.7] text-altr-text-2 md:text-[16px]">
            Sponsorship is still run on PDF decks, three-week deal cycles, and
            SWIFT wires that arrive a week after the event ends. ALTR replaces
            that stack — match, contract, settle, and measure in one place,
            built for the markets growing fastest.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PILLARS.map((p) => (
              <div
                key={p.label}
                className="rounded-2xl border border-white/[0.06] bg-altr-card p-7"
              >
                <h2 className="text-[18px] font-semibold text-altr-white">
                  {p.label}
                </h2>
                <p className="mt-3 text-[14px] leading-[1.6] text-altr-text-2">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-[24px] font-semibold tracking-[-0.025em] md:text-[34px]">
            Where we&apos;re going.
          </h2>
          <div className="mt-7 space-y-4 text-[14px] leading-[1.7] text-altr-text-2 md:text-[15px]">
            <p>
              ALTR is building toward a future where every sponsorship deal —
              capital or revenue share, single market or cross-border — runs
              through a single programmable rail. Conditions verified on-chain,
              funds released on milestone, RS splits executed in real time.
            </p>
            <p>
              We&apos;re starting with K-content brands entering ASIA stages
              because that wedge fills both sides of the market at once:
              brands buy stage access and bring conversion-ready content with
              them. Every deal that closes makes the next match sharper.
            </p>
            <p className="text-altr-white">
              We&apos;re hiring engineers, BD, and partnership leads across
              Seoul, Dubai, and Riyadh.{' '}
              <Link
                href="mailto:hello@altr.haus"
                className="text-altr-mint-bright underline-offset-4 hover:text-altr-lime hover:underline"
              >
                hello@altr.haus
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
