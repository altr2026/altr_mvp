import { NextResponse } from 'next/server'
import { isBusinessEmail } from '@/lib/auth-mock'
import type { ApiError, AuthSignupResponse, AuthSubmission } from '@/types'

export async function POST(
  request: Request,
): Promise<NextResponse<AuthSignupResponse | ApiError>> {
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

  if (!email || !isBusinessEmail(email)) {
    return NextResponse.json(
      { ok: false, reason: 'Please use your business email.' },
      { status: 200 },
    )
  }

  if (!wallet) {
    return NextResponse.json(
      {
        ok: false,
        reason: 'Please connect a Web3 wallet to complete sign-up.',
      },
      { status: 200 },
    )
  }

  return NextResponse.json(
    {
      ok: true,
      message:
        'Access request received. We will confirm cohort approval within 48 hours.',
    },
    { status: 200 },
  )
}
