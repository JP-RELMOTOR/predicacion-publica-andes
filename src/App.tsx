import { useEffect, useState } from 'react'
import { getHermano, salir, useApp, useSesion } from './store'
import Login from './screens/Login'
import Disponibilidad from './screens/Disponibilidad'
import VerPrograma from './screens/VerPrograma'
import Admin from './screens/admin/Admin'

type Vista = 'disp' | 'programa' | 'admin'

export default function App() {
  const s = useApp()
  const sesionId = useSesion()
  const hermano = sesionId ? getHermano(s, sesionId) : undefined
  const [vista, setVista] = useState<Vista>('disp')

  // si la sesión apunta a un hermano que ya no existe, salir
  useEffect(() => {
    if (sesionId && !hermano) salir()
  }, [sesionId, hermano])

  if (!hermano) return <Login />

  const nav: { id: Vista; label: string; icono: string }[] = [
    { id: 'disp', label: 'Disponibilidad', icono: '📅' },
    { id: 'programa', label: 'Programa', icono: '📋' },
  ]
  if (hermano.esAdmin)
    nav.push({ id: 'admin', label: 'Admin', icono: '🛠️' })

  return (
    <div className="min-h-full flex flex-col bg-slate-100">
      {/* Encabezado */}
      <header className="no-print bg-sky-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div>
          <div className="text-xs text-sky-200 leading-none">
            Predicación Pública · Andes
          </div>
          <div className="font-semibold leading-tight">{hermano.nombre}</div>
        </div>
        <button
          onClick={salir}
          className="text-sm text-sky-100 bg-sky-700 hover:bg-sky-600 rounded-lg px-3 py-1.5"
        >
          Salir
        </button>
      </header>

      {/* Contenido */}
      <main className="flex-1 overflow-y-auto pb-20">
        {vista === 'disp' && <Disponibilidad hermanoId={hermano.id} />}
        {vista === 'programa' && <VerPrograma hermanoId={hermano.id} />}
        {vista === 'admin' && hermano.esAdmin && <Admin />}
      </main>

      {/* Navegación inferior */}
      <nav className="no-print fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 flex z-20">
        {nav.map((n) => (
          <button
            key={n.id}
            onClick={() => setVista(n.id)}
            className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 text-xs font-medium ${
              vista === n.id ? 'text-sky-700' : 'text-slate-400'
            }`}
          >
            <span className="text-lg">{n.icono}</span>
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
