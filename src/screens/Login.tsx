import { useMemo, useState } from 'react'
import { acciones, entrar, useApp } from '../store'
import { Avatar } from '../ui'

export default function Login() {
  const s = useApp()
  const [busca, setBusca] = useState('')

  const lista = useMemo(() => {
    const norm = (t: string) =>
      t
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
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
        <h1 className="text-2xl font-bold leading-tight">
          Predicación Pública
        </h1>
        <p className="text-sky-200 text-sm mt-1">
          Carritos y exhibidores · Elige tu nombre para entrar
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
        <div className="space-y-2">
          {lista.map((h) => (
            <button
              key={h.id}
              onClick={() => entrar(h.id)}
              className="w-full flex items-center gap-3 rounded-2xl bg-white border border-slate-200 px-3 py-2.5 text-left hover:bg-slate-50 active:bg-slate-100 shadow-sm"
            >
              <Avatar nombre={h.nombre} />
              <span className="font-medium text-slate-800 flex-1">
                {h.nombre}
              </span>
              {h.esAdmin && (
                <span className="text-xs font-semibold text-amber-600">
                  Admin
                </span>
              )}
            </button>
          ))}
          {lista.length === 0 && (
            <div className="text-center text-slate-400 py-10">
              No encontré ese nombre.
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          ¿No apareces?{' '}
          <button
            className="underline"
            onClick={() => {
              const n = prompt('Escribe tu nombre completo:')
              if (n && n.trim()) acciones.agregarHermano(n.trim())
            }}
          >
            Agrégate aquí
          </button>
        </p>
      </div>
    </div>
  )
}
