import { hhmmToMinutes } from '../../../shared/lib/time'

type SlotsGridProps = {
  available: string[]
  allDay: string[]
  selected: string | null
  onPick: (time: string) => void
}

export function SlotsGrid({ available, allDay, selected, onPick }: SlotsGridProps) {
  if (allDay.length === 0) {
    return <p className="text-sm text-ink/50">Sem horários para este dia.</p>
  }

  const availableSet = new Set(available)
  const morning = allDay.filter((s) => hhmmToMinutes(s) < 12 * 60)
  const afternoon = allDay.filter((s) => hhmmToMinutes(s) >= 13 * 60)

  return (
    <div className="space-y-4">
      <SlotRow
        label="Manhã"
        slots={morning}
        availableSet={availableSet}
        selected={selected}
        onPick={onPick}
      />
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-ink/10" />
        <span className="text-[10px] uppercase tracking-widest text-ink/40 italic">
          Almoço · 12:00 — 13:00
        </span>
        <div className="flex-1 h-px bg-ink/10" />
      </div>
      <SlotRow
        label="Tarde"
        slots={afternoon}
        availableSet={availableSet}
        selected={selected}
        onPick={onPick}
      />
    </div>
  )
}

type SlotRowProps = {
  label: string
  slots: string[]
  availableSet: Set<string>
  selected: string | null
  onPick: (time: string) => void
}

function SlotRow({ label, slots, availableSet, selected, onPick }: SlotRowProps) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-2">{label}</p>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {slots.map((time) => {
          const isAvailable = availableSet.has(time)
          const isActive = selected === time
          return (
            <button
              key={time}
              type="button"
              disabled={!isAvailable}
              onClick={() => onPick(time)}
              className={`p-3 border text-[11px] transition-colors font-mono ${
                isActive
                  ? 'border-gold bg-gold/15 font-bold text-ink'
                  : isAvailable
                    ? 'border-ink/10 hover:border-gold hover:text-gold bg-white'
                    : 'border-ink/5 bg-ink/[0.03] text-ink/25 line-through cursor-not-allowed'
              }`}
            >
              {time}
            </button>
          )
        })}
      </div>
    </div>
  )
}
