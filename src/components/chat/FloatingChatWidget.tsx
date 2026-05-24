'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { ConversationOption } from '@/types'
import { CollectedChips } from './CollectedChips'
import { Message } from './Message'
import { OptionButtons } from './OptionButtons'
import { ResultsList } from './ResultsList'
import { TypingIndicator } from './TypingIndicator'
import { useAgentConversation } from './useAgentConversation'

const HIDDEN_ROUTES = ['/chat']

export function FloatingChatWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const {
    state,
    messages,
    options,
    results,
    done,
    isLoading,
    sendInput,
    reset,
  } = useAgentConversation(isOpen)

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading, options, results, isOpen])

  if (HIDDEN_ROUTES.includes(pathname)) return null

  const handleOptionClick = (opt: ConversationOption) => {
    if (done || isLoading) return
    void sendInput(opt.value, opt.label)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open ALTR agent"
        className={`fixed right-5 bottom-5 z-40 flex items-center gap-3 rounded-full border border-altr-mint-bright/40 bg-altr-card px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur transition-all hover:border-altr-mint-bright hover:bg-altr-mint/[0.1] md:right-6 md:bottom-6 ${
          isOpen ? 'pointer-events-none scale-95 opacity-0' : 'opacity-100'
        }`}
      >
        <span className="relative flex h-2.5 w-2.5 flex-shrink-0 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-altr-lime opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-altr-lime" />
        </span>
        <span className="font-mono text-[10px] tracking-[0.22em] text-altr-mint-bright uppercase">
          Live
        </span>
        <span className="text-[13px] font-medium text-altr-white">
          Ask ALTR agent
        </span>
      </button>

      <div
        className={`fixed right-5 bottom-5 z-50 flex h-[min(640px,calc(100vh-2.5rem))] w-[min(420px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-altr-card shadow-[0_20px_60px_rgba(0,0,0,0.7)] transition-all md:right-6 md:bottom-6 ${
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-altr-lime opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-altr-lime" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.22em] text-altr-mint-bright uppercase">
              ALTR Agent
            </span>
            <span className="hidden font-mono text-[9px] tracking-[0.2em] text-altr-text-3 uppercase sm:inline">
              Step 01 · narrow down
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close ALTR agent"
            className="rounded-md p-1 text-altr-text-2 transition hover:bg-white/[0.06] hover:text-altr-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <CollectedChips collected={state.collected} />
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
                compact
              />
            )}
            {done && (
              <button
                type="button"
                onClick={reset}
                className="self-start rounded-lg border border-white/[0.1] px-3 py-2 font-mono text-[10px] tracking-[0.22em] text-altr-text-2 uppercase transition hover:border-altr-mint-bright/50 hover:text-altr-mint-bright"
              >
                ↻ start over
              </button>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
    </>
  )
}
