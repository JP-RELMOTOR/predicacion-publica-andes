import { useMemo, useState } from 'react'
import { getMes, useApp } from '../store'
import { TURNO } from '../types'
import { isoFecha, mesId as makeMesId, nombreMes } from '../lib/dates'
import { Tarjeta } from '../ui'
import ProgramaTabla from '../components/ProgramaTabla'

// Celdas del calendario: lunes a domingo, con null en los huecos.
function celdasMes(anio: number, mes: number): (string | null)[] {
  const primero = new Date(anio, mes - 1, 1)
  const huecos = (primero.getDay() + 6) % 7 // 0 = lunes
  const nDias = new Date(anio, mes, 0).getDate()
  const celdas: (string | null)[] = []
  for (let i = 0; i < huecos; i++) celdas.push(null)
  for (let d = 1; d <= nDias; d++)
    celdas.push(isoFecha(new Date(anio, mes - 1, d)))
  while (celdas.length % 7 !== 0) celdas.push(null)
  return celdas
}

export default function MisAsignaciones({ hermanoId }: { hermanoId: string }) {
  const s = useApp()
  const esAdmin = s.hermanos.find((h) => h.id === hermanoId)?.esAdmin ?? false

  // mes visible (por defecto el mes activo del programa)
  const [anio0, mes0] = s.mesActivoId.split('-').map(Number)
  const [vista, setVista] = useState({ anio: anio0, mes: mes0 })
  const [diaSel, setDiaSel] = useState<string | null>(null)
  const [verTodo, setVerTodo] = useState(false)

  const mesId = makeMesId(vista.anio, vista.mes)
  const mes = getMes(s, mesId)
  // el hermano ve asignaciones solo si el programa está publicado (admins siempre)
  const visible = !!mes && (mes.publicado || esAdmin)

  const slots = visible ? (s.asignaciones[mesId] ?? {}) : {}

  const misFechas = useMemo(() => {
    const set = new Set<string>()
    for (const [k, ids] of Object.entries(slots)) {
      if (ids.includes(hermanoId)) set.add(k.split('|')[0])
    }
    return set
  }, [slots, hermanoId])

  const celdas = celdasMes(vista.anio, vista.mes)
  const hoy = isoFecha(new Date())

  function mover(delta: number) {
    setDiaSel(null)
    setVista(({ anio, mes }) => {
      let m = mes + delta
      let a = anio
      if (m < 1) {
        m = 12
        a--
      }
      if (m > 12) {
        m = 1
        a++
      }
      return { anio: a, mes: m }
    })
  }

  // detalle del día seleccionado
  const detalle = useMemo(() => {
    if (!diaSel) return []
    return Object.entries(slots)
      .filter(([k, ids]) => k.startsWith(diaSel + '|') && ids.includes(hermanoId))
      .map(([k, ids]) => {
        const puntoId = k.split('|')[1]
        const punto = s.puntos.find((p) => p.id === puntoId)
        const companeros = ids
          .filter((id) => id !== hermanoId)
          .map((id) => s.hermanos.find((h) => h.id === id)?.nombre ?? '¿?')
        return { punto, companeros }
      })
  }, [diaSel, slots, hermanoId, s.puntos, s.hermanos])

  const totalMes = misFechas.size

  return (
    <div className="p-4 space-y-4">
      {/* Cabecera del mes */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-slate-800">
          {nombreMes(vista.mes)} {vista.anio}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => mover(-1)}
            className="h-9 w-9 rounded-full bg-white border border-slate-200 text-slate-600 font-bold"
          >
            ←
          </button>
          <button
            onClick={() => mover(1)}
            className="h-9 w-9 rounded-full bg-white border border-slate-200 text-slate-600 font-bold"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendario */}
      <Tarjeta className="p-3">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
            <div
              key={i}
              className="text-center text-xs font-semibold text-slate-400 py-1"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {celdas.map((iso, i) => {
            if (!iso) return <div key={i} />
            const dia = Number(iso.split('-')[2])
            const asignado = misFechas.has(iso)
            const esHoy = iso === hoy
            const sel = diaSel === iso
            return (
              <button
                key={i}
                onClick={() => setDiaSel(sel ? null : iso)}
                className={`aspect-square rounded-xl text-sm font-medium transition-colors ${
                  asignado
                    ? 'bg-sky-600 text-white font-bold shadow-sm'
                    : sel
                      ? 'bg-slate-200 text-slate-800'
                      : 'bg-slate-50 text-slate-600'
                } ${esHoy && !asignado ? 'ring-2 ring-sky-400' : ''} ${
                  sel && asignado ? 'ring-2 ring-amber-400' : ''
                }`}
              >
                {dia}
              </button>
            )
          })}
        </div>
      </Tarjeta>

      {/* Estado / detalle */}
      {!mes ? (
        <Tarjeta className="p-4 text-center text-sm text-slate-500">
          Este mes aún no tiene programa.
        </Tarjeta>
      ) : !visible ? (
        <Tarjeta className="p-4 text-center">
          <p className="text-2xl mb-1">📋</p>
          <p className="text-sm text-slate-600 font-medium">
            El programa de este mes aún no se publica.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Mientras tanto, marca tu disponibilidad en la pestaña
            “Disponibilidad”.
          </p>
        </Tarjeta>
      ) : diaSel && detalle.length > 0 ? (
        <div className="space-y-2">
          {detalle.map((d, i) => (
            <Tarjeta key={i} className="p-4 border-sky-200 bg-sky-50">
              <div className="flex items-start gap-3">
                <div className="text-3xl">
                  {d.punto?.tipo === 'pendon' ? '🚩' : '🛒'}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800">
                    📍 {d.punto?.nombre}
                  </div>
                  <div className="text-sm text-slate-600 mt-0.5">
                    🕗 {TURNO}
                  </div>
                  {d.punto?.lugarRetiro && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      Retiro del exhibidor: {d.punto.lugarRetiro} (
                      {d.punto.familia})
                      {d.punto.contactoTelefono &&
                        ` · ${d.punto.contactoTelefono}`}
                    </div>
                  )}
                  <div className="text-sm text-slate-700 mt-2">
                    👥 Con:{' '}
                    <span className="font-semibold">
                      {d.companeros.join(', ') || '(sin compañero aún)'}
                    </span>
                  </div>
                </div>
              </div>
            </Tarjeta>
          ))}
        </div>
      ) : diaSel ? (
        <Tarjeta className="p-4 text-center text-sm text-slate-500">
          No tienes turno ese día.
        </Tarjeta>
      ) : totalMes === 0 ? (
        <Tarjeta className="p-4 text-center text-sm text-slate-500">
          No tienes turnos asignados para este mes.
        </Tarjeta>
      ) : (
        <Tarjeta className="p-4 text-center text-sm text-slate-600">
          Tienes <b>{totalMes}</b> turno{totalMes > 1 ? 's' : ''} este mes.
          Toca un día resaltado para ver el detalle.
        </Tarjeta>
      )}

      {/* Programa completo (colapsable) */}
      {visible && (
        <div>
          <button
            onClick={() => setVerTodo((v) => !v)}
            className="w-full text-center text-sm text-sky-700 font-medium py-2"
          >
            {verTodo ? '▲ Ocultar programa completo' : '▼ Ver programa completo del mes'}
          </button>
          {verTodo && (
            <Tarjeta className="p-3">
              <ProgramaTabla mesId={mesId} resaltarHermanoId={hermanoId} />
            </Tarjeta>
          )}
        </div>
      )}
    </div>
  )
}
