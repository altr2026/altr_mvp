import Link from 'next/link'
import { Footer } from '@/components/site/Footer'

export const metadata = {
  title: 'Sign in — ALTR',
  description:
    'Sign in to ALTR. Magic-link sign-in available to early-access cohort.',
}

export default function ConnectPage() {
  return (
    <>
      <section className="px-6 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-md">
          <span className="inline-flex items-center gap-2 rounded border border-altr-mint-bright/30 bg-altr-mint/[0.06] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-altr-mint-bright">
            Sign in
          </span>
          <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.03em] md:text-[34px]">
            Welcome back.
          </h1>
          <p className="mt-3 text-[14px] leading-[1.55] text-altr-text-2">
            Early-access cohort only. Magic link via email.
          </p>

          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-altr-card p-7">
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-altr-text-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@org.com"
              disabled
              aria-disabled="true"
              className="rounded-lg border border-white/[0.08] bg-altr-bg/60 px-4 py-3 text-[14px] text-altr-white placeholder:text-altr-text-3 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="mt-2 cursor-not-allowed rounded-lg bg-altr-mint/40 px-6 py-3 text-[13px] font-semibold text-altr-white opacity-70"
            >
              Send magic link
            </button>

            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-altr-text-3">
              Auth backend lands with v2
            </p>
          </div>

          <p className="mt-7 text-center text-[13px] text-altr-text-2">
            Don&apos;t have an account?{' '}
            <Link
              href="/#waitlist"
              className="text-altr-mint-bright transition hover:text-altr-lime"
            >
              Request early access →
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </>
  )
}
