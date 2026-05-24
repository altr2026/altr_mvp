export function TypingIndicator() {
  return (
    <div className="flex flex-col gap-2 border-l-2 border-altr-mint-bright/40 pl-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-altr-mint-bright">
        altr
      </div>
      <div className="flex h-6 items-center gap-1">
        <span className="altr-typing-dot inline-block h-1.5 w-1.5 rounded-full bg-altr-mint-bright" />
        <span className="altr-typing-dot inline-block h-1.5 w-1.5 rounded-full bg-altr-mint-bright" />
        <span className="altr-typing-dot inline-block h-1.5 w-1.5 rounded-full bg-altr-mint-bright" />
      </div>
    </div>
  )
}
