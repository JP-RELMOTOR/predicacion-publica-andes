import { useState } from 'react'
import { useApp } from '../store'
import { TURNO, type Punto } from '../types'
import { Tarjeta, Etiqueta } from '../ui'
import MapaPunto from '../components/MapaPunto'

function FotoPunto({ punto, alta = false }: { punto: Punto; alta?: boolean }) {
  if (punto.foto) {
    return (
      <img
        src={punto.foto}
        alt={punto.nombre}
        className={`object-cover w-full ${alta ? 'h-52' : 'h-20 w-20 rounded-xl'}`}
      />
    )
  }
  // marcador de posición mientras no haya foto
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-sky-200 to-sky-400 ${
        alta ? 'h-52 w-full' : 'h-20 w-20 rounded-xl shrink-0'
      }`}
    >
      <span className={alta ? 'text-6xl' : 'text-3xl'}>
        {punto.tipo === 'pendon' ? '🚩' : '🛒'}
      </span>
    </div>
  )
}

export default function PuntosGaleria() {
  const s = useApp()
  const [sel, setSel] = useState<Punto | null>(null)

  if (sel) {
    const gmaps =
      sel.lat != null && sel.lng != null
        ? `https://www.google.com/maps/search/?api=1&query=${sel.lat},${sel.lng}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${sel.lugarAsignacion}, Santiago, Chile`,
          )}`
    return (
      <div className="pb-4">
        <button
          onClick={() => setSel(null)}
          className="flex items-center gap-2 px-4 py-3 text-slate-600 font-medium"
        >
          ← Volver a puntos
        </button>

        <div className="px-4 space-y-4">
          <Tarjeta className="overflow-hidden">
            <FotoPunto punto={sel} alta />
            <div className="p-4">
              <h2 className="text-xl font-bold text-slate-800">
                {sel.tipo === 'pendon' ? '🚩' : '🛒'} {sel.nombre}
              </h2>
              <p className="text-sm text-slate-500">{sel.familia}</p>

              <div className="mt-3 space-y-1.5 text-sm text-slate-700">
                <p>
                  📍 <b>Lugar de predicación:</b> {sel.lugarAsignacion}
                </p>
                <p>
                  🏠 <b>Retiro del equipo:</b> {sel.lugarRetiro}
                </p>
                <p>
                  🕗 <b>Horario:</b> {TURNO}
                </p>
                <p>
                  📅 <b>Días:</b>{' '}
                  {[sel.operaSemana && 'Lunes a viernes', sel.operaSabado && 'Sábado']
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
            </div>
          </Tarjeta>

          {/* Mapa */}
          {sel.lat != null && sel.lng != null ? (
            <Tarjeta className="p-2">
              <MapaPunto lat={sel.lat} lng={sel.lng} nombre={sel.nombre} />
            </Tarjeta>
          ) : (
            <Tarjeta className="p-4 text-center text-sm text-slate-400">
              🗺️ Mapa disponible pronto
            </Tarjeta>
          )}

          <a
            href={gmaps}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center rounded-xl bg-sky-700 text-white font-semibold py-3 hover:bg-sky-800"
          >
            🧭 Abrir en Google Maps
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      {s.puntos
        .filter((p) => p.activo)
        .map((p) => (
          <button key={p.id} onClick={() => setSel(p)} className="w-full text-left">
            <Tarjeta className="p-3 flex items-center gap-3 hover:bg-slate-50">
              <FotoPunto punto={p} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 leading-tight">
                  {p.nombre}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {p.lugarAsignacion}
                </div>
                <div className="mt-1.5">
                  <Etiqueta color="green">Activo</Etiqueta>
                </div>
              </div>
              <span className="text-slate-300 text-xl">›</span>
            </Tarjeta>
          </button>
        ))}
    </div>
  )
}
