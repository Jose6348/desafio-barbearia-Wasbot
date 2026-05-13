import type { Service, ServiceId } from './types'

export const SERVICES: readonly Service[] = [
  { id: 'corte', name: 'Corte Masculino', durationMin: 30, priceBRL: 45 },
  { id: 'barba', name: 'Barba', durationMin: 20, priceBRL: 30 },
  { id: 'corte-barba', name: 'Corte + Barba', durationMin: 45, priceBRL: 65 },
  { id: 'hidratacao', name: 'Hidratação', durationMin: 40, priceBRL: 55 },
  { id: 'corte-hidratacao', name: 'Corte + Hidratação', durationMin: 60, priceBRL: 80 },
] as const

export function getServiceById(id: ServiceId): Service {
  const service = SERVICES.find((s) => s.id === id)
  if (!service) {
    throw new Error(`Serviço desconhecido: ${id}`)
  }
  return service
}
