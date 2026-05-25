import Image from 'next/image'
import Link from 'next/link'

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-demo-border bg-demo-surface px-6 md:px-8">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between py-4">
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
        <nav className="flex items-center gap-5">
          <Link
            href="/insights"
            className="text-[13px] text-demo-text-dim transition hover:text-demo-text"
          >
            Insights
          </Link>
          <Link
            href="/about"
            className="text-[13px] text-demo-text-dim transition hover:text-demo-text"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}
