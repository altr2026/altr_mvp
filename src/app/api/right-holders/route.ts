import { NextResponse } from 'next/server'
import { getRightHolders } from '@/lib/mock-data'
import type { ApiError, ApiResponse, RightHolder } from '@/types'

export async function GET(): Promise<
  NextResponse<ApiResponse<RightHolder[]> | ApiError>
> {
  try {
    const rightHolders = await getRightHolders()
    return NextResponse.json({ data: rightHolders }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch right holders' },
      { status: 500 },
    )
  }
}
