import { useSyncExternalStore } from 'react'
import {
  ref,
  onValue,
  set as fbSet,
  update as fbUpdate,
  remove as fbRemove,
} from 'firebase/database'
import { db, hayNube, RAIZ } from './firebase'
import type {
  AppState,
  Disponibilidad,
  Hermano,
  Mes,
  Punto,
} from './types'
import { HERMANOS_SEMILLA, PUNTOS_SEMILLA } from './seed'
import { mesId as makeMesId } from './lib/dates'

const STORAGE_KEY = 'ppa_estado_v1'
const SESION_KEY = 'ppa_sesion_v1'

function estadoInicial(): AppState {
  const ahora = new Date()
  // mes activo por defecto: el mes siguiente al actual (se planifica con anticipación)
  let anio = ahora.getFullYear()
  let mes = ahora.getMonth() + 2
  if (mes > 12) {
    mes = 1
    anio += 1
  }
  const id = makeMesId(anio, mes)
  const mesActivo: Mes = { id, anio, mes, abierto: true, publicado: false }
  return {
    hermanos: HERMANOS_SEMILLA,
    puntos: PUNTOS_SEMILLA,
    meses: [mesActivo],
    disponibilidad: [],
    asignaciones: { [id]: {} },
    mesActivoId: id,
    version: 1,
  }
}

function cargarLocal(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AppState
  } catch {
    /* ignora */
  }
  const inicial = estadoInicial()
  guardarLocal(inicial)
  return inicial
}

function guardarLocal(s: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    /* ignora */
  }
}

let estado: AppState = cargarLocal()
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((l) => l())
}

// Actualiza estado local (optimista) + persiste + notifica
function setLocal(actualizar: (s: AppState) => AppState) {
  estado = actualizar(estado)
  guardarLocal(estado)
  notify()
}

// ---- Suscripción para React ----
function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
function getSnapshot() {
  return estado
}
export function useApp(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot)
}

// =================== Firebase (nube) ===================

// Quita undefined (Firebase no los acepta)
function limpio<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

function cloudSet(path: string, value: unknown) {
  if (!db) return
  fbSet(ref(db, `${RAIZ}/${path}`), limpio(value)).catch((e) =>
    console.error('Firebase set', path, e),
  )
}
function cloudUpdate(path: string, value: object) {
  if (!db) return
  fbUpdate(ref(db, `${RAIZ}/${path}`), limpio(value)).catch((e) =>
    console.error('Firebase update', path, e),
  )
}
function cloudRemove(path: string) {
  if (!db) return
  fbRemove(ref(db, `${RAIZ}/${path}`)).catch((e) =>
    console.error('Firebase remove', path, e),
  )
}

// Convierte el snapshot de la nube al AppState que usa la app
function cloudAEstado(val: any): AppState {
  const hermanos: Hermano[] = Object.values(val.hermanos ?? {})
  const puntos: Punto[] = Object.values(val.puntos ?? {})
  const meses: Mes[] = Object.values(val.meses ?? {})
  const disponibilidad: Disponibilidad[] = []
  for (const porHermano of Object.values<any>(val.disponibilidad ?? {})) {
    for (const d of Object.values<any>(porHermano)) {
      // Firebase omite arreglos vacíos: garantizamos que existan
      disponibilidad.push({ ...d, semana: d.semana ?? [], sabados: d.sabados ?? [] })
    }
  }
  const asignaciones: AppState['asignaciones'] = {}
  for (const [mid, slots] of Object.entries<any>(val.asignaciones ?? {})) {
    asignaciones[mid] = {}
    for (const [k, ids] of Object.entries<any>(slots ?? {})) {
      asignaciones[mid][k] = Array.isArray(ids) ? ids : Object.values(ids)
    }
  }
  const mesActivoId =
    val.config?.mesActivoId ?? meses[0]?.id ?? estado.mesActivoId
  return {
    hermanos,
    puntos,
    meses,
    disponibilidad,
    asignaciones,
    mesActivoId,
    version: 1,
  }
}

let sembrado = false
function sembrarNube() {
  if (!db || sembrado) return
  sembrado = true
  const ini = estadoInicial()
  const updates: Record<string, unknown> = {}
  ini.hermanos.forEach((h) => (updates[`hermanos/${h.id}`] = h))
  ini.puntos.forEach((p) => (updates[`puntos/${p.id}`] = p))
  ini.meses.forEach((m) => (updates[`meses/${m.id}`] = m))
  updates['config/mesActivoId'] = ini.mesActivoId
  fbUpdate(ref(db, RAIZ), limpio(updates)).catch((e) =>
    console.error('Firebase seed', e),
  )
}

if (hayNube() && db) {
  onValue(ref(db, RAIZ), (snap) => {
    const val = snap.val()
    if (!val || !val.hermanos) {
      sembrarNube() // primera vez: cargar semilla a la nube
      return
    }
    estado = cloudAEstado(val)
    guardarLocal(estado)
    notify()
  })
}

// ---- Sesión (quién entró) ----
function cargarSesion(): string | null {
  try {
    return localStorage.getItem(SESION_KEY)
  } catch {
    return null
  }
}
let sesionId: string | null = cargarSesion()
const sesionListeners = new Set<() => void>()
export function useSesion(): string | null {
  return useSyncExternalStore(
    (cb) => {
      sesionListeners.add(cb)
      return () => sesionListeners.delete(cb)
    },
    () => sesionId,
  )
}
export function entrar(hermanoId: string) {
  sesionId = hermanoId
  try {
    localStorage.setItem(SESION_KEY, hermanoId)
  } catch {
    /* ignora */
  }
  sesionListeners.forEach((l) => l())
}
export function salir() {
  sesionId = null
  try {
    localStorage.removeItem(SESION_KEY)
  } catch {
    /* ignora */
  }
  sesionListeners.forEach((l) => l())
}

