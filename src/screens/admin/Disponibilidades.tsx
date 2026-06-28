import { useApp } from '../../store'
import { DIAS_SEMANA } from '../../types'
import { etiquetaFechaCorta } from '../../lib/dates'
import { Avatar, Etiqueta, Tarjeta } from '../../ui'

export default function Disponibilidades() {
  const s = useApp()
  const mesId = s.mesActivoId

  const filas = s.hermanos
    .filter((h) => h.activo)
    .map((h) => ({
      h,
      d: s.disponibilidad.find(
        (x) => x.hermanoId === h.id && x.mesId === mesId,
      ),
    }))
    .sort((a, b) => {
      // primero los que enviaron
      const ae = a.d?.enviada ? 0 : 1
      const be = b.d?.enviada ? 0 : 1
      if (ae !== be) return ae - be
      return a.h.nombre.localeCompare(b.h.nombre)
    })

  return (
    <div className="p-4 space-y-2">
      {filas.map(({ h, d }) => (
        <Tarjeta key={h.id} className="p-3">
          <div className="flex items-start gap-3">
            <Avatar nombre={h.nombre} size={36} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{h.nombre}</span>
                {d?.enviada ? (
                  <Etiqueta color="green">Respondió</Etiqueta>
                ) : (
                  <Etiqueta color="slate">Sin responder</Etiqueta>
                )}
              </div>
              {d?.enviada && (
                <div className="mt-1.5 space-y-1 text-xs text-slate-600">
                  <div className="flex flex-wrap gap-1">
                    {DIAS_SEMANA.filter((dia) => d.semana.includes(dia.n)).map(
                      (dia) => (
                        <span
                          key={dia.n}
                          className="rounded bg-sky-50 text-sky-700 px-1.5 py-0.5"
                        >
                          {dia.corto}
                        </span>
                      ),
                    )}
                    {d.semana.length === 0 && (
                      <span className="text-slate-400">
                        Sin días de semana
                      </span>
                    )}
                  </div>
                  {d.sabados.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {d.sabados
                        .slice()
                        .sort()
                        .map((iso) => (
                          <span
                            key={iso}
                            className="rounded bg-amber-50 text-amber-700 px-1.5 py-0.5"
                          >
                            ⭐ {etiquetaFechaCorta(iso)}
                          </span>
                        ))}
                    </div>
                  )}
                  {d.puntoPreferidoId && (
                    <div className="text-slate-500">
                      📍 Prefiere:{' '}
                      {s.puntos.find((p) => p.id === d.puntoPreferidoId)?.nombre}
                    </div>
                  )}
                  {d.nota && (
                    <div className="text-slate-500 italic">“{d.nota}”</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Tarjeta>
      ))}
    </div>
  )
}
