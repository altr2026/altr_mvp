'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'altr_stage_interested_categories'

type Category = {
  id: string
  name: string
  formats: string[]
  brands: string[]
  pitch: string
}

const CATEGORIES: Category[] = [
  {
    id: 'beauty',
    name: 'Beauty',
    formats: ['Booth demo', 'Sampling', 'Experience zone'],
    brands: ['COSRX', 'Anua', 'Laneige', 'Beauty of Joseon'],
    pitch: 'High-touch try-on. Sampling drives same-day conversion.',
  },
  {
    id: 'fashion-lifestyle',
    name: 'Fashion & Lifestyle',
    formats: ['Pop-up store', 'Showroom'],
    brands: ['Gentle Monster', 'ADER ERROR', 'Musinsa', 'Mardi Mercredi'],
    pitch: 'Pop-up over 1–4 weeks. Direct retail revenue, photo-ready set.',
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    formats: ['Wellness consult', 'Sampling', 'Membership drive'],
    brands: ['AmorePacific Wellness', 'ATOMY', 'Korea Ginseng (KGC)'],
    pitch: 'Consult-led activation. High-intent leads, post-event subscription.',
  },
  {
    id: 'art-culture',
    name: 'Art & Culture',
    formats: ['Touring exhibit', 'Installation', 'Gallery partnership'],
    brands: ['Leeum', 'Gallery Hyundai', 'National Museum of Korea'],
    pitch: 'Multi-day exhibit. Cultural lift + premium audience overlap.',
  },
  {
    id: 'entertainment-ip-gaming',
    name: 'Entertainment / IP / Gaming',
    formats: ['Fan activation', 'Demo arcade', 'Cosplay zone'],
    brands: ['HYBE', 'SM Entertainment', 'KRAFTON', 'NEXON'],
    pitch: 'Built-in fan demand. Highest dwell time + UGC volume per square meter.',
  },
  {
    id: 'fnb',
    name: 'F&B',
    formats: ['Tasting', 'Pop-up restaurant', 'Bar takeover'],
    brands: ['Bibigo', 'BBQ Chicken', 'Paris Baguette', 'Jinro'],
    pitch: 'Per-serving revenue + repeat traffic across the activation window.',
  },
  {
    id: 'others',
    name: 'Others',
    formats: ['Hybrid', 'Custom format'],
    brands: ['Hyundai Card', 'Samsung', 'KAKAO', 'Open to proposals'],
    pitch: 'Tell us what your audience is asking for. We source from cohort.',
  },
]

export function SampleBrandCatalog() {
  const [interested, setInterested] = useState<Set<string>>(new Set())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as string[]
        if (Array.isArray(parsed)) setInterested(new Set(parsed))
      }
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  const toggle = (id: string) => {
    setInterested((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  const selectedCount = interested.size

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-altr-white md:text-[20px]">
          Sample brands by category
        </h2>
        <span className="font-mono text-[10.5px] tracking-[0.18em] text-altr-text-3 uppercase">
          {hydrated && selectedCount > 0
            ? `${selectedCount} marked of interest`
            : 'Tap to flag interest'}
        </span>
      </div>
      <p className="-mt-2 max-w-3xl text-[13px] leading-[1.55] text-altr-text-2">
        If you&apos;re open to K-content brands, here&apos;s what shows up at our
        first cohort. Mark any category that fits your stage and ALTR will
        prioritize matches from similar brand profiles.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            active={hydrated && interested.has(cat.id)}
            onToggle={() => toggle(cat.id)}
          />
        ))}
      </div>
    </section>
  )
}

function CategoryCard({
  category,
  active,
  onToggle,
}: {
  category: Category
  active: boolean
  onToggle: () => void
}) {
  return (
    <article
      className="flex flex-col gap-3 rounded-2xl border bg-altr-card p-5 transition"
      style={{
        borderColor: active ? 'rgba(93,202,165,0.45)' : 'rgba(255,255,255,0.07)',
        background: active ? 'rgba(93,202,165,0.06)' : undefined,
      }}
    >
      <header className="flex flex-col gap-1">
        <h3 className="text-[15px] font-bold text-altr-white md:text-[16px]">
          {category.name}
        </h3>
        <p className="text-[11.5px] leading-[1.5] text-altr-text-2">
          {category.pitch}
        </p>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {category.formats.map((f) => (
          <span
            key={f}
            className="rounded-full border border-altr-mint-bright/30 bg-altr-mint/[0.08] px-2 py-0.5 font-mono text-[9.5px] tracking-[0.15em] text-altr-mint-bright uppercase"
          >
            {f}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-1.5 border-t border-white/[0.06] pt-3">
        <span className="font-mono text-[9.5px] tracking-[0.18em] text-altr-text-3 uppercase">
          Representative brands
        </span>
        <div className="flex flex-wrap gap-1.5">
          {category.brands.map((b) => (
            <span
              key={b}
              className="rounded border border-white/[0.08] bg-altr-bg/40 px-2 py-0.5 text-[11px] text-altr-text-2"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="mt-1 rounded-lg border px-3 py-2 text-[12px] font-medium transition"
        style={{
          borderColor: active ? '#5DCAA5' : 'rgba(255,255,255,0.08)',
          background: active ? 'rgba(93,202,165,0.18)' : 'rgba(255,255,255,0.02)',
          color: active ? '#5DCAA5' : 'rgba(255,255,255,0.85)',
        }}
      >
        {active ? '✓ Open to this category' : 'I’d host this →'}
      </button>
    </article>
  )
}
