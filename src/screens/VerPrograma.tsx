import { getMes, useApp } from '../store'
import { etiquetaMes, etiquetaFecha } from '../lib/dates'
import { asignacionesDeHermano } from '../lib/programa'
import { Tarjeta } from '../ui'
import ProgramaTabla from '../components/ProgramaTabla'

export default function VerPrograma({ hermanoId }: { hermanoId: string }) {
  const s = useApp()
  const mesId = s.mesActivoId
  const mes = getMes(s, mesId)

  const misSlots = asignacionesDeHermano(s, mesId, hermanoId)
    .map((k) => {
      const [fecha, puntoId] = k.split('|')
      const punto = s.puntos.find((p) => p.id === puntoId)
      const companeros = (s.asignaciones[mesId]?.[k] ?? [])
        .filter((id) => id !== hermanoId)
        .map((id) => s.hermanos.find((h) => h.id === id)?.nombre ?? '¿?')
      return { fecha, punto, companeros }
    })
    .sort((a, b) => a.fecha.localeCompare(b.fecha))

  if (!mes?.publicado) {
    return (
      <div className="p-4">
        <Tarjeta className="p-6 text-center">
          <p className="text-3xl mb-2">📋</p>
          <p className="font-semibold text-slate-700">
            El programa de {etiquetaMes(mesId)} aún no se publica.
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Cuando el encargado lo publique, aquí verás tus asignaciones.
          </p>
        </Tarjeta>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <Tarjeta className="p-4">
        <h2 className="font-bold text-slate-800 mb-3">
          ⭐ Mis asignaciones — {etiquetaMes(mesId)}
        </h2>
        {misSlots.length === 0 ? (
          <p className="text-sm text-slate-500">
            No tienes asignaciones este mes.
          </p>
        ) : (
          <div className="space-y-2">
            {misSlots.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5"
              >
                <div className="text-center min-w-12">
                  <div className="text-xs text-amber-700 capitalize">
                    {etiquetaFecha(m.fecha).split(' ')[0]}
                  </div>
                  <div className="text-lg font-bold text-amber-800 leading-none">
                    {etiquetaFecha(m.fecha).split(' ')[1]}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 text-sm">
                    {m.punto?.nombre}
                  </div>
                  <div className="text-xs text-slate-500">
                    08:00–10:00 · con {m.companeros.join(', ') || '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Tarjeta>

      <Tarjeta className="p-3">
        <h2 className="font-bold text-slate-800 mb-3 px-1">
          📅 Programa completo
        </h2>
        <ProgramaTabla mesId={mesId} resaltarHermanoId={hermanoId} />
      </Tarjeta>
    </div>
  )
}
