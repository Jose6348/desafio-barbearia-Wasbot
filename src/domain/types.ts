export type ServiceId =
  | 'corte'
  | 'barba'
  | 'corte-barba'
  | 'hidratacao'
  | 'corte-hidratacao'

export type ProfessionalId = 'carlos' | 'marina' | 'joao'

export type Service = {
  id: ServiceId
  name: string
  durationMin: number
  priceBRL: number
}

export type Professional = {
  id: ProfessionalId
  name: string
  services: ServiceId[]
}

export type Customer = {
  name: string
  phone: string
}

export type Appointment = {
  id: string
  serviceId: ServiceId
  professionalId: ProfessionalId
  date: string
  startTime: string
  endTime: string
  customer: Customer
  createdAt: string
}

export type ProfessionalChoice = ProfessionalId | 'any'
