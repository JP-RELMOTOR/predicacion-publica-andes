import { useMemo, useState } from 'react'
import { anclarPerfil, useApp, useNubeLista } from '../store'
import { NOTA_PRIVACIDAD } from '../config'
import { Avatar, Boton } from '../ui'
import type { Hermano } from '../types'

// Pantalla de primera vez: ancla este teléfono a un hermano.
export default function Setup() {
  const s = useApp()
  const nubeLista = useNubeLista()
  const [busca, setBusca] = useState('')
  const [pendiente, setPendiente] = useState<Hermano | null>(null)

  const lista = useMemo(() => {
    const norm = (t: string) =>
      t
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
    const q = norm(busca)
    return s.hermanos
      .filter((h) => h.activo)
      .filter((h) => norm(h.nombre).includes(q))
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [s.hermanos, busca])

  return (
    <div className="min-h-full flex flex-col">
      <div className="bg-sky-800 text-white px-5 pt-10 pb-6">
        <p className="text-sky-200 text-sm font-medium">Congregación Andes</p>
        <h1 className="text-2xl font-bold leading-tight">Predicación Pública</h1>
        <p className="text-sky-200 text-sm mt-1">
          Configura este teléfono: elige tu nombre
        </p>
      </div>

      <div className="px-4 -mt-3 mb-3">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar mi nombre…"
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm outline-none focus:border-sky-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {!nubeLista && s.hermanos.length === 0 ? (
          <div className="text-center text-slate-400 py-14">
            <p className="text-3xl mb-2">⏳</p>
            Cargando la lista…
            <p className="text-xs mt-1">(se necesita internet la primera vez)</p>
          </div>
        ) : (
          <div className="space-y-2">
            {lista.map((h) => (
              <button
                key={h.id}
                onClick={() => setPendiente(h)}
                className="w-full flex items-center gap-3 rounded-2xl bg-white border border-slate-200 px-3 py-2.5 text-left hover:bg-slate-50 active:bg-slate-100 shadow-sm"
              >
                <Avatar nombre={h.nombre} />
                <span className="font-medium text-slate-800 flex-1">
                  {h.nombre}
                </span>
              </button>
            ))}
            {lista.length === 0 && nubeLista && (
              <div className="text-center text-slate-400 py-10">
                No encontré ese nombre. Habla con el encargado.
              </div>
            )}
          </div>
        )}

        <p className="text-[11px] text-slate-400 mt-6 px-2 text-center leading-relaxed">
          {NOTA_PRIVACIDAD}
        </p>
      </div>

      {/* Confirmación de anclaje */}
      {pendiente && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-5 w-full max-w-xs shadow-xl text-center">
            <Avatar nombre={pendiente.nombre} size={56} />
            <h3 className="font-bold text-slate-800 mt-3">
              ¿Eres {pendiente.nombre}?
            </h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              Este teléfono quedará asociado a tu nombre y entrarás directo cada
              vez que abras la app.
            </p>
            <div className="flex flex-col gap-2">
              <Boton onClick={() => anclarPerfil(pendiente.id)}>
                Sí, soy yo
              </Boton>
              <Boton variante="secundario" onClick={() => setPendiente(null)}>
                Cancelar
              </Boton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
