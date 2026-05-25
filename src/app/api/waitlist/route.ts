import { NextResponse } from 'next/server'
import { isBusinessEmail } from '@/lib/auth-mock'
import type { ApiError, WaitlistSubmission } from '@/types'

type WaitlistAck = { ok: true; receivedAt: string }

export async function POST(
  request: Request,
): Promise<NextResponse<WaitlistAck | ApiError>> {
  let body: WaitlistSubmission
  try {
    body = (await request.json()) as WaitlistSubmission
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    )
  }

  if (!body?.email || !body?.role || !body?.orgName) {
    return NextResponse.json(
      { error: 'Missing email, role, or orgName' },
      { status: 400 },
    )
  }

  if (!isBusinessEmail(body.email)) {
    return NextResponse.json(
      {
        error:
          'Please use a business email (no Gmail / Naver / iCloud / etc.). This helps us verify brand and Live IP partners.',
      },
      { status: 422 },
    )
  }

  return NextResponse.json(
    { ok: true, receivedAt: new Date().toISOString() },
    { status: 200 },
  )
}
