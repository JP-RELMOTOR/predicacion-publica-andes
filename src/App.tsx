import { useEffect, useState } from 'react'
import {
  desvincularDispositivo,
  getHermano,
  useAnclaje,
  useApp,
  useNubeLista,
} from './store'
import Setup from './screens/Setup'
import MisAsignaciones from './screens/MisAsignaciones'
import PuntosGaleria from './screens/PuntosGaleria'
import Disponibilidad from './screens/Disponibilidad'
import Admin from './screens/admin/Admin'
import MenuUsuario from './components/MenuUsuario'
import AvisoActualizacion from './components/AvisoActualizacion'

type Vista = 'turnos' | 'puntos' | 'disp' | 'admin'

export default function App() {
  const s = useApp()
  const anclaje = useAnclaje()
  const nubeLista = useNubeLista()
  const [vista, setVista] = useState<Vista>('turnos')

  const hermano = anclaje.activo ? getHermano(s, anclaje.activo) : undefined

  // si el perfil anclado ya no existe en la lista (y la nube ya cargó), desvincular
  useEffect(() => {
    if (anclaje.activo && nubeLista && s.hermanos.length > 0 && !hermano) {
      desvincularDispositivo()
    }
  }, [anclaje.activo, nubeLista, s.hermanos.length, hermano])

  if (!anclaje.activo || !hermano) {
    // sin anclar (o el perfil aún no carga de la nube)
    if (anclaje.activo && !hermano) {
      return (
        <div className="min-h-full flex items-center justify-center text-slate-400">
          <div className="text-center">
            <p className="text-3xl mb-2">⏳</p>Cargando…
          </div>
        </div>
      )
    }
    return <Setup />
  }

  const nav: { id: Vista; label: string; icono: string }[] = [
    { id: 'turnos', label: 'Mis Turnos', icono: '🗓️' },
    { id: 'puntos', label: 'Puntos', icono: '📍' },
    { id: 'disp', label: 'Disponibilidad', icono: '✅' },
  ]
  if (hermano.esAdmin) nav.push({ id: 'admin', label: 'Admin', icono: '🛠️' })

  const titulos: Record<Vista, string> = {
    turnos: 'Mis Asignaciones',
    puntos: 'Puntos de Predicación',
    disp: 'Mi Disponibilidad',
    admin: 'Administración',
  }

  return (
    <div className="min-h-full flex flex-col bg-slate-100">
      {/* Encabezado */}
      <header className="no-print bg-sky-800 text-white px-4 py-2.5 flex items-center justify-between sticky top-0 z-20">
        <div>
          <div className="text-[11px] text-sky-200 leading-none">
            Predicación Pública · Andes
          </div>
          <div className="font-semibold leading-tight">{titulos[vista]}</div>
        </div>
        <MenuUsuario hermano={hermano} />
      </header>

      {/* Contenido */}
      <main className="flex-1 overflow-y-auto pb-20">
        {vista === 'turnos' && <MisAsignaciones hermanoId={hermano.id} />}
        {vista === 'puntos' && <PuntosGaleria />}
        {vista === 'disp' && <Disponibilidad hermanoId={hermano.id} />}
        {vista === 'admin' && hermano.esAdmin && <Admin />}
      </main>

      {/* Aviso de versión nueva */}
      <AvisoActualizacion />

      {/* Navegación inferior */}
      <nav className="no-print fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 flex z-20">
        {nav.map((n) => (
          <button
            key={n.id}
            onClick={() => setVista(n.id)}
            className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-[11px] font-medium ${
              vista === n.id ? 'text-sky-700' : 'text-slate-400'
            }`}
          >
            <span
              className={`text-lg px-3 rounded-full ${
                vista === n.id ? 'bg-sky-100' : ''
              }`}
            >
              {n.icono}
            </span>
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
