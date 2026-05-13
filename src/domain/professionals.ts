import type { Professional, ProfessionalId, ServiceId } from './types'

export const PROFESSIONALS: readonly Professional[] = [
  { id: 'carlos', name: 'Carlos', role: 'Especialista em navalha', services: ['corte', 'barba', 'corte-barba'] },
  { id: 'joao', name: 'João', role: 'Mestre clássico', services: ['corte', 'barba', 'hidratacao', 'corte-hidratacao'] },
  { id: 'marina', name: 'Marina', role: 'Visagismo e hidratação', services: ['corte', 'hidratacao'] },
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
