import type { Professional, ProfessionalId, ServiceId } from './types'

export const PROFESSIONALS: readonly Professional[] = [
  { id: 'carlos', name: 'Carlos', services: ['corte', 'barba', 'corte-barba'] },
  { id: 'joao', name: 'João', services: ['corte', 'barba', 'hidratacao', 'corte-hidratacao'] },
  { id: 'marina', name: 'Marina', services: ['corte', 'hidratacao'] },
] as const

export function getProfessionalById(id: ProfessionalId): Professional {
  const professional = PROFESSIONALS.find((p) => p.id === id)
  if (!professional) {
    throw new Error(`Profissional desconhecido: ${id}`)
  }
  return professional
}

export function getProfessionalsForService(serviceId: ServiceId): Professional[] {
  return PROFESSIONALS.filter((p) => p.services.includes(serviceId))
}
