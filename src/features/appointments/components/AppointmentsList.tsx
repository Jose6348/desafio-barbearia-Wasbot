import { Link } from 'react-router-dom'
import { getProfessionalById } from '../../../domain/professionals'
import { getServiceById } from '../../../domain/services'
import type { Appointment } from '../../../domain/types'
import { parseIsoDate } from '../../../shared/lib/date'
import { hhmmToMinutes } from '../../../shared/lib/time'
import { useAppointmentsStore } from '../store'

function appointmentEnd(appt: Appointment): Date {
  const d = parseIsoDate(appt.date)
  const endMin = hhmmToMinutes(appt.endTime)
  d.setHours(Math.floor(endMin / 60), endMin % 60, 0, 0)
  return d
}

export function AppointmentsList() {
  const appointments = useAppointmentsStore((s) => s.appointments)
  const remove = useAppointmentsStore((s) => s.remove)
  const now = new Date()

  const sorted = [...appointments].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return hhmmToMinutes(a.startTime) - hhmmToMinutes(b.startTime)
  })
  const upcoming = sorted.filter((a) => appointmentEnd(a) >= now)
  const past = sorted.filter((a) => appointmentEnd(a) < now).reverse()

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-12 py-16">
      <header className="mb-12 flex items-end justify-between flex-wrap gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold">
            Sua agenda
          </span>
          <h1 className="font-serif text-5xl italic mt-2">Meus horários</h1>
        </div>
        <Link
          to="/agendar"
          className="bg-ink text-paper px-6 py-3 uppercase text-xs font-bold tracking-widest hover:bg-gold hover:text-ink transition-colors"
        >
          Novo agendamento
        </Link>
      </header>

      {appointments.length === 0 && (
        <div className="border border-dashed border-ink/15 p-16 text-center">
          <p className="font-serif text-2xl italic mb-3">Nenhum horário reservado.</p>
          <p className="text-sm text-ink/50 mb-8">Que tal começar agora?</p>
          <Link
            to="/agendar"
            className="inline-block bg-gold text-ink px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-gold-dark"
          >
            Agendar
          </Link>
        </div>
      )}

      {upcoming.length > 0 && (
        <Section title="Próximos">
          {upcoming.map((a) => (
            <AppointmentCard
              key={a.id}
              appointment={a}
              onRemove={() => remove(a.id)}
              cancellable
            />
          ))}
        </Section>
      )}

      {past.length > 0 && (
        <Section title="Histórico">
          {past.map((a) => (
            <AppointmentCard
              key={a.id}
              appointment={a}
              onRemove={() => remove(a.id)}
              dimmed
            />
          ))}
        </Section>
      )}
    </main>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-12">
      <h2 className="text-[10px] uppercase tracking-[0.3em] text-ink/40 mb-4">
        {title}
      </h2>
      <div className="divide-y divide-ink/5 border-y border-ink/10">{children}</div>
    </section>
  )
}

function AppointmentCard({
  appointment,
  onRemove,
  cancellable,
  dimmed,
}: {
  appointment: Appointment
  onRemove: () => void
  cancellable?: boolean
  dimmed?: boolean
}) {
  const service = getServiceById(appointment.serviceId)
  const professional = getProfessionalById(appointment.professionalId)
  const dateLabel = parseIsoDate(appointment.date).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })

  return (
    <div
      className={`grid grid-cols-12 gap-4 items-center py-6 ${
        dimmed ? 'opacity-50' : ''
      }`}
    >
      <div className="col-span-3 md:col-span-2">
        <div className="border-l-4 border-gold pl-4">
          <p className="font-serif text-2xl text-gold leading-none">
            {appointment.startTime}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-ink/40 mt-1">
            {dateLabel}
          </p>
        </div>
      </div>
      <div className="col-span-9 md:col-span-7">
        <p className="font-serif text-xl">{service.name}</p>
        <p className="text-xs text-ink/50 mt-1">
          com {professional.name} · {service.durationMin} min · {appointment.customer.name}
        </p>
      </div>
      <div className="col-span-6 md:col-span-2 text-left md:text-right">
        <p className="font-serif text-xl text-ink">R$ {service.priceBRL}</p>
      </div>
      <div className="col-span-6 md:col-span-1 text-right">
        <button
          type="button"
          onClick={onRemove}
          className="text-[10px] uppercase tracking-widest text-ink/40 hover:text-red-700 transition-colors"
        >
          {cancellable ? 'Cancelar' : 'Remover'}
        </button>
      </div>
    </div>
  )
}
