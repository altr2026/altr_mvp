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
  const [inputValue, setInputValue] = useState('')
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

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { message?: string; stageName?: string }
        | undefined
      const wasOpen = isOpen
      setIsOpen(true)
      const delay = wasOpen ? 0 : 850
      window.setTimeout(() => {
        if (detail?.message) {
          void sendInput(detail.message, detail.message)
        }
      }, delay)
    }
    window.addEventListener('altr:askAgent', handler)
    return () => window.removeEventListener('altr:askAgent', handler)
  }, [isOpen, sendInput])

  if (HIDDEN_ROUTES.includes(pathname)) return null

  const handleOptionClick = (opt: ConversationOption) => {
    if (isLoading) return
    void sendInput(opt.value, opt.label)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed || isLoading) return
    setInputValue('')
    void sendInput(trimmed, trimmed)
  }

  const isConciergeMode = done

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
              {isConciergeMode ? 'Concierge · ask anything' : 'Step 01 · narrow down'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {done && (
              <button
                type="button"
                onClick={reset}
                aria-label="Start over"
                title="Start over"
                className="rounded-md p-1 text-altr-text-2 transition hover:bg-white/[0.06] hover:text-altr-mint-bright"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M3 8a5 5 0 1 1 1.46 3.54M3 13v-3h3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
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
            <div ref={bottomRef} />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-shrink-0 items-center gap-2 border-t border-white/[0.06] bg-altr-bg/40 px-3 py-3"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isConciergeMode
                ? 'Ask about pricing, audience, fit…'
                : 'Type your answer or ask anything…'
            }
            disabled={isLoading}
            className="flex-1 rounded-lg border border-white/[0.08] bg-altr-bg/60 px-3 py-2 text-[13px] text-altr-white placeholder:text-altr-text-3 focus:border-altr-mint-bright/50 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            aria-label="Send"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-altr-mint text-altr-white transition hover:bg-altr-mint-bright disabled:bg-altr-mint/40"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </>
  )
}
