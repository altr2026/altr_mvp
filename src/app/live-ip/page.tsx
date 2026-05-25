import Link from 'next/link'
import { ComparisonTable } from '@/components/landing/ComparisonTable'
import { EarlyAccessForm } from '@/components/landing/EarlyAccessForm'
import { LiveIPCarousel } from '@/components/landing/LiveIPCarousel'
import { RightsholderCapabilities } from '@/components/landing/RightsholderCapabilities'
import { StatsStrip } from '@/components/landing/StatsStrip'
import { Footer } from '@/components/site/Footer'
import { getRightHolders } from '@/lib/mock-data'

export const metadata = {
  title: 'For LIVE IP / Rightsholders — ALTR',
  description:
    'List once. Match with vetted brands. Real-time milestone payouts. ALTR turns your stage into a sponsorship desk that runs on data.',
}

export default async function LiveIPPage() {
  const rightHolders = await getRightHolders()

  return (
    <>
      <section className="px-6 pt-16 pb-14 md:px-8 md:pt-24 md:pb-20">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded border border-altr-mint-bright/30 bg-altr-mint/[0.06] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-altr-mint-bright">
            For LIVE IP / Rightsholders
          </span>
          <h1 className="mt-7 max-w-4xl text-[26px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[34px] lg:text-[44px] lg:tracking-[-0.045em]">
            The brands that fit your audience{' '}
            <span className="text-altr-mint">are already looking.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[13px] leading-[1.5] text-altr-text-2 md:mt-4 md:text-[14px]">
            List once. Match with vetted brands. Get paid faster — milestone
            payouts in seconds, not weeks.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-3 md:mt-14">
            <Link
              href="/list-stage"
              className="rounded-lg bg-altr-mint px-6 py-3 text-[13px] font-semibold text-altr-white transition hover:bg-altr-mint-bright"
            >
              List your stage →
            </Link>
            <Link
              href="#waitlist"
              className="rounded-lg border border-altr-mint-bright/30 bg-altr-mint/[0.08] px-6 py-3 text-[13px] font-semibold text-altr-mint-bright transition hover:border-altr-mint hover:bg-altr-mint/[0.16]"
            >
              Secure your spot
            </Link>
          </div>
        </div>
      </section>

      <StatsStrip />
      <RightsholderCapabilities />

      <section id="live-ip" className="px-6 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[24px] font-semibold tracking-[-0.025em] md:text-[32px]">
            Your peers on ALTR.
          </h2>
          <p className="mt-3 max-w-2xl text-[14px] leading-[1.6] text-altr-text-2 md:text-[15px]">
            Other Live IP already curated on the platform. Full pricing,
            audience, and brand inbound visibility unlock after onboarding.
          </p>
        </div>
      </section>
      <div className="-mt-12">
        <LiveIPCarousel rightHolders={rightHolders} />
      </div>

      <ComparisonTable />
      <EarlyAccessForm initialRole="live-ip" />
      <Footer />
    </>
  )
}
