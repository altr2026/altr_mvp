import Link from 'next/link'

type Path = {
  label: string
  body: string
  href?: string
  soon?: boolean
}

const PATHS: Path[] = [
  {
    label: 'For Live IP',
    body: 'List once, match with brands actively looking for your audience.',
    href: '/chat',
  },
  {
    label: 'For brands',
    body: 'Every live stage activation in one place, with transparent pricing and audience data.',
    href: '/chat',
  },
  {
    label: 'For agencies',
    body: 'White-label the platform for your clients. Same workflow, your brand.',
    soon: true,
  },
]

export function ThreePaths() {
  return (
    <section className="px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-[24px] font-semibold tracking-[-0.025em] md:text-[32px]">
          Three paths
        </h2>
        <p className="mt-3 max-w-2xl text-[14px] leading-[1.6] text-altr-text-2 md:text-[15px]">
          One platform, every sponsorship role. Whether you run Live IP, market
          a brand, or service both as an agency.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {PATHS.map((path) => (
            <div
              key={path.label}
              className="flex flex-col rounded-xl border border-white/[0.06] bg-altr-card p-7"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[18px] font-semibold text-altr-white">
                  {path.label}
                </h3>
                {path.soon && (
                  <span className="rounded border border-altr-text-3/40 px-1.5 py-[1px] font-mono text-[9px] uppercase tracking-wider text-altr-text-3">
                    Soon
                  </span>
                )}
              </div>
              <p className="mt-3 flex-1 text-[14px] leading-[1.55] text-altr-text-2">
                {path.body}
              </p>
              {path.href && (
                <Link
                  href={path.href}
                  className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-altr-mint-bright transition hover:text-altr-lime"
                >
                  Learn more →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
