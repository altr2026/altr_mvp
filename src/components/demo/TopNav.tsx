import Image from 'next/image'
import Link from 'next/link'

type NavItem = {
  label: string
  href?: string
  soon?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'For Brands', href: '/brands' },
  { label: 'For LIVE IP / Rightsholders', href: '/live-ip' },
  { label: 'For Agencies', soon: true },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
]

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-demo-border bg-demo-surface/85 px-6 py-4 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="altr home"
          className="inline-flex items-end transition hover:opacity-80"
        >
          <Image
            src="/altr-logo-white.png"
            alt="altr"
            width={64}
            height={22}
            priority
            className="h-[20px] w-auto md:h-[22px]"
          />
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {NAV_ITEMS.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className="text-[13px] text-demo-text transition hover:text-demo-teal"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                className="flex items-center gap-1.5 text-[13px] text-demo-text-dim"
              >
                {item.label}
                {item.soon && (
                  <span className="rounded border border-demo-text-faint/40 px-1.5 py-[1px] font-mono text-[9px] tracking-wider text-demo-text-faint uppercase">
                    Soon
                  </span>
                )}
              </span>
            ),
          )}
          <Link
            href="/connect"
            className="ml-2 rounded-lg border border-demo-border px-3.5 py-1.5 text-[13px] text-demo-text transition hover:border-demo-teal/60 hover:text-demo-teal"
          >
            Sign in
          </Link>
        </nav>
        <nav className="flex items-center gap-4 md:hidden">
          <Link
            href="/brands"
            className="text-[13px] text-demo-text transition hover:text-demo-teal"
          >
            Brands
          </Link>
          <Link
            href="/live-ip"
            className="text-[13px] text-demo-text transition hover:text-demo-teal"
          >
            Live IP
          </Link>
        </nav>
      </div>
    </header>
  )
}
