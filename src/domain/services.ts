import type { Service, ServiceId } from './types'

export const SERVICES: readonly Service[] = [
  { id: 'corte', name: 'Corte Masculino', description: 'Limpeza, modelagem e finalização', durationMin: 30, priceBRL: 45 },
  { id: 'barba', name: 'Barba', description: 'Navalha e toalha quente', durationMin: 20, priceBRL: 30 },
  { id: 'corte-barba', name: 'Corte + Barba', description: 'O combo completo', durationMin: 45, priceBRL: 65 },
  { id: 'hidratacao', name: 'Hidratação', description: 'Tratamento profundo', durationMin: 40, priceBRL: 55 },
  { id: 'corte-hidratacao', name: 'Corte + Hidratação', description: 'Cuidado e estilo', durationMin: 60, priceBRL: 80 },
] as const

export function getServiceById(id: ServiceId): Service {
  const service = SERVICES.find((s) => s.id === id)
  if (!service) {
    throw new Error(`Serviço desconhecido: ${id}`)
  }
  return service
}
