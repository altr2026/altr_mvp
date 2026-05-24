type Row = {
  label: string
  today: string
  altr: string
}

const ROWS: Row[] = [
  {
    label: 'Data source',
    today: 'Event self-report',
    altr: 'POS API (ground truth)',
  },
  {
    label: 'Pricing visibility',
    today: 'Hidden until deck call',
    altr: 'Public ranges, live',
  },
  {
    label: 'Settlement',
    today: 'SWIFT · 5-10 days · 3-5% fee',
    altr: 'Real-time · 3 sec · <1%',
  },
  {
    label: 'Cross-border RS',
    today: 'Manual, multi-currency overhead',
    altr: 'Native multi-currency, auto-split',
  },
  {
    label: 'ROI proof',
    today: 'Impressions, modeled',
    altr: 'Revenue, machine-recorded',
  },
]

export function ComparisonTable() {
  return (
    <section className="px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-[24px] font-semibold tracking-[-0.025em] md:text-[32px]">
          The difference, side by side.
        </h2>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08]">
          <div className="grid grid-cols-[1.2fr_1.5fr_1.5fr] gap-px bg-white/[0.06]">
            <div className="bg-altr-bg p-4 md:p-5" />
            <div className="bg-altr-bg p-4 md:p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-altr-text-3">
                Today
              </span>
            </div>
            <div className="bg-altr-bg p-4 md:p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-altr-mint-bright">
                ALTR
              </span>
            </div>
            {ROWS.map((row) => (
              <RowCells key={row.label} row={row} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function RowCells({ row }: { row: Row }) {
  return (
    <>
      <div className="bg-altr-bg p-4 md:p-5">
        <span className="text-[13px] font-medium text-altr-white">
          {row.label}
        </span>
      </div>
      <div className="bg-altr-bg p-4 md:p-5">
        <span className="text-[13px] text-altr-text-2">{row.today}</span>
      </div>
      <div className="bg-altr-bg p-4 md:p-5">
        <span className="text-[13px] text-altr-mint-bright">{row.altr}</span>
      </div>
    </>
  )
}
