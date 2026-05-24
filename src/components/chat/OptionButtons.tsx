'use client'

import type { ConversationOption } from '@/types'

type Props = {
  options: ConversationOption[]
  onSelect: (option: ConversationOption) => void
  disabled?: boolean
}

export function OptionButtons({ options, onSelect, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2 pl-6">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onSelect(opt)}
          disabled={disabled}
          className="rounded-lg border border-altr-mint-bright/30 bg-altr-mint/[0.06] px-3.5 py-2 text-[13px] font-medium text-altr-white transition hover:border-altr-mint-bright hover:bg-altr-mint/[0.16] disabled:cursor-not-allowed disabled:opacity-30"
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
