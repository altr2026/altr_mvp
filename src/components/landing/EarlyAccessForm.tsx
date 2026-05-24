'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { WaitlistRole, WaitlistSubmission } from '@/types'

const VERTICALS_BRAND = [
  'F&B — restaurant, food product, beverage',
  'Beauty / skincare',
  'Health & wellness',
  'Fashion / streetwear / lifestyle',
  'Entertainment / media / gaming IP',
]

const VERTICALS_LIVE_IP = [
  'Music festival',
  'Conference',
  'Fashion show',
  'Wellness event',
  'Sports event',
  'Mall activation',
  'Hospitality pop-up',
  'Other',
]

const MARKETS_BRAND = [
  'UAE / Saudi Arabia / GCC',
  'Japan',
  'Southeast Asia (SG, TH, MY, ID)',
  'Europe',
  'US',
  'Open to recommendations',
]

const LOCATIONS_LIVE_IP = [
  'UAE',
  'Saudi Arabia',
  'Qatar',
  'Korea',
  'Japan',
  'Singapore',
  'Thailand',
  'Indonesia',
  'Other',
]

const SIZES = [
  'Under 1,000',
  '1,000–10,000',
  '10,000–50,000',
  '50,000+',
]

const BUDGETS = ['Under $50K', '$50K–$250K', '$250K–$1M', '$1M+']

const SPONSORSHIP_FORMATS = [
  'Booth / sampling',
  'Pop-up partnership (RS)',
  'Branded zone',
  'Open to all',
]

const ACTIVATION_WINDOWS = [
  'Q3 2026 (Jul–Sep)',
  'Q4 2026 (Oct–Dec)',
  'H1 2027 (Jan–Jun)',
  'H2 2027 (Jul–Dec)',
  'Flexible',
]

const DURATIONS = [
  'Single event / weekend',
  '1-month residency',
  '3-month season',
  '6–12 month / annual',
  'Open to discuss',
]

type FormProps = {
  initialRole?: WaitlistRole
}

