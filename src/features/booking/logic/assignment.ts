import { getProfessionalsForService } from '../../../domain/professionals'
import { SLOT_MINUTES } from '../../../domain/schedule'
import { getServiceById } from '../../../domain/services'
import type {
  Appointment,
  ProfessionalId,
  ServiceId,
} from '../../../domain/types'
import { hhmmToMinutes, minutesToHHmm } from '../../../shared/lib/time'
import { intervalsOverlap, type Interval } from './overlap'
import { generateDaySlots } from './slots'

type AssignmentParams = {
  serviceId: ServiceId
  date: string
  startTime: string
  appointments: Appointment[]
}

// Métrica de "mais disponibilidade": slots de 15min livres restantes no dia
// após este agendamento. Desempate alfabético via ordem em PROFESSIONALS.
export function pickProfessionalForAny(params: AssignmentParams): ProfessionalId {
  const { serviceId, date, startTime, appointments } = params
  const candidates = getProfessionalsForService(serviceId)
  const duration = getServiceById(serviceId).durationMin
  const start = hhmmToMinutes(startTime)
  const interval: Interval = { start, end: start + duration }

  const free = candidates.filter(
    (prof) =>
      !appointments.some(
        (appt) =>
          appt.professionalId === prof.id &&
          appt.date === date &&
          intervalsOverlap(interval, {
            start: hhmmToMinutes(appt.startTime),
            end: hhmmToMinutes(appt.endTime),
          }),
      ),
  )

  if (free.length === 0) {
    throw new Error('Nenhum profissional disponível neste horário')
  }

  const endTime = minutesToHHmm(start + duration)
  const ranked = free
    .map((prof) => ({
      id: prof.id,
      remaining: countFreeBaseSlots(prof.id, date, [
        ...appointments,
        {
          id: '__projected__',
          serviceId,
          professionalId: prof.id,
          date,
          startTime,
          endTime,
          customer: { name: '', phone: '' },
          createdAt: '',
        },
      ]),
      order: candidates.findIndex((p) => p.id === prof.id),
    }))
    .sort((a, b) => {
      if (b.remaining !== a.remaining) return b.remaining - a.remaining
      return a.order - b.order
    })

  return ranked[0].id
}

function countFreeBaseSlots(
  profId: ProfessionalId,
  date: string,
  appointments: Appointment[],
): number {
  const profAppts = appointments.filter(
    (a) => a.professionalId === profId && a.date === date,
  )
  return generateDaySlots().filter((slot) => {
    const start = hhmmToMinutes(slot)
    const slotInterval: Interval = { start, end: start + SLOT_MINUTES }
    return !profAppts.some((appt) =>
      intervalsOverlap(slotInterval, {
        start: hhmmToMinutes(appt.startTime),
        end: hhmmToMinutes(appt.endTime),
      }),
    )
  }).length
}
