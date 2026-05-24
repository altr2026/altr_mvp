import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.06] px-6 py-14 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-3">
          <Image
            src="/altr-logo-white.png"
            alt="altr"
            width={88}
            height={22}
            className="h-[22px] w-auto"
          />
          <p className="max-w-xs text-[13px] leading-[1.55] text-altr-text-2">
            Cross-border infrastructure for Live IP and brands across ASIA.
          </p>
        </div>

        <FooterColumn title="Product">
          <FooterLink href="/chat">Live IP</FooterLink>
          <FooterLink href="/chat">Brands</FooterLink>
          <FooterLink href="#waitlist">Insights</FooterLink>
        </FooterColumn>

        <FooterColumn title="Company">
          <FooterLink href="#waitlist">About</FooterLink>
          <FooterLink href="mailto:hello@altr.haus">Contact</FooterLink>
        </FooterColumn>

        <FooterColumn title="Connect">
          <FooterLink href="https://twitter.com/altr2026" external>
            Twitter
          </FooterLink>
          <FooterLink href="https://linkedin.com/company/altr2026" external>
            LinkedIn
          </FooterLink>
          <FooterLink href="https://github.com/altr2026" external>
            GitHub
          </FooterLink>
        </FooterColumn>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl items-center justify-between gap-4 border-t border-white/[0.04] pt-8">
        <p className="text-[12px] text-altr-text-3">
          © 2026 ALTR. All rights reserved.
        </p>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-text-3">
          ASIA
        </span>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-text-3">
        {title}
      </p>
      {children}
    </div>
  )
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string
  children: React.ReactNode
  external?: boolean
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[13px] text-altr-text-2 transition hover:text-altr-white"
      >
        {children}
      </a>
    )
  }
  return (
    <Link
      href={href}
      className="text-[13px] text-altr-text-2 transition hover:text-altr-white"
    >
      {children}
    </Link>
  )
}
