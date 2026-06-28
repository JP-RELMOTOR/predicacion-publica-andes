import { getDisponibilidad } from '../store'
import {
  type AppState,
  type Hermano,
  type Punto,
  slotKey,
} from '../types'
import { diaSemanaISO } from './dates'

export interface FilaPrograma {
  punto: Punto
}

// Filas de la tabla del programa (una por punto activo).
export function filasPrograma(puntos: Punto[]): FilaPrograma[] {
  return puntos.filter((x) => x.activo).map((punto) => ({ punto }))
}

// ¿Qué slot corresponde a un punto en una fecha dada? null si ese día no aplica.
export function slotDeCelda(
  fila: FilaPrograma,
  fechaISO: string,
): string | null {
  const esSabado = diaSemanaISO(fechaISO) === 6
  if (esSabado) {
    if (!fila.punto.operaSabado) return null
  } else if (!fila.punto.operaSemana) {
    return null
  }
  return slotKey(fechaISO, fila.punto.id)
}

// Candidatos disponibles para un día/punto, ordenados por punto preferido.
export function candidatosSlot(
  s: AppState,
  mesId: string,
  fechaISO: string,
  punto: Punto,
): Hermano[] {
  const dia = diaSemanaISO(fechaISO)
  const esSabado = dia === 6
  const out = s.hermanos.filter((h) => {
    if (!h.activo) return false
    const d = getDisponibilidad(s, h.id, mesId)
    if (!d) return false
    if (esSabado) return d.sabados.includes(fechaISO)
    return d.semana.includes(dia)
  })
  return out.sort((a, b) => {
    const pa = preferenciaPunto(s, mesId, a.id) === punto.id ? 0 : 1
    const pb = preferenciaPunto(s, mesId, b.id) === punto.id ? 0 : 1
    if (pa !== pb) return pa - pb
    return a.nombre.localeCompare(b.nombre)
  })
}

function preferenciaPunto(
  s: AppState,
  mesId: string,
  hermanoId: string,
): string | undefined {
  const d = getDisponibilidad(s, hermanoId, mesId)
  return (
    d?.puntoPreferidoId ??
    s.hermanos.find((h) => h.id === hermanoId)?.puntoPreferidoId
  )
}

// Resumen de cuántos slots tiene asignado un hermano en el mes
export function asignacionesDeHermano(
  s: AppState,
  mesId: string,
  hermanoId: string,
): string[] {
  const slots = s.asignaciones[mesId] ?? {}
  return Object.keys(slots).filter((k) => slots[k].includes(hermanoId))
}
