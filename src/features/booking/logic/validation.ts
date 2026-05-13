import { getProfessionalsForService } from '../../../domain/professionals'
import { CLOSING_MINUTES } from '../../../domain/schedule'
import { getServiceById } from '../../../domain/services'
import type {
  Appointment,
  ProfessionalId,
  ServiceId,
} from '../../../domain/types'
import { isSameDay, minutesSinceMidnight } from '../../../shared/lib/date'
import { hhmmToMinutes } from '../../../shared/lib/time'
import { crossesLunch, intervalsOverlap, type Interval } from './overlap'

export type ValidationError =
  | 'professional-cant-do-service'
  | 'past-closing'
  | 'crosses-lunch'
  | 'in-the-past'
  | 'overlap'

type ValidationParams = {
  serviceId: ServiceId
  professionalId: ProfessionalId
  date: string
  startTime: string
  appointments: Appointment[]
  now: Date
}

export function validateAppointment(p: ValidationParams): ValidationError | null {
  const service = getServiceById(p.serviceId)
  const start = hhmmToMinutes(p.startTime)
  const interval: Interval = { start, end: start + service.durationMin }

  const eligible = getProfessionalsForService(p.serviceId).some(
    (prof) => prof.id === p.professionalId,
  )
  if (!eligible) return 'professional-cant-do-service'

  if (interval.end > CLOSING_MINUTES) return 'past-closing'
  if (crossesLunch(interval)) return 'crosses-lunch'

  if (isSameDay(p.date, p.now) && start <= minutesSinceMidnight(p.now)) {
    return 'in-the-past'
  }

  const conflicts = p.appointments.some(
    (appt) =>
      appt.professionalId === p.professionalId &&
      appt.date === p.date &&
      intervalsOverlap(interval, {
        start: hhmmToMinutes(appt.startTime),
        end: hhmmToMinutes(appt.endTime),
      }),
  )
  if (conflicts) return 'overlap'

  return null
}
