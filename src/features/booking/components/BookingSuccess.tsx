import { useNavigate } from 'react-router-dom'
import { getProfessionalById } from '../../../domain/professionals'
import { getServiceById } from '../../../domain/services'
import type { Appointment } from '../../../domain/types'
import { parseIsoDate } from '../../../shared/lib/date'

type BookingSuccessProps = {
  appointment: Appointment
  onNewBooking: () => void
}

export function BookingSuccess({ appointment, onNewBooking }: BookingSuccessProps) {
  const navigate = useNavigate()
  const service = getServiceById(appointment.serviceId)
  const professional = getProfessionalById(appointment.professionalId)
  const dateLabel = parseIsoDate(appointment.date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })

  return (
    <main className="flex-1 max-w-3xl mx-auto px-6 md:px-12 py-24 w-full">
      <span className="text-[10px] uppercase tracking-[0.3em] text-gold">
        Confirmado
      </span>
      <h1 className="font-serif text-5xl italic mt-4 mb-8">
        Seu horário está reservado.
      </h1>
      <div className="bg-ink text-paper p-10 border-b-8 border-gold">
        <div className="grid grid-cols-2 gap-y-8">
          <Field label="Serviço" value={service.name} />
          <Field label="Profissional" value={professional.name} />
          <Field
            label="Quando"
            value={`${dateLabel} · ${appointment.startTime}`}
            accent
          />
          <Field label="Total" value={`R$ ${service.priceBRL}`} accent />
          <Field label="Em nome de" value={appointment.customer.name} />
          <Field label="Telefone" value={appointment.customer.phone} />
        </div>
        <p className="text-[10px] text-paper/30 italic mt-10">
          Pague diretamente na barbearia após o serviço.
        </p>
      </div>
      <div className="mt-10 flex gap-4">
        <button
          type="button"
          onClick={() => navigate('/meus-agendamentos')}
          className="bg-ink text-paper px-6 py-3 uppercase text-xs font-bold tracking-widest hover:bg-gold hover:text-ink transition-colors"
        >
          Ver meus horários
        </button>
        <button
          type="button"
          onClick={onNewBooking}
          className="text-xs uppercase tracking-widest text-ink/60 hover:text-gold"
        >
          Fazer outro agendamento
        </button>
      </div>
    </main>
  )
}

function Field({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-paper/40">{label}</p>
      <p className={`font-serif text-2xl ${accent ? 'text-gold' : ''}`}>{value}</p>
    </div>
  )
}
