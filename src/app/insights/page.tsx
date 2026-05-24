import { FromTheLab } from '@/components/landing/FromTheLab'
import { Footer } from '@/components/site/Footer'
import { getInsights } from '@/lib/mock-data'

export const metadata = {
  title: 'Insights — ALTR',
  description:
    'Market data, pricing benchmarks, and trends across ASIA sponsorship.',
}

export default async function InsightsPage() {
  const insights = await getInsights()
  return (
    <>
      <section className="px-6 pt-16 pb-4 md:px-8 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded border border-altr-mint-bright/30 bg-altr-mint/[0.06] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-altr-mint-bright">
            Insights
          </span>
          <h1 className="mt-6 max-w-3xl text-[28px] font-semibold leading-[1.1] tracking-[-0.035em] md:text-[40px]">
            Pricing, deal flow, and{' '}
            <span className="text-altr-mint">market signal</span> from the live
            economy.
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.6] text-altr-text-2">
            A monthly read on ASIA sponsorship. Built from ALTR&apos;s
            POS-tracked deal data and public-source benchmarks.
          </p>
        </div>
      </section>
      <FromTheLab insights={insights} />
      <Footer />
    </>
  )
}
