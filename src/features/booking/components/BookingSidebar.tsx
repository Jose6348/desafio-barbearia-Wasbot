import { getProfessionalById } from '../../../domain/professionals'
import { getServiceById } from '../../../domain/services'
import type {
  Customer,
  ProfessionalChoice,
  ServiceId,
} from '../../../domain/types'
import { parseIsoDate } from '../../../shared/lib/date'

type BookingSidebarProps = {
  serviceId: ServiceId | null
  professional: ProfessionalChoice | null
  date: string | null
  time: string | null
  customer: Customer
  canConfirm: boolean
  error: string | null
  onConfirm: () => void
}

export function BookingSidebar({
  serviceId,
  professional,
  date,
  time,
  customer,
  canConfirm,
  error,
  onConfirm,
}: BookingSidebarProps) {
  const service = serviceId ? getServiceById(serviceId) : null
  const dateLabel = date
    ? parseIsoDate(date).toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
      })
    : null
  const dateTimeLabel = date && time ? `${dateLabel} · ${time}` : (dateLabel ?? '—')
  const profLabel =
    professional === 'any'
      ? 'Qualquer um'
      : professional
        ? getProfessionalById(professional).name
        : '—'

  return (
    <aside className="lg:col-span-4 h-fit lg:sticky lg:top-12">
      <div className="bg-ink text-paper p-8 border-b-8 border-gold">
        <h2 className="font-serif text-2xl mb-6 border-b border-paper/10 pb-4">
          Resumo da reserva
        </h2>
        <Row label="Serviço" value={service?.name ?? '—'} />
        <Row label="Profissional" value={profLabel} />
        <Row label="Data e hora" value={dateTimeLabel} accent />
        <Row label="Cliente" value={customer.name || '—'} />
        <div className="pt-6 mt-6 border-t border-paper/10">
          <div className="flex justify-between items-baseline mb-6">
            <span className="text-[10px] uppercase tracking-widest">Total estimado</span>
            <span className="text-3xl font-serif text-gold">
              R$ {service?.priceBRL ?? 0}
            </span>
          </div>
          {error && <p className="text-xs text-red-300 mb-3">{error}</p>}
          <button
            type="button"
            disabled={!canConfirm}
            onClick={onConfirm}
            className="w-full bg-gold hover:bg-gold-dark disabled:opacity-30 disabled:cursor-not-allowed text-ink font-bold uppercase text-xs tracking-widest py-4 transition-colors"
          >
            Confirmar agendamento
          </button>
          <p className="text-[9px] text-center mt-3 text-paper/30 italic">
            Pague na barbearia após o serviço.
          </p>
        </div>
      </div>
    </aside>
  )
}

function Row({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex justify-between items-start gap-4 mb-5">
      <div className="min-w-0">
        <p className="text-[10px] uppercase text-paper/40 tracking-widest">{label}</p>
        <p className={`font-serif text-lg break-words ${accent ? 'text-gold' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  )
}
