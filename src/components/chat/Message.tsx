type Props = {
  role: 'agent' | 'user'
  content: string
}

export function Message({ role, content }: Props) {
  if (role === 'agent') {
    return (
      <div className="flex flex-col gap-2 border-l-2 border-altr-mint-bright/40 pl-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-altr-mint-bright">
          altr
        </div>
        <div className="text-[15px] leading-[1.55] text-altr-white">
          {content}
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-altr-text-3">
        you
      </div>
      <div className="max-w-[80%] rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[14px] leading-[1.55] text-altr-cream">
        {content}
      </div>
    </div>
  )
}
