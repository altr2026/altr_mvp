import { NextResponse } from 'next/server'
import { runAgentTurn } from '@/lib/conversation'
import type {
  AgentTurnRequest,
  AgentTurnResponse,
  ApiError,
} from '@/types'

export async function POST(
  request: Request,
): Promise<NextResponse<AgentTurnResponse | ApiError>> {
  let body: AgentTurnRequest
  try {
    body = (await request.json()) as AgentTurnRequest
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    )
  }

  if (!body?.state || typeof body.userInput !== 'string') {
    return NextResponse.json(
      { error: 'Missing state or userInput' },
      { status: 400 },
    )
  }

  try {
    const response = await runAgentTurn(body.state, body.userInput)
    return NextResponse.json(response, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Agent turn failed' },
      { status: 500 },
    )
  }
}
