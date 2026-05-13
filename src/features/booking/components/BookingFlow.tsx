import { useMemo, useState } from 'react'
import { getProfessionalsForService } from '../../../domain/professionals'
import { MAX_DAYS_AHEAD, isClosedWeekday } from '../../../domain/schedule'
import { SERVICES, getServiceById } from '../../../domain/services'
import type {
  Appointment,
  Customer,
  ProfessionalChoice,
  ProfessionalId,
  ServiceId,
} from '../../../domain/types'
import { toIsoDate } from '../../../shared/lib/date'
import { formatPhoneBR, phoneDigits } from '../../../shared/lib/phone'
import { hhmmToMinutes, minutesToHHmm } from '../../../shared/lib/time'
import { useAppointmentsStore } from '../../appointments/store'
import { pickProfessionalForAny } from '../logic/assignment'
import { generateDaySlots, getAvailableSlots } from '../logic/slots'
import { validateAppointment, type ValidationError } from '../logic/validation'
import {
  DayButton,
  ProfButton,
  ServiceCard,
  Step,
  TextField,
} from './BookingControls'
import { BookingSidebar } from './BookingSidebar'
import { BookingSuccess } from './BookingSuccess'
import { SlotsGrid } from './SlotsGrid'

const TOTAL_STEPS = 5

function nextOpenDays(n: number): string[] {
  const result: string[] = []
  const today = new Date()
  for (let i = 0; result.length < n && i < n * 2; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    if (!isClosedWeekday(d)) result.push(toIsoDate(d))
  }
  return result
}

