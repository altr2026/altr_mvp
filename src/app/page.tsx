import { EarlyAccessForm } from '@/components/landing/EarlyAccessForm'
import { FromTheLab } from '@/components/landing/FromTheLab'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { LiveIPCarousel } from '@/components/landing/LiveIPCarousel'
import { ThreePaths } from '@/components/landing/ThreePaths'
import { WhyWeExist } from '@/components/landing/WhyWeExist'
import { Footer } from '@/components/site/Footer'
import { getInsights, getRightHolders } from '@/lib/mock-data'

export default async function HomePage() {
  const [rightHolders, insights] = await Promise.all([
    getRightHolders(),
    getInsights(),
  ])

  return (
    <>
      <Hero liveIPCount={rightHolders.length} />
      <LiveIPCarousel rightHolders={rightHolders} />
      <ThreePaths />
      <HowItWorks />
      <WhyWeExist />
      <FromTheLab insights={insights} />
      <EarlyAccessForm />
      <Footer />
    </>
  )
}
