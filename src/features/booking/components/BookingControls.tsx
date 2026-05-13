import type { Service } from '../../../domain/types'
import { parseIsoDate } from '../../../shared/lib/date'

export function Step({
  n,
  title,
  children,
}: {
  n: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <span className="size-6 rounded-full border border-ink flex items-center justify-center text-[10px] font-bold">
          {String(n).padStart(2, '0')}
        </span>
        <h2 className="uppercase tracking-widest font-semibold text-sm">{title}</h2>
      </div>
      {children}
    </section>
  )
}

export function ServiceCard({
  service,
  active,
  onClick,
}: {
  service: Service
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between p-5 border text-left transition-all ${
        active ? 'border-gold bg-gold/5' : 'border-ink/10 hover:border-gold bg-white'
      }`}
    >
      <div>
        <h3 className="font-serif text-lg">{service.name}</h3>
        <p className="text-xs text-ink/50 mt-1">
          {service.durationMin} min · {service.description}
        </p>
      </div>
      <span className="text-gold font-serif text-xl">R$ {service.priceBRL}</span>
    </button>
  )
}

export function ProfButton({
  active,
  onClick,
  initial,
  name,
  caption,
}: {
  active: boolean
  onClick: () => void
  initial: string
  name: string
  caption: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 border flex flex-col items-center gap-3 transition-all ${
        active ? 'border-gold bg-gold text-ink' : 'border-ink/10 hover:border-gold bg-white'
      }`}
    >
      <div className="size-12 rounded-full bg-ink text-gold flex items-center justify-center font-serif text-xl">
        {initial}
      </div>
      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-widest">{name}</div>
        <div
          className={`text-[9px] uppercase tracking-widest mt-1 ${
            active ? 'text-ink/70' : 'text-ink/40'
          }`}
        >
          {caption}
        </div>
      </div>
    </button>
  )
}

export function DayButton({
  iso,
  active,
  onClick,
}: {
  iso: string
  active: boolean
  onClick: () => void
}) {
  const d = parseIsoDate(iso)
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 w-16 py-3 border text-center transition-colors ${
        active ? 'border-gold bg-gold/10 text-ink' : 'border-ink/10 hover:border-gold bg-white'
      }`}
    >
      <div className="text-[10px] uppercase tracking-widest text-ink/50">
        {d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
      </div>
      <div className="font-serif text-xl">{d.getDate()}</div>
      <div className="text-[9px] uppercase tracking-widest text-ink/40">
        {d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
      </div>
    </button>
  )
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-widest text-ink/40 mb-2">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-ink/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-gold"
      />
    </label>
  )
}
