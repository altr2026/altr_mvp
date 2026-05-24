import { ConnectPanel } from '@/components/auth/ConnectPanel'
import { Footer } from '@/components/site/Footer'

export const metadata = {
  title: 'Sign in — ALTR',
  description:
    'Sign in to ALTR. Magic link via business email or Web3 wallet, for the early-access cohort.',
}

export default function ConnectPage() {
  return (
    <>
      <section className="px-6 pt-8 pb-20 md:px-8 md:pt-12 md:pb-28">
        <ConnectPanel />
      </section>
      <Footer />
    </>
  )
}
