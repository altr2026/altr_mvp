'use client'

import { useState, type FormEvent } from 'react'
import type {
  AuthSigninResponse,
  AuthSignupResponse,
  AuthSubmission,
} from '@/types'
import { isBusinessEmail, maskAddress } from '@/lib/auth-mock'

type Mode = 'login' | 'signup'
type Status = 'idle' | 'submitting' | 'success' | 'error'

const mockWalletAddress = (): string => {
  const part = (n: number) =>
    Math.random().toString(16).slice(2, 2 + n).padEnd(n, '0')
  return `0x${part(16)}`
}

export function ConnectPanel() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const emailFilled = email.trim().length > 0
  const emailIsBusiness = emailFilled && isBusinessEmail(email)
  const emailShowsError = emailFilled && !emailIsBusiness

  const canLogin =
    (emailIsBusiness || !!walletAddress) && status !== 'submitting'
  const canSignup =
    emailIsBusiness && !!walletAddress && status !== 'submitting'

  const reset = (next: Mode) => {
    setMode(next)
    setStatus('idle')
    setMessage('')
  }

  const connectWallet = () => {
    setWalletAddress(mockWalletAddress())
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return
    if (mode === 'login' && !canLogin) return
    if (mode === 'signup' && !canSignup) return

    setStatus('submitting')
    setMessage('')

    const submission: AuthSubmission = {
      email: email.trim(),
      walletAddress: walletAddress ?? null,
    }
    const endpoint = mode === 'login' ? '/api/auth/signin' : '/api/auth/signup'

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(submission),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as
        | AuthSigninResponse
        | AuthSignupResponse
      if (data.ok) {
        setStatus('success')
        setMessage(data.message)
      } else {
        setStatus('error')
        setMessage(data.reason)
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Try again or email hello@altr.haus.')
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <span className="inline-flex items-center gap-2 rounded border border-altr-mint-bright/30 bg-altr-mint/[0.06] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-altr-mint-bright">
        {mode === 'login' ? 'Sign in' : 'Request access'}
      </span>
      <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.03em] md:text-[34px]">
        {mode === 'login' ? 'Welcome back.' : "Let's get you in."}
      </h1>
      <p className="mt-3 text-[14px] leading-[1.55] text-altr-text-2">
        {mode === 'login'
          ? 'Early-access cohort. Use your business email or connect your wallet.'
          : 'Business email + Web3 wallet required. We approve within 48 hours.'}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-0 overflow-hidden rounded-lg border border-white/[0.08]">
        <ModeButton active={mode === 'login'} onClick={() => reset('login')}>
          I have access
        </ModeButton>
        <ModeButton
          active={mode === 'signup'}
          onClick={() => reset('signup')}
        >
          I&apos;m new here
        </ModeButton>
      </div>

      <form
        onSubmit={submit}
        className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-altr-card p-7"
      >
        <FieldLabel htmlFor="auth-email">Business email</FieldLabel>
        <input
          id="auth-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          className={`rounded-lg border bg-altr-bg/60 px-4 py-3 text-[14px] text-altr-white placeholder:text-altr-text-3 focus:outline-none ${
            emailShowsError
              ? 'border-red-500/50 focus:border-red-500/70'
              : 'border-white/[0.08] focus:border-altr-mint-bright/60'
          }`}
        />
        {emailShowsError && (
          <p className="text-[12px] text-red-400">
            Business email only — no Gmail, Naver, Yahoo, etc.
          </p>
        )}

        <Divider
          label={mode === 'signup' ? '+ also required' : 'or'}
        />

        {walletAddress ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-altr-mint-bright/40 bg-altr-mint/[0.08] px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="altr-pulse-dot inline-block h-2 w-2 flex-shrink-0 rounded-full bg-altr-lime" />
              <span className="font-mono text-[13px] text-altr-mint-bright">
                {maskAddress(walletAddress)}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-altr-text-3">
                connected
              </span>
            </div>
            <button
              type="button"
              onClick={() => setWalletAddress(null)}
              className="font-mono text-[10px] uppercase tracking-wider text-altr-text-3 transition hover:text-altr-white"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={connectWallet}
            className="flex items-center justify-center gap-2.5 rounded-lg border border-white/[0.1] bg-altr-bg/60 px-6 py-3 text-[13px] font-medium text-altr-white transition hover:border-altr-mint-bright/40 hover:text-altr-mint-bright"
          >
            <WalletIcon />
            Connect Web3 wallet
          </button>
        )}

        <button
          type="submit"
          disabled={
            status === 'submitting' ||
            (mode === 'login' ? !canLogin : !canSignup)
          }
          className="mt-3 rounded-lg bg-altr-mint px-6 py-3 text-[13px] font-semibold text-altr-white transition hover:bg-altr-mint-bright disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === 'submitting'
            ? 'Working…'
            : mode === 'login'
              ? 'Sign in'
              : 'Request access'}
        </button>

        {status === 'success' && (
          <p className="mt-2 rounded-lg border border-altr-mint-bright/30 bg-altr-mint/[0.08] px-3 py-2.5 text-[12.5px] leading-[1.5] text-altr-mint-bright">
            ✓ {message}
          </p>
        )}
        {status === 'error' && (
          <p className="mt-2 rounded-lg border border-red-500/30 bg-red-500/[0.08] px-3 py-2.5 text-[12.5px] leading-[1.5] text-red-400">
            {message}
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-[13px] text-altr-text-2">
        {mode === 'login' ? (
          <>
            No access yet?{' '}
            <button
              type="button"
              onClick={() => reset('signup')}
              className="text-altr-mint-bright transition hover:text-altr-lime"
            >
              Request access →
            </button>
          </>
        ) : (
          <>
            Already in the cohort?{' '}
            <button
              type="button"
              onClick={() => reset('login')}
              className="text-altr-mint-bright transition hover:text-altr-lime"
            >
              Sign in →
            </button>
          </>
        )}
      </p>
    </div>
  )
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-mono text-[10px] uppercase tracking-[0.2em] text-altr-text-2"
    >
      {children}
    </label>
  )
}

function ModeButton({
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
      className={`py-2.5 text-[13px] font-medium transition ${
        active
          ? 'bg-altr-mint/[0.16] text-altr-mint-bright'
          : 'bg-transparent text-altr-text-3 hover:text-altr-text-2'
      }`}
    >
      {children}
    </button>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div className="my-3 flex items-center gap-3">
      <span className="h-px flex-1 bg-white/[0.06]" />
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-altr-text-3">
        {label}
      </span>
      <span className="h-px flex-1 bg-white/[0.06]" />
    </div>
  )
}

function WalletIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <rect
        x="1.5"
        y="3"
        width="11"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M1.5 5h11"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="10" cy="8" r="0.8" fill="currentColor" />
    </svg>
  )
}