export function EarlyAccessForm({ initialRole = 'live-ip' }: FormProps = {}) {
  const [role, setRole] = useState<WaitlistRole>(initialRole)
  const [email, setEmail] = useState('')
  const [orgName, setOrgName] = useState('')
  const [vertical, setVertical] = useState('')
  const [location, setLocation] = useState('')
  const [sizeBracket, setSizeBracket] = useState('')
  const [budgetBracket, setBudgetBracket] = useState('')
  const [sponsorshipFormat, setSponsorshipFormat] = useState('')
  const [activationWindow, setActivationWindow] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    const submission: WaitlistSubmission = {
      role,
      email,
      orgName,
      vertical: vertical || undefined,
      location: location || undefined,
      sizeBracket: role === 'live-ip' ? sizeBracket || undefined : undefined,
      budgetBracket: role === 'brand' ? budgetBracket || undefined : undefined,
      sponsorshipFormat: sponsorshipFormat || undefined,
      activationWindow: activationWindow || undefined,
      duration: duration || undefined,
      notes: notes || undefined,
    }
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(submission),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setDone(true)
    } catch {
      setError('Submission failed. Try again or email hello@altr.haus.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <section id="waitlist" className="px-6 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl rounded-xl border border-altr-mint-bright/30 bg-altr-mint/[0.06] p-10 text-center">
          <h2 className="text-[24px] font-semibold text-altr-mint-bright md:text-[28px]">
            Thanks. You&apos;re on the list.
          </h2>
          <p className="mt-3 text-[14px] text-altr-text-2">
            We&apos;ll reach out as access opens for your region.
          </p>
        </div>
      </section>
    )
  }

  const sponsorshipFormatLabel =
    role === 'live-ip' ? 'Formats you can host' : 'Sponsorship format'
  const sponsorshipFormatHint =
    role === 'live-ip'
      ? 'What activation types can your venue accommodate?'
      : 'How do you want to show up on stage?'

  return (
    <section id="waitlist" className="px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-[24px] font-semibold tracking-[-0.025em] md:text-[32px]">
          Early access
        </h2>
        <p className="mt-3 max-w-2xl text-[14px] leading-[1.6] text-altr-text-2 md:text-[15px]">
          Join brands and Live IP shaping the rollout. Tell us a little about
          you. We will reach out as access opens for your region.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-5 rounded-xl border border-white/[0.06] bg-altr-card p-7 md:p-8"
        >
          <FieldLabel>I am a</FieldLabel>
          <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-lg border border-white/[0.08]">
            <RoleButton
              active={role === 'live-ip'}
              onClick={() => setRole('live-ip')}
            >
              Live IP
            </RoleButton>
            <RoleButton
              active={role === 'brand'}
              onClick={() => setRole('brand')}
            >
              Brand
            </RoleButton>
          </div>

          <Field
            label="Email"
            value={email}
            onChange={setEmail}
            type="email"
            required
            placeholder="you@org.com"
          />

          <Field
            label={role === 'live-ip' ? 'Live IP name' : 'Brand name'}
            value={orgName}
            onChange={setOrgName}
            required
            placeholder={
              role === 'live-ip'
                ? 'e.g., Marina Crescent Atrium'
                : 'e.g., Lumi Beauty Lab'
            }
          />

          <Select
            label={
              role === 'brand'
                ? 'Brand vertical'
                : 'Live IP vertical'
            }
            value={vertical}
            onChange={setVertical}
            options={
              role === 'brand' ? VERTICALS_BRAND : VERTICALS_LIVE_IP
            }
          />

          <Select
            label={
              role === 'brand'
                ? 'Target market'
                : 'Location'
            }
            hint={
              role === 'brand'
                ? 'Which market are you trying to enter first?'
                : undefined
            }
            value={location}
            onChange={setLocation}
            options={role === 'brand' ? MARKETS_BRAND : LOCATIONS_LIVE_IP}
          />

          {role === 'live-ip' ? (
            <Select
              label="Audience size"
              value={sizeBracket}
              onChange={setSizeBracket}
              options={SIZES}
            />
          ) : (
            <Select
              label="Sponsor budget target"
              value={budgetBracket}
              onChange={setBudgetBracket}
              options={BUDGETS}
            />
          )}

          <Select
            label={sponsorshipFormatLabel}
            hint={sponsorshipFormatHint}
            value={sponsorshipFormat}
            onChange={setSponsorshipFormat}
            options={SPONSORSHIP_FORMATS}
          />

          <Select
            label="Activation window"
            hint="When do you want this live?"
            value={activationWindow}
            onChange={setActivationWindow}
            options={ACTIVATION_WINDOWS}
          />

          <Select
            label="Duration"
            hint="How long does this run?"
            value={duration}
            onChange={setDuration}
            options={DURATIONS}
          />

          <div className="flex flex-col gap-2">
            <FieldLabel>Notes (optional)</FieldLabel>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="rounded-lg border border-white/[0.08] bg-altr-bg/60 px-4 py-3 text-[14px] text-altr-white placeholder:text-altr-text-3 focus:border-altr-mint-bright/60 focus:outline-none"
              placeholder="Anything else we should know?"
            />
          </div>

          {error && <p className="text-[13px] text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !email || !orgName}
            className="mt-2 rounded-lg bg-altr-mint px-6 py-3.5 text-[14px] font-semibold text-altr-white transition hover:bg-altr-mint-bright disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? 'Submitting…' : 'Request early access'}
          </button>

          <p className="text-[12px] text-altr-text-3">
            We will only use your email to share access details. No
            newsletters.
          </p>
        </form>
      </div>
    </section>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-altr-text-2">
      {children}
    </label>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="rounded-lg border border-white/[0.08] bg-altr-bg/60 px-4 py-3 text-[14px] text-altr-white placeholder:text-altr-text-3 focus:border-altr-mint-bright/60 focus:outline-none"
      />
    </div>
  )
}

function Select({
  label,
  hint,
  value,
  onChange,
  options,
  placeholder = 'Select…',
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        <FieldLabel>{label}</FieldLabel>
        {hint && (
          <span className="text-[12px] text-altr-text-3">{hint}</span>
        )}
      </div>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`flex w-full items-center justify-between rounded-lg border bg-altr-bg/60 px-4 py-3 text-left text-[14px] transition focus:outline-none ${
            open
              ? 'border-altr-mint-bright/60'
              : 'border-white/[0.08] hover:border-white/[0.16]'
          }`}
        >
          <span className={value ? 'text-altr-white' : 'text-altr-text-3'}>
            {value || placeholder}
          </span>
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            className={`text-altr-text-3 transition ${
              open ? 'rotate-180 text-altr-mint-bright' : ''
            }`}
            aria-hidden
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {open && (
          <div
            role="listbox"
            className="absolute top-[calc(100%+4px)] right-0 left-0 z-20 max-h-64 overflow-y-auto rounded-lg border border-white/[0.08] bg-altr-card py-1 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
          >
            {options.map((opt) => {
              const isActive = value === opt
              return (
                <button
                  key={opt}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onChange(opt)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-[14px] transition ${
                    isActive
                      ? 'bg-altr-mint/[0.12] text-altr-mint-bright'
                      : 'text-altr-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{opt}</span>
                  {isActive && (
                    <span className="font-mono text-[10px] text-altr-mint-bright">
                      ✓
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function RoleButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-3 text-[13px] font-medium transition ${
        active
          ? 'bg-altr-mint/[0.16] text-altr-mint-bright'
          : 'bg-transparent text-altr-text-3 hover:text-altr-text-2'
      }`}
    >
      {children}
    </button>
  )
}