// =================== Acciones ===================

export const acciones = {
  // ---- Hermanos ----
  agregarHermano(nombre: string, esAdmin = false) {
    const id = 'h_' + Date.now().toString(36)
    const h: Hermano = { id, nombre, esAdmin, activo: true }
    setLocal((s) => ({ ...s, hermanos: [...s.hermanos, h] }))
    cloudSet(`hermanos/${id}`, h)
  },
  editarHermano(id: string, cambios: Partial<Hermano>) {
    setLocal((s) => ({
      ...s,
      hermanos: s.hermanos.map((h) => (h.id === id ? { ...h, ...cambios } : h)),
    }))
    cloudUpdate(`hermanos/${id}`, cambios)
  },
  eliminarHermano(id: string) {
    setLocal((s) => ({ ...s, hermanos: s.hermanos.filter((h) => h.id !== id) }))
    cloudRemove(`hermanos/${id}`)
  },

  // ---- Puntos ----
  guardarPunto(punto: Punto) {
    setLocal((s) => {
      const existe = s.puntos.some((p) => p.id === punto.id)
      return {
        ...s,
        puntos: existe
          ? s.puntos.map((p) => (p.id === punto.id ? punto : p))
          : [...s.puntos, punto],
      }
    })
    cloudSet(`puntos/${punto.id}`, punto)
  },
  eliminarPunto(id: string) {
    setLocal((s) => ({ ...s, puntos: s.puntos.filter((p) => p.id !== id) }))
    cloudRemove(`puntos/${id}`)
  },

  // ---- Meses ----
  crearMes(anio: number, mes: number) {
    const id = makeMesId(anio, mes)
    setLocal((s) => {
      if (s.meses.some((m) => m.id === id)) return { ...s, mesActivoId: id }
      return {
        ...s,
        meses: [...s.meses, { id, anio, mes, abierto: true, publicado: false }],
        asignaciones: { ...s.asignaciones, [id]: {} },
        mesActivoId: id,
      }
    })
    cloudSet(`meses/${id}`, { id, anio, mes, abierto: true, publicado: false })
    cloudSet('config/mesActivoId', id)
  },
  setMesActivo(id: string) {
    setLocal((s) => ({ ...s, mesActivoId: id }))
    cloudSet('config/mesActivoId', id)
  },
  setMesAbierto(id: string, abierto: boolean) {
    setLocal((s) => ({
      ...s,
      meses: s.meses.map((m) => (m.id === id ? { ...m, abierto } : m)),
    }))
    cloudUpdate(`meses/${id}`, { abierto })
  },
  setMesPublicado(id: string, publicado: boolean) {
    setLocal((s) => ({
      ...s,
      meses: s.meses.map((m) => (m.id === id ? { ...m, publicado } : m)),
    }))
    cloudUpdate(`meses/${id}`, { publicado })
  },

  // ---- Disponibilidad ----
  guardarDisponibilidad(d: Disponibilidad) {
    setLocal((s) => {
      const otras = s.disponibilidad.filter(
        (x) => !(x.hermanoId === d.hermanoId && x.mesId === d.mesId),
      )
      return { ...s, disponibilidad: [...otras, d] }
    })
    cloudSet(`disponibilidad/${d.mesId}/${d.hermanoId}`, d)
  },

  // ---- Asignaciones (armado del programa) ----
  setSlot(mesId: string, key: string, hermanoIds: string[]) {
    setLocal((s) => {
      const mes = { ...(s.asignaciones[mesId] ?? {}) }
      if (hermanoIds.length === 0) delete mes[key]
      else mes[key] = hermanoIds
      return { ...s, asignaciones: { ...s.asignaciones, [mesId]: mes } }
    })
    if (hermanoIds.length === 0) cloudRemove(`asignaciones/${mesId}/${key}`)
    else cloudSet(`asignaciones/${mesId}/${key}`, hermanoIds)
  },
  toggleEnSlot(mesId: string, key: string, hermanoId: string, max = 2) {
    let resultado: string[] = []
    setLocal((s) => {
      const mes = { ...(s.asignaciones[mesId] ?? {}) }
      const actual = mes[key] ?? []
      let nuevo: string[]
      if (actual.includes(hermanoId)) {
        nuevo = actual.filter((id) => id !== hermanoId)
      } else {
        nuevo = [...actual, hermanoId].slice(-max)
      }
      resultado = nuevo
      if (nuevo.length === 0) delete mes[key]
      else mes[key] = nuevo
      return { ...s, asignaciones: { ...s.asignaciones, [mesId]: mes } }
    })
    if (resultado.length === 0) cloudRemove(`asignaciones/${mesId}/${key}`)
    else cloudSet(`asignaciones/${mesId}/${key}`, resultado)
  },

  // ---- Utilidad: reiniciar local a semilla (para pruebas) ----
  reiniciar() {
    estado = estadoInicial()
    guardarLocal(estado)
    notify()
  },
}

// ---- Selectores / helpers ----
export function getMes(s: AppState, id: string): Mes | undefined {
  return s.meses.find((m) => m.id === id)
}
export function getHermano(s: AppState, id: string): Hermano | undefined {
  return s.hermanos.find((h) => h.id === id)
}
export function getDisponibilidad(
  s: AppState,
  hermanoId: string,
  mesId: string,
): Disponibilidad | undefined {
  return s.disponibilidad.find(
    (d) => d.hermanoId === hermanoId && d.mesId === mesId,
  )
}

// ¿El hermano puede ese día según su semana tipo?
export function puedeEnDia(
  d: Disponibilidad | undefined,
  dia: number,
): boolean {
  if (!d) return false
  return d.semana.includes(dia)
}
