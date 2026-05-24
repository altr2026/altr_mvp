import { NextResponse } from 'next/server'
import {
  isBusinessEmail,
  isRegisteredEmail,
  isRegisteredWallet,
} from '@/lib/auth-mock'
import type { ApiError, AuthSigninResponse, AuthSubmission } from '@/types'

export async function POST(
  request: Request,
): Promise<NextResponse<AuthSigninResponse | ApiError>> {
  let body: AuthSubmission
  try {
    body = (await request.json()) as AuthSubmission
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    )
  }

  const email = body?.email?.trim() ?? ''
  const wallet = body?.walletAddress?.trim() ?? ''

  if (wallet) {
    if (isRegisteredWallet(wallet)) {
      return NextResponse.json(
        {
          ok: true,
          mode: 'wallet',
          message: 'Wallet recognized. Session token issued.',
        },
        { status: 200 },
      )
    }
    return NextResponse.json(
      {
        ok: false,
        reason:
          'Wallet not in the cohort. Switch to "I\'m new here" to request access.',
      },
      { status: 200 },
    )
  }

  if (!email || !isBusinessEmail(email)) {
    return NextResponse.json(
      { ok: false, reason: 'Please use your business email.' },
      { status: 200 },
    )
  }

  if (!isRegisteredEmail(email)) {
    return NextResponse.json(
      {
        ok: false,
        reason:
          'Email not in the cohort. Switch to "I\'m new here" to request access.',
      },
      { status: 200 },
    )
  }

  return NextResponse.json(
    {
      ok: true,
      mode: 'magic-link',
      message: 'Magic link sent. Check your inbox to finish signing in.',
    },
    { status: 200 },
  )
}
