import { getHermano, useApp } from '../store'
import { etiquetaMes, nombreDiaCorto, diaNumero, semanasDelMes } from '../lib/dates'
import { filasPrograma, slotDeCelda } from '../lib/programa'

export default function ProgramaTabla({
  mesId,
  resaltarHermanoId,
}: {
  mesId: string
  resaltarHermanoId?: string
}) {
  const s = useApp()
  const semanas = semanasDelMes(mesId)
  const filas = filasPrograma(s.puntos)
  const slots = s.asignaciones[mesId] ?? {}

  function nombres(slotK: string | null): { txt: string; mio: boolean } {
    if (!slotK) return { txt: '—', mio: false }
    const ids = slots[slotK] ?? []
    if (ids.length === 0) return { txt: 'Disponible', mio: false }
    const mio = resaltarHermanoId ? ids.includes(resaltarHermanoId) : false
    const txt = ids
      .map((id) => getHermano(s, id)?.nombre ?? '¿?')
      .join(' · ')
    return { txt, mio }
  }

  return (
    <div className="space-y-5">
      <div className="text-center print-only">
        <h2 className="text-lg font-bold">
          Programa de Predicación Pública — {etiquetaMes(mesId).toUpperCase()}
        </h2>
        <p className="text-sm">Congregación Andes</p>
      </div>

      {semanas.map((semana, i) => (
        <div key={i} className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="bg-sky-800 text-white text-left px-2 py-1.5 sticky left-0 z-10 min-w-44">
                  Punto · 08:00–10:00
                </th>
                {semana.map((iso) => (
                  <th
                    key={iso}
                    className="bg-sky-800 text-white px-2 py-1.5 text-center min-w-28"
                  >
                    <div className="font-semibold capitalize">
                      {nombreDiaCorto(iso)}
                    </div>
                    <div className="text-sky-200">{diaNumero(iso)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, fi) => (
                <tr key={fi} className="border-b border-slate-200">
                  <td className="px-2 py-1.5 sticky left-0 bg-white z-10 border-r border-slate-200">
                    <div className="font-semibold text-slate-800 leading-tight">
                      {fila.punto.tipo === 'pendon' ? '🚩' : '🛒'}{' '}
                      {fila.punto.nombre}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {fila.punto.lugarAsignacion}
                    </div>
                  </td>
                  {semana.map((iso) => {
                    const slotK = slotDeCelda(fila, iso)
                    const { txt, mio } = nombres(slotK)
                    const vacio = txt === 'Disponible'
                    const na = txt === '—'
                    return (
                      <td
                        key={iso}
                        className={`px-2 py-1.5 text-center align-top border-l border-slate-100 ${
                          mio
                            ? 'bg-amber-100 font-semibold text-amber-900'
                            : na
                              ? 'bg-slate-50 text-slate-300'
                              : vacio
                                ? 'text-slate-300 italic'
                                : 'text-slate-700'
                        }`}
                      >
                        {txt}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
