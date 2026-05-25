'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import type {
  AuthSigninResponse,
  AuthSignupResponse,
  AuthSubmission,
  WaitlistRole,
} from '@/types'
import { isBusinessEmail } from '@/lib/auth-mock'

type Mode = 'login' | 'signup'
type Status = 'idle' | 'submitting' | 'success' | 'error'

// Simulated Google-authenticated cohort user for demo purposes.
const SIMULATED_GOOGLE_EMAIL = 'demo@altr.haus'

const mockWalletAddress = (): string => {
  const part = (n: number) =>
    Math.random().toString(16).slice(2, 2 + n).padEnd(n, '0')
  return `0x${part(16)}`
}

export function ConnectPanel() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [role, setRole] = useState<WaitlistRole>('brand')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const emailFilled = email.trim().length > 0
  const emailIsBusiness = emailFilled && isBusinessEmail(email)
  const emailShowsError = emailFilled && !emailIsBusiness
  const canSubmitForm = emailIsBusiness && status !== 'submitting'

  const reset = (next: Mode) => {
    setMode(next)
    setStatus('idle')
    setMessage('')
  }

  const performAuth = async (
    submissionEmail: string,
    targetMode: Mode,
    includeWallet: boolean,
  ) => {
    setStatus('submitting')
    setMessage('')

    const submission: AuthSubmission = {
      email: submissionEmail,
      // Web3 wallet handshake still happens silently for signup so the
      // server-side flow stays identical — users no longer see it.
      walletAddress: includeWallet ? mockWalletAddress() : null,
      role,
    }
    const endpoint =
      targetMode === 'login' ? '/api/auth/signin' : '/api/auth/signup'

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
        if (targetMode === 'login') {
          window.setTimeout(() => {
            router.push(role === 'brand' ? '/brands' : '/live-ip')
          }, 1200)
        }
      } else {
        setStatus('error')
        setMessage(data.reason)
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Try again or email hello@altr.haus.')
    }
  }

  const submitForm = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmitForm) return
    await performAuth(email.trim(), mode, mode === 'signup')
  }

  const submitGoogle = async () => {
    if (status === 'submitting') return
    await performAuth(SIMULATED_GOOGLE_EMAIL, 'login', false)
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
          ? 'Early-access cohort. Continue with Google or your business email.'
          : 'Business email required. We approve within 48 hours.'}
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-altr-text-3">
          I am a
        </span>
        <div className="grid grid-cols-2 gap-2">
          <RoleButton
            active={role === 'brand'}
            onClick={() => setRole('brand')}
          >
            I&apos;m a Brand
          </RoleButton>
          <RoleButton
            active={role === 'live-ip'}
            onClick={() => setRole('live-ip')}
          >
            I&apos;m a LIVE IP / Rightsholder
          </RoleButton>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-0 overflow-hidden rounded-lg border border-white/[0.08]">
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
        onSubmit={submitForm}
        className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-altr-card p-7"
      >
        <button
          type="button"
          onClick={submitGoogle}
          disabled={status === 'submitting'}
          className="flex items-center justify-center gap-3 rounded-lg border border-white/[0.1] bg-white px-6 py-3 text-[13px] font-semibold text-[#1F1F1F] transition hover:bg-white/95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <Divider label="or" />

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

        <button
          type="submit"
          disabled={!canSubmitForm}
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
      className={`rounded-lg border px-3 py-3 text-center text-[12.5px] font-medium leading-tight transition ${
        active
          ? 'border-altr-mint-bright/60 bg-altr-mint/[0.16] text-altr-mint-bright'
          : 'border-white/[0.08] bg-transparent text-altr-text-2 hover:border-white/[0.16] hover:text-altr-white'
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

function GoogleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      aria-hidden
      className="flex-shrink-0"
    >
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  )
}