export function BookingFlow() {
  const appointments = useAppointmentsStore((s) => s.appointments)
  const addAppointment = useAppointmentsStore((s) => s.add)

  const [serviceId, setServiceId] = useState<ServiceId | null>(null)
  const [professional, setProfessional] = useState<ProfessionalChoice | null>(null)
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [customer, setCustomer] = useState<Customer>({ name: '', phone: '' })
  const [confirmed, setConfirmed] = useState<Appointment | null>(null)
  const [error, setError] = useState<string | null>(null)

  const days = useMemo(() => nextOpenDays(MAX_DAYS_AHEAD), [])
  const allDaySlots = useMemo(() => generateDaySlots(), [])
  const eligibleProfs = serviceId ? getProfessionalsForService(serviceId) : []

  const availableSlots = useMemo(() => {
    if (!serviceId || !professional || !date) return []
    return getAvailableSlots({
      serviceId,
      professional,
      date,
      appointments,
      now: new Date(),
    })
  }, [serviceId, professional, date, appointments])

  function pickService(id: ServiceId) {
    setServiceId(id)
    setProfessional(null)
    setDate(null)
    setTime(null)
    setError(null)
  }
  function pickProf(choice: ProfessionalChoice) {
    setProfessional(choice)
    setDate(null)
    setTime(null)
    setError(null)
  }
  function pickDate(d: string) {
    setDate(d)
    setTime(null)
    setError(null)
  }

  function reset() {
    setConfirmed(null)
    setServiceId(null)
    setProfessional(null)
    setDate(null)
    setTime(null)
    setCustomer({ name: '', phone: '' })
    setError(null)
  }

  function confirm() {
    setError(null)
    if (!serviceId || !professional || !date || !time) return
    if (!customer.name.trim()) {
      setError('Informe seu nome.')
      return
    }
    if (phoneDigits(customer.phone).length < 10) {
      setError('Telefone inválido. Inclua DDD e número.')
      return
    }

    let resolvedProfId: ProfessionalId
    if (professional === 'any') {
      try {
        resolvedProfId = pickProfessionalForAny({
          serviceId,
          date,
          startTime: time,
          appointments,
        })
      } catch {
        setError('Sem profissional disponível para esse horário.')
        return
      }
    } else {
      resolvedProfId = professional
    }

    const verdict = validateAppointment({
      serviceId,
      professionalId: resolvedProfId,
      date,
      startTime: time,
      appointments,
      now: new Date(),
    })
    if (verdict !== null) {
      setError(translateError(verdict))
      return
    }

    const service = getServiceById(serviceId)
    const startMin = hhmmToMinutes(time)
    const newAppt: Appointment = {
      id: crypto.randomUUID(),
      serviceId,
      professionalId: resolvedProfId,
      date,
      startTime: time,
      endTime: minutesToHHmm(startMin + service.durationMin),
      customer: { name: customer.name.trim(), phone: customer.phone.trim() },
      createdAt: new Date().toISOString(),
    }
    addAppointment(newAppt)
    setConfirmed(newAppt)
  }

  if (confirmed) {
    return <BookingSuccess appointment={confirmed} onNewBooking={reset} />
  }

  const stepNumber = !serviceId
    ? 1
    : !professional
      ? 2
      : !date
        ? 3
        : !time
          ? 4
          : 5

  const canConfirm = Boolean(
    serviceId &&
      professional &&
      date &&
      time &&
      customer.name.trim() &&
      phoneDigits(customer.phone).length >= 10,
  )

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-12 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-8 space-y-10 md:space-y-12 min-w-0">
        <header>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold">
            Etapa {stepNumber} de {TOTAL_STEPS}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl italic mt-2">
            Reserve seu horário
          </h1>
        </header>

        <Step n={1} title="Escolha o serviço">
          <div className="grid sm:grid-cols-2 gap-3">
            {SERVICES.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                active={serviceId === s.id}
                onClick={() => pickService(s.id)}
              />
            ))}
          </div>
        </Step>

        {serviceId && (
          <Step n={2} title="Escolha o profissional">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ProfButton
                active={professional === 'any'}
                onClick={() => pickProf('any')}
                initial="?"
                name="Qualquer um"
                caption="Maior disponibilidade"
              />
              {eligibleProfs.map((p) => (
                <ProfButton
                  key={p.id}
                  active={professional === p.id}
                  onClick={() => pickProf(p.id)}
                  initial={p.name[0]}
                  name={p.name}
                  caption={p.role}
                />
              ))}
            </div>
            {eligibleProfs.length < 3 && (
              <p className="text-[10px] uppercase tracking-widest text-ink/40 mt-3">
                Mostrando apenas profissionais que executam este serviço.
              </p>
            )}
          </Step>
        )}

        {serviceId && professional && (
          <Step n={3} title="Escolha a data">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {days.map((d) => (
                <DayButton
                  key={d}
                  iso={d}
                  active={date === d}
                  onClick={() => pickDate(d)}
                />
              ))}
            </div>
          </Step>
        )}

        {serviceId && professional && date && (
          <Step n={4} title="Escolha o horário">
            <SlotsGrid
              available={availableSlots}
              allDay={allDaySlots}
              selected={time}
              onPick={setTime}
            />
          </Step>
        )}

        {serviceId && professional && date && time && (
          <Step n={5} title="Seus dados">
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField
                label="Nome completo"
                value={customer.name}
                onChange={(v) => setCustomer({ ...customer, name: v })}
                maxLength={60}
              />
              <TextField
                label="Telefone"
                value={customer.phone}
                onChange={(v) => setCustomer({ ...customer, phone: formatPhoneBR(v) })}
                placeholder="(11) 99999-9999"
                maxLength={15}
                inputMode="tel"
              />
            </div>
          </Step>
        )}
      </div>

      <BookingSidebar
        serviceId={serviceId}
        professional={professional}
        date={date}
        time={time}
        customer={customer}
        canConfirm={canConfirm}
        error={error}
        onConfirm={confirm}
      />
    </main>
  )
}

function translateError(e: ValidationError): string {
  switch (e) {
    case 'professional-cant-do-service':
      return 'Esse profissional não realiza este serviço.'
    case 'past-closing':
      return 'Esse horário ultrapassa o expediente.'
    case 'crosses-lunch':
      return 'Esse horário conflita com o intervalo de almoço.'
    case 'in-the-past':
      return 'Esse horário já passou.'
    case 'overlap':
      return 'Esse horário já está ocupado.'
  }
}
