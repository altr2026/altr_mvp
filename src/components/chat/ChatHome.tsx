'use client'

import { useEffect, useRef } from 'react'
import type { ConversationOption } from '@/types'
import { CollectedChips } from './CollectedChips'
import { Message } from './Message'
import { OptionButtons } from './OptionButtons'
import { ResultsList } from './ResultsList'
import { TypingIndicator } from './TypingIndicator'
import { useAgentConversation } from './useAgentConversation'

export function ChatHome() {
  const {
    state,
    messages,
    options,
    results,
    done,
    isLoading,
    sendInput,
    reset,
  } = useAgentConversation()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading, options, results])

  const handleOptionClick = (opt: ConversationOption) => {
    if (done || isLoading) return
    void sendInput(opt.value, opt.label)
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8 md:px-8 md:py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <CollectedChips collected={state.collected} />

        <div className="flex flex-col gap-6">
          {messages.map((m) => (
            <Message key={m.id} role={m.role} content={m.content} />
          ))}
          {isLoading && <TypingIndicator />}
          {!isLoading && options.length > 0 && (
            <OptionButtons options={options} onSelect={handleOptionClick} />
          )}
          {results && results.rightHolders.length > 0 && (
            <ResultsList
              rightHolders={results.rightHolders}
              matches={results.matches}
            />
          )}
          {done && (
            <div className="flex flex-wrap items-center gap-4 border-t border-white/[0.06] pt-5">
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-white/[0.1] px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-altr-text-2 transition hover:border-altr-mint-bright/50 hover:text-altr-mint-bright"
              >
                ↻ start over
              </button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  )
}
