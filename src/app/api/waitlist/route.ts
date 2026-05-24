import { NextResponse } from 'next/server'
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

  return NextResponse.json(
    { ok: true, receivedAt: new Date().toISOString() },
    { status: 200 },
  )
}
