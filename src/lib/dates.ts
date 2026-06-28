// Utilidades de fecha en español, sin dependencias externas.

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export function nombreMes(mes: number): string {
  return MESES[mes - 1] ?? ''
}

export function etiquetaMes(mesId: string): string {
  const [anio, mes] = mesId.split('-').map(Number)
  return `${nombreMes(mes)} ${anio}`
}

// id 'YYYY-MM' a partir de año y mes (1-12)
export function mesId(anio: number, mes: number): string {
  return `${anio}-${String(mes).padStart(2, '0')}`
}

// ISO local 'YYYY-MM-DD' (sin desfase de zona horaria)
export function isoFecha(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Día de la semana 1=Lun..7=Dom para una fecha ISO
export function diaSemanaISO(iso: string): number {
  const dow = parseISO(iso).getDay() // 0=Dom..6=Sab
  return dow === 0 ? 7 : dow
}

// Todos los días (lun-sáb) de un mes
export function diasDelMes(mesId: string): string[] {
  const [anio, mes] = mesId.split('-').map(Number)
  const out: string[] = []
  const d = new Date(anio, mes - 1, 1)
  while (d.getMonth() === mes - 1) {
    const dow = d.getDay()
    if (dow !== 0) out.push(isoFecha(d)) // excluye domingos
    d.setDate(d.getDate() + 1)
  }
  return out
}

// Solo los sábados de un mes
export function sabadosDelMes(mesId: string): string[] {
  return diasDelMes(mesId).filter((iso) => parseISO(iso).getDay() === 6)
}

// Agrupa las fechas del mes en semanas (cada semana = arreglo de fechas lun-sáb)
export function semanasDelMes(mesId: string): string[][] {
  const dias = diasDelMes(mesId)
  const semanas: string[][] = []
  let actual: string[] = []
  for (const iso of dias) {
    actual.push(iso)
    if (parseISO(iso).getDay() === 6) {
      semanas.push(actual)
      actual = []
    }
  }
  if (actual.length) semanas.push(actual)
  return semanas
}

export function etiquetaFecha(iso: string): string {
  const d = parseISO(iso)
  return `${DIAS[d.getDay()]} ${d.getDate()}`
}

export function etiquetaFechaCorta(iso: string): string {
  const d = parseISO(iso)
  return `${d.getDate()} ${MESES[d.getMonth()].slice(0, 3).toLowerCase()}.`
}

export function diaNumero(iso: string): number {
  return parseISO(iso).getDate()
}

export function nombreDiaCorto(iso: string): string {
  const d = parseISO(iso)
  return DIAS[d.getDay()].slice(0, 3)
}
