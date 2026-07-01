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
        className={`object-cover ${alta ? 'h-52 w-full' : 'h-20 w-20 rounded-xl shrink-0'}`}
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

// normaliza un teléfono a formato wa.me / tel:
function telLimpio(t: string): string {
  return t.replace(/[^\d+]/g, '')
}

export default function PuntosGaleria() {
  const s = useApp()
  const [sel, setSel] = useState<Punto | null>(null)

  if (sel) {
    const gmaps =
      sel.lat != null && sel.lng != null
        ? `https://www.google.com/maps/search/?api=1&query=${sel.lat},${sel.lng}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${sel.nombre}, Santiago, Chile`,
          )}`
    const tel = sel.contactoTelefono ? telLimpio(sel.contactoTelefono) : null
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
              <p className="text-sm text-slate-500">
                Punto de predicación ·{' '}
                {sel.tipo === 'pendon' ? 'Pendón' : 'Carrito'}
              </p>

              <div className="mt-3 space-y-1.5 text-sm text-slate-700">
                <p>
                  🕗 <b>Horario:</b> {TURNO}
                </p>
                <p>
                  📅 <b>Días:</b>{' '}
                  {[
                    sel.operaSemana && 'Lunes a viernes',
                    sel.operaSabado && 'Sábado',
                  ]
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

          {/* Retiro del exhibidor + contacto */}
          <Tarjeta className="p-4">
            <h3 className="font-bold text-slate-800 mb-2">
              🛒 Retiro del exhibidor
            </h3>
            <div className="space-y-1.5 text-sm text-slate-700">
              <p>
                🏠 <b>Dirección:</b> {sel.lugarRetiro}
              </p>
              <p>
                👨‍👩‍👧 <b>{sel.familia}</b>
              </p>
            </div>

            {sel.contactoNombre || tel ? (
              <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
                <p className="text-xs text-slate-400 font-medium mb-1">
                  Contacto
                </p>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    {sel.contactoNombre && (
                      <p className="font-semibold text-slate-800 truncate">
                        {sel.contactoNombre}
                      </p>
                    )}
                    {sel.contactoTelefono && (
                      <p className="text-sm text-slate-500">
                        {sel.contactoTelefono}
                      </p>
                    )}
                  </div>
                  {tel && (
                    <div className="flex gap-2 shrink-0">
                      <a
                        href={`tel:${tel}`}
                        className="h-11 w-11 flex items-center justify-center rounded-full bg-sky-100 text-xl"
                        title="Llamar"
                      >
                        📞
                      </a>
                      <a
                        href={`https://wa.me/${tel.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-11 w-11 flex items-center justify-center rounded-full bg-green-100 text-xl"
                        title="WhatsApp"
                      >
                        💬
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-400">
                (Contacto por confirmar — coordina con el encargado)
              </p>
            )}
          </Tarjeta>
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
                  Retiro: {p.lugarRetiro} ({p.familia})
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
