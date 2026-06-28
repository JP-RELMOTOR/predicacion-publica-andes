import { useState } from 'react'
import { acciones, getDisponibilidad, getMes, useApp } from '../store'
import { DIAS_SEMANA, TURNO, type Disponibilidad as Disp } from '../types'
import { etiquetaMes, sabadosDelMes, etiquetaFecha } from '../lib/dates'
import { Boton, Tarjeta } from '../ui'

export default function Disponibilidad({ hermanoId }: { hermanoId: string }) {
  const s = useApp()
  const mesId = s.mesActivoId
  const mes = getMes(s, mesId)
  const previa = getDisponibilidad(s, hermanoId, mesId)

  const [semana, setSemana] = useState<number[]>(previa?.semana ?? [])
  const [sabados, setSabados] = useState<string[]>(previa?.sabados ?? [])
  const [puntoPref, setPuntoPref] = useState<string>(
    previa?.puntoPreferidoId ?? '',
  )
  const [nota, setNota] = useState(previa?.nota ?? '')
  const [guardado, setGuardado] = useState(false)

  const sabados_mes = sabadosDelMes(mesId)

  function toggleDia(dia: number) {
    setGuardado(false)
    setSemana((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia],
    )
  }

  function toggleSabado(iso: string) {
    setGuardado(false)
    setSabados((prev) =>
      prev.includes(iso) ? prev.filter((x) => x !== iso) : [...prev, iso],
    )
  }

  function guardar() {
    const d: Disp = {
      hermanoId,
      mesId,
      semana,
      sabados,
      puntoPreferidoId: puntoPref || undefined,
      nota: nota.trim() || undefined,
      enviada: true,
      actualizado: new Date().toISOString(),
    }
    acciones.guardarDisponibilidad(d)
    if (puntoPref)
      acciones.editarHermano(hermanoId, { puntoPreferidoId: puntoPref })
    setGuardado(true)
  }

  if (!mes?.abierto) {
    return (
      <div className="p-4">
        <Tarjeta className="p-6 text-center">
          <p className="text-3xl mb-2">⏳</p>
          <p className="font-semibold text-slate-700">
            La disponibilidad de {etiquetaMes(mesId)} aún no está abierta.
          </p>
          <p className="text-sm text-slate-500 mt-1">
            El encargado la abrirá pronto. Vuelve más tarde.
          </p>
        </Tarjeta>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <Tarjeta className="p-4 bg-sky-50 border-sky-200">
        <p className="text-sm text-sky-800">
          Marca tu disponibilidad para{' '}
          <span className="font-bold">{etiquetaMes(mesId)}</span>. El turno es
          único: <b>{TURNO} de la mañana</b>. La semana es tipo: marcas una vez y
          vale para todo el mes. Los <b>sábados</b> sí van por fecha.
        </p>
      </Tarjeta>

      {/* Semana tipo */}
      <Tarjeta className="p-4">
        <h2 className="font-bold text-slate-800 mb-1">🗓️ Mi semana habitual</h2>
        <p className="text-xs text-slate-500 mb-3">
          Toca los días en que normalmente puedes (turno {TURNO}).
        </p>
        <div className="space-y-2">
          {DIAS_SEMANA.map((d) => {
            const activo = semana.includes(d.n)
            return (
              <button
                key={d.n}
                onClick={() => toggleDia(d.n)}
                className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                  activo
                    ? 'bg-sky-50 border-sky-300'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="font-medium text-slate-700">{d.largo}</span>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${
                    activo ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-300'
                  }`}
                >
                  {activo ? '✓' : ''}
                </span>
              </button>
            )
          })}
        </div>
      </Tarjeta>

      {/* Punto preferido */}
      <Tarjeta className="p-4">
        <h2 className="font-bold text-slate-800 mb-1">📍 Mi punto preferido</h2>
        <p className="text-xs text-slate-500 mb-3">
          ¿Dónde prefieres trabajar? (lo respetamos cuando se pueda)
        </p>
        <select
          value={puntoPref}
          onChange={(e) => {
            setPuntoPref(e.target.value)
            setGuardado(false)
          }}
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 bg-white"
        >
          <option value="">Sin preferencia / cualquiera</option>
          {s.puntos
            .filter((p) => p.activo)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} ({p.familia})
              </option>
            ))}
        </select>
      </Tarjeta>

      {/* Sábados */}
      <Tarjeta className="p-4">
        <h2 className="font-bold text-slate-800 mb-1">⭐ Sábados disponibles</h2>
        <p className="text-xs text-slate-500 mb-3">
          Turno único {TURNO}. Marca los sábados que puedes.
        </p>
        <div className="space-y-2">
          {sabados_mes.map((iso) => {
            const activo = sabados.includes(iso)
            return (
              <button
                key={iso}
                onClick={() => toggleSabado(iso)}
                className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                  activo
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="font-medium text-slate-700 capitalize">
                  {etiquetaFecha(iso)}
                </span>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${
                    activo
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-300'
                  }`}
                >
                  {activo ? '✓' : ''}
                </span>
              </button>
            )
          })}
        </div>
      </Tarjeta>

      {/* Nota */}
      <Tarjeta className="p-4">
        <h2 className="font-bold text-slate-800 mb-2">📝 Nota (opcional)</h2>
        <textarea
          value={nota}
          onChange={(e) => {
            setNota(e.target.value)
            setGuardado(false)
          }}
          placeholder="Ej: el martes solo puedo si es en el carrito de la familia Correa."
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 min-h-20 resize-none"
        />
      </Tarjeta>

      <div className="sticky bottom-16 pt-2">
        <Boton
          onClick={guardar}
          className="w-full text-base py-3 shadow-lg"
          variante={guardado ? 'secundario' : 'primario'}
        >
          {guardado
            ? '✓ ¡Disponibilidad guardada!'
            : 'Guardar mi disponibilidad'}
        </Boton>
      </div>
    </div>
  )
}
