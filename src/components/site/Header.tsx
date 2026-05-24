import Image from 'next/image'
import Link from 'next/link'

type NavItem = {
  label: string
  href?: string
  soon?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'For Brands', href: '/brands' },
  { label: 'For LIVE IP / Rightsholders', href: '/brands' },
  { label: 'For Agencies', soon: true },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-altr-bg/85 px-6 py-4 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-end gap-3 transition hover:opacity-80"
          aria-label="altr home"
        >
          <Image
            src="/altr-logo-white.png"
            alt="altr"
            width={88}
            height={22}
            priority
            className="h-[22px] w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {NAV_ITEMS.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className="text-[13px] text-altr-white transition hover:text-altr-mint-bright"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                className="flex items-center gap-1.5 text-[13px] text-altr-text-2"
              >
                {item.label}
                {item.soon && (
                  <span className="rounded border border-altr-text-3/40 px-1.5 py-[1px] font-mono text-[9px] uppercase tracking-wider text-altr-text-3">
                    Soon
                  </span>
                )}
              </span>
            ),
          )}
          <Link
            href="/connect"
            className="ml-2 rounded-lg border border-white/[0.1] px-3.5 py-1.5 text-[13px] text-altr-white transition hover:border-altr-mint-bright/60 hover:text-altr-mint-bright"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  )
}
