import { NextResponse } from 'next/server'
import { getVenues } from '@/lib/mock-data'
import type { ApiError, ApiResponse, Venue } from '@/types'

export async function GET(): Promise<
  NextResponse<ApiResponse<Venue[]> | ApiError>
> {
  try {
    const venues = await getVenues()
    return NextResponse.json({ data: venues }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch venues' },
      { status: 500 },
    )
  }
}
