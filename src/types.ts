// ---- Tipos del dominio: Predicación Pública (exhibidores / carritos) ----

export type TipoPunto = 'carrito' | 'pendon'

// Hay UN solo turno por día: bloque de dos horas, 8:00 a 10:00.
export const TURNO = '08:00–10:00'

// Días de la semana tipo (lunes a viernes). 1=Lun ... 5=Vie
export const DIAS_SEMANA = [
  { n: 1, corto: 'Lun', largo: 'Lunes' },
  { n: 2, corto: 'Mar', largo: 'Martes' },
  { n: 3, corto: 'Mié', largo: 'Miércoles' },
  { n: 4, corto: 'Jue', largo: 'Jueves' },
  { n: 5, corto: 'Vie', largo: 'Viernes' },
] as const

export interface Punto {
  id: string
  nombre: string
  tipo: TipoPunto
  familia: string
  lugarRetiro: string
  lugarAsignacion: string
  operaSemana: boolean // ¿funciona de lunes a viernes?
  operaSabado: boolean // ¿funciona el sábado?
  activo: boolean
}

export interface Hermano {
  id: string
  nombre: string
  esAdmin: boolean
  puntoPreferidoId?: string
  activo: boolean
}

// Disponibilidad de un hermano para un mes (semana tipo + sábados exactos)
export interface Disponibilidad {
  hermanoId: string
  mesId: string
  // semana tipo: qué días (1-5) puede el turno único 8–10
  semana: number[]
  // sábados exactos en formato ISO 'YYYY-MM-DD'
  sabados: string[]
  puntoPreferidoId?: string
  nota?: string
  enviada: boolean // ¿el hermano confirmó/envió su disponibilidad?
  actualizado: string // ISO datetime
}

export interface Mes {
  id: string // 'YYYY-MM'
  anio: number
  mes: number // 1-12
  abierto: boolean // ¿se está recibiendo disponibilidad?
  publicado: boolean // ¿el programa ya se publicó a los hermanos?
}

// Una asignación = pareja de hermanos en un slot (un día × un punto)
// slotKey = `${fechaISO}|${puntoId}`
export type Asignaciones = Record<string, string[]>

export interface AppState {
  hermanos: Hermano[]
  puntos: Punto[]
  meses: Mes[]
  disponibilidad: Disponibilidad[]
  asignaciones: Record<string, Asignaciones> // mesId -> slots
  mesActivoId: string
  version: number
}

export function slotKey(fechaISO: string, puntoId: string): string {
  return `${fechaISO}|${puntoId}`
}
