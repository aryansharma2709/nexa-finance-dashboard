export function NexaWordmark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[18px] border border-line bg-[rgba(255,255,255,0.03)] shadow-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,245,174,0.14),_transparent_62%)]" />
        <span className="relative font-display text-lg font-bold tracking-[0.18em] text-accent">
          N
        </span>
      </div>
      <div>
        <p className="font-display text-lg font-bold tracking-[-0.02em] text-text">Nexa Finance</p>
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-text-subtle">Analytics Console</p>
      </div>
    </div>
  )
}
