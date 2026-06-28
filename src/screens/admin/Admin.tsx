import { useState } from 'react'
import { acciones, getMes, useApp } from '../../store'
import { etiquetaMes } from '../../lib/dates'
import { Boton, Etiqueta, Tarjeta } from '../../ui'
import Armar from './Armar'
import Disponibilidades from './Disponibilidades'
import Hermanos from './Hermanos'
import Puntos from './Puntos'
import Imprimir from '../Imprimir'

type Pestana = 'resumen' | 'armar' | 'disp' | 'hermanos' | 'puntos' | 'pdf'

const TABS: { id: Pestana; label: string; icono: string }[] = [
  { id: 'resumen', label: 'Resumen', icono: '🏠' },
  { id: 'disp', label: 'Disponibilidad', icono: '✅' },
  { id: 'armar', label: 'Armar programa', icono: '🧩' },
  { id: 'pdf', label: 'PDF', icono: '🖨️' },
  { id: 'hermanos', label: 'Hermanos', icono: '👥' },
  { id: 'puntos', label: 'Puntos', icono: '📍' },
]

export default function Admin() {
  const s = useApp()
  const [tab, setTab] = useState<Pestana>('resumen')
  const mes = getMes(s, s.mesActivoId)

  return (
    <div className="pb-20">
      {/* Selector de mes */}
      <div className="bg-slate-800 text-white px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <select
              value={s.mesActivoId}
              onChange={(e) => acciones.setMesActivo(e.target.value)}
              className="bg-slate-700 text-white rounded-lg px-3 py-1.5 font-semibold"
            >
              {s.meses
                .slice()
                .sort((a, b) => b.id.localeCompare(a.id))
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {etiquetaMes(m.id)}
                  </option>
                ))}
            </select>
            <button
              onClick={() => {
                const v = prompt('Nuevo mes (formato AAAA-MM, ej: 2026-08):')
                if (v && /^\d{4}-\d{2}$/.test(v)) {
                  const [a, m] = v.split('-').map(Number)
                  acciones.crearMes(a, m)
                }
              }}
              className="rounded-lg bg-slate-700 px-2.5 py-1.5 text-sm hover:bg-slate-600"
              title="Crear mes"
            >
              ＋
            </button>
          </div>
          <div className="flex gap-1.5">
            {mes?.abierto ? (
              <Etiqueta color="green">Abierto</Etiqueta>
            ) : (
              <Etiqueta color="slate">Cerrado</Etiqueta>
            )}
            {mes?.publicado && <Etiqueta color="sky">Publicado</Etiqueta>}
          </div>
        </div>
      </div>

      {/* Pestañas */}
      <div className="bg-white border-b border-slate-200 overflow-x-auto no-print">
        <div className="flex">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-3.5 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-sky-600 text-sky-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="mr-1">{t.icono}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {tab === 'resumen' && <Resumen />}
        {tab === 'disp' && <Disponibilidades />}
        {tab === 'armar' && <Armar />}
        {tab === 'pdf' && <Imprimir />}
        {tab === 'hermanos' && <Hermanos />}
        {tab === 'puntos' && <Puntos />}
      </div>
    </div>
  )
}

function Resumen() {
  const s = useApp()
  const mesId = s.mesActivoId
  const mes = getMes(s, mesId)
  const totalActivos = s.hermanos.filter((h) => h.activo).length
  const enviadas = s.disponibilidad.filter(
    (d) => d.mesId === mesId && d.enviada,
  ).length
  const slotsAsignados = Object.keys(s.asignaciones[mesId] ?? {}).length

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <MiniDato valor={`${enviadas}/${totalActivos}`} etiqueta="Respondieron" />
        <MiniDato valor={String(slotsAsignados)} etiqueta="Turnos armados" />
        <MiniDato
          valor={String(s.puntos.filter((p) => p.activo).length)}
          etiqueta="Puntos activos"
        />
      </div>

      <Tarjeta className="p-4 space-y-3">
        <h2 className="font-bold text-slate-800">
          Mes: {etiquetaMes(mesId)}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Boton
            variante={mes?.abierto ? 'secundario' : 'primario'}
            onClick={() => acciones.setMesAbierto(mesId, !mes?.abierto)}
          >
            {mes?.abierto
              ? '🔒 Cerrar recepción'
              : '🔓 Abrir recepción de disponibilidad'}
          </Boton>
          <Boton
            variante={mes?.publicado ? 'secundario' : 'primario'}
            onClick={() => acciones.setMesPublicado(mesId, !mes?.publicado)}
          >
            {mes?.publicado ? '🙈 Despublicar programa' : '📣 Publicar programa'}
          </Boton>
        </div>
        <p className="text-xs text-slate-500">
          {mes?.abierto
            ? 'Los hermanos pueden marcar su disponibilidad ahora.'
            : 'La recepción está cerrada; los hermanos no pueden editar.'}{' '}
          {mes?.publicado
            ? 'El programa es visible para todos.'
            : 'El programa todavía no es visible para los hermanos.'}
        </p>
      </Tarjeta>

      <Tarjeta className="p-4">
        <h2 className="font-bold text-slate-800 mb-2">¿Cómo se usa?</h2>
        <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
          <li>Abre la recepción del mes.</li>
          <li>Los hermanos marcan su disponibilidad.</li>
          <li>En “Armar programa” asignas las parejas.</li>
          <li>Publica el programa y compártelo (PDF).</li>
        </ol>
      </Tarjeta>
    </div>
  )
}

function MiniDato({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  return (
    <Tarjeta className="p-3 text-center">
      <div className="text-2xl font-bold text-sky-700">{valor}</div>
      <div className="text-xs text-slate-500">{etiqueta}</div>
    </Tarjeta>
  )
}
