import { useState } from 'react'
import { acciones, useApp } from '../../store'
import {
  etiquetaMes,
  etiquetaFecha,
  semanasDelMes,
} from '../../lib/dates'
import {
  candidatosSlot,
  filasPrograma,
  slotDeCelda,
} from '../../lib/programa'
import { Tarjeta } from '../../ui'

export default function Armar() {
  const s = useApp()
  const mesId = s.mesActivoId
  const semanas = semanasDelMes(mesId)
  const filas = filasPrograma(s.puntos)
  const slots = s.asignaciones[mesId] ?? {}
  const [abierta, setAbierta] = useState(0) // índice de semana abierta
  const [slotEdit, setSlotEdit] = useState<string | null>(null)
  const [verTodos, setVerTodos] = useState(false)

  return (
    <div className="p-4 space-y-3">
      <p className="text-sm text-slate-500">
        Toca un turno para asignar la pareja. Aparecen primero quienes marcaron
        disponibilidad ese día ⭐ = prefieren ese punto.
      </p>

      {/* Selector de semana */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {semanas.map((sem, i) => (
          <button
            key={i}
            onClick={() => setAbierta(i)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
              abierta === i
                ? 'bg-sky-700 text-white'
                : 'bg-white border border-slate-300 text-slate-600'
            }`}
          >
            Semana {i + 1}
            <span className="opacity-70 ml-1">
              ({etiquetaFecha(sem[0]).split(' ')[1]}–
              {etiquetaFecha(sem[sem.length - 1]).split(' ')[1]})
            </span>
          </button>
        ))}
      </div>

      {/* Días de la semana abierta */}
      {(semanas[abierta] ?? []).map((iso) => {
        const celdas = filas
          .map((fila) => ({ fila, slotK: slotDeCelda(fila, iso) }))
          .filter((c) => c.slotK !== null) as {
          fila: (typeof filas)[number]
          slotK: string
        }[]
        if (celdas.length === 0) return null
        return (
          <Tarjeta key={iso} className="p-3">
            <h3 className="font-bold text-slate-800 capitalize mb-2">
              {etiquetaFecha(iso)}
            </h3>
            <div className="space-y-2">
              {celdas.map(({ fila, slotK }) => {
                const asignados = slots[slotK] ?? []
                const candidatos = candidatosSlot(s, mesId, iso, fila.punto)
                const abierto = slotEdit === slotK
                const lista = verTodos
                  ? s.hermanos.filter((h) => h.activo)
                  : candidatos
                return (
                  <div
                    key={slotK}
                    className="rounded-xl border border-slate-200"
                  >
                    <button
                      onClick={() => {
                        setSlotEdit(abierto ? null : slotK)
                        setVerTodos(false)
                      }}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">
                          {fila.punto.tipo === 'pendon' ? '🚩' : '🛒'}{' '}
                          {fila.punto.nombre}
                        </div>
                        <div className="text-xs text-slate-500">
                          08:00–10:00 ·{' '}
                          <span className="text-sky-600">
                            {candidatos.length} disponible(s)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {asignados.length === 0 ? (
                          <span className="text-xs text-slate-300 italic">
                            Disponible
                          </span>
                        ) : (
                          asignados.map((id) => (
                            <span
                              key={id}
                              className="rounded-full bg-sky-100 text-sky-800 text-xs px-2 py-0.5"
                            >
                              {s.hermanos.find((h) => h.id === id)?.nombre}
                            </span>
                          ))
                        )}
                        <span className="text-slate-400">
                          {abierto ? '▲' : '▼'}
                        </span>
                      </div>
                    </button>

                    {abierto && (
                      <div className="border-t border-slate-100 p-3 bg-slate-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-500">
                            Elige hasta 2 (máx)
                          </span>
                          <button
                            onClick={() => setVerTodos((v) => !v)}
                            className="text-xs text-sky-600 underline"
                          >
                            {verTodos
                              ? 'Solo disponibles'
                              : 'Ver todos los hermanos'}
                          </button>
                        </div>
                        {lista.length === 0 && (
                          <p className="text-sm text-slate-400 py-2">
                            Nadie marcó disponibilidad para este turno.
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1.5">
                          {lista.map((h) => {
                            const sel = asignados.includes(h.id)
                            const prefiere = h.puntoPreferidoId === fila.punto.id
                            return (
                              <button
                                key={h.id}
                                onClick={() =>
                                  acciones.toggleEnSlot(mesId, slotK, h.id)
                                }
                                className={`rounded-full px-3 py-1.5 text-sm font-medium border transition-colors ${
                                  sel
                                    ? 'bg-sky-600 text-white border-sky-600'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                {prefiere && '⭐ '}
                                {h.nombre}
                                {sel && ' ✓'}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Tarjeta>
        )
      })}

      <p className="text-center text-xs text-slate-400 pt-2">
        {etiquetaMes(mesId)} · los cambios se guardan automáticamente
      </p>
    </div>
  )
}
