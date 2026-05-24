'use client'

import { useEffect, useRef, useState } from 'react'
import type {
  AgentTurnRequest,
  AgentTurnResponse,
  ConversationOption,
  ConversationState,
  Match,
  RightHolder,
} from '@/types'

export type ChatMessage = {
  id: string
  role: 'agent' | 'user'
  content: string
}

export type AgentResults = {
  rightHolders: RightHolder[]
  matches: Match[]
}

const newSessionId = (): string =>
  `s_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`

const freshState = (): ConversationState => ({
  sessionId: newSessionId(),
  step: 'intro',
  collected: {},
})

const randomId = (): string => Math.random().toString(36).slice(2, 12)

export function useAgentConversation(autoStart = true) {
  const [state, setState] = useState<ConversationState>(freshState)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [options, setOptions] = useState<ConversationOption[]>([])
  const [results, setResults] = useState<AgentResults | null>(null)
  const [done, setDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const stateRef = useRef(state)
  const initRanRef = useRef(false)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const callAgent = async (
    fromState: ConversationState,
    userInput: string,
  ): Promise<AgentTurnResponse> => {
    const req: AgentTurnRequest = { state: fromState, userInput }
    const res = await fetch('/api/agent/turn', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as AgentTurnResponse
  }

  const sendInput = async (userInput: string, displayUserText?: string) => {
    if (isLoading) return
    setIsLoading(true)
    setOptions([])
    if (displayUserText) {
      setMessages((prev) => [
        ...prev,
        { id: randomId(), role: 'user', content: displayUserText },
      ])
    }
    try {
      const payload = await callAgent(stateRef.current, userInput)
      setState(payload.state)
      setMessages((prev) => [
        ...prev,
        { id: randomId(), role: 'agent', content: payload.reply },
      ])
      setOptions(payload.options ?? [])
      if (payload.results) setResults(payload.results)
      setDone(payload.done)
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: randomId(),
          role: 'agent',
          content: 'Connection failed. Refresh to try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initRanRef.current || !autoStart) return
    initRanRef.current = true
    void sendInput('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart])

  const reset = () => {
    window.location.reload()
  }

  return {
    state,
    messages,
    options,
    results,
    done,
    isLoading,
    sendInput,
    reset,
  }
}
