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
    if (!isRegisteredWallet(wallet)) {
      return NextResponse.json(
        {
          ok: false,
          reason:
            "Wallet isn't on the access list yet. Request access first.",
        },
        { status: 200 },
      )
    }
    return NextResponse.json(
      {
        ok: true,
        mode: 'wallet',
        message: 'Wallet connected. Session token issued.',
      },
      { status: 200 },
    )
  }

  if (!email || !isBusinessEmail(email)) {
    return NextResponse.json(
      {
        ok: false,
        reason:
          'Business email only — no Gmail / Naver / iCloud / Yahoo / etc.',
      },
      { status: 200 },
    )
  }

  if (!isRegisteredEmail(email)) {
    return NextResponse.json(
      {
        ok: false,
        reason:
          "We don't see you on the early-access list yet. Request access first.",
      },
      { status: 200 },
    )
  }

  return NextResponse.json(
    {
      ok: true,
      mode: 'magic-link',
      message: `Magic link sent to ${email}. Check your inbox to finish signing in.`,
    },
    { status: 200 },
  )
}
