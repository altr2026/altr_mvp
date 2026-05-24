type Props = {
  words: string[]
  className?: string
}

export function RotatingWord({
  words,
  className = 'text-altr-mint',
}: Props) {
  if (words.length === 0) return null

  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b), '')
  const stack = [...words, words[0]]
  const animClass =
    words.length === 3
      ? 'altr-rotate-3'
      : words.length === 2
        ? 'altr-rotate-2'
        : ''

  return (
    <span
      className="relative inline-block overflow-hidden align-baseline"
      style={{ height: '1.1em', lineHeight: '1.1em' }}
    >
      <span className="invisible whitespace-nowrap" aria-hidden>
        {longest}
      </span>
      <span
        className={`absolute top-0 left-0 flex flex-col ${className} ${animClass}`}
      >
        {stack.map((word, i) => (
          <span
            key={i}
            className="block whitespace-nowrap"
            style={{ height: '1.1em', lineHeight: '1.1em' }}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  )
}
