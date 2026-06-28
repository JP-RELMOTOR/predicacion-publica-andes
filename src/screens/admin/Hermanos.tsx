import { useState } from 'react'
import { acciones, useApp } from '../../store'
import { Avatar, Boton, Tarjeta } from '../../ui'

export default function Hermanos() {
  const s = useApp()
  const [nuevo, setNuevo] = useState('')

  const lista = s.hermanos
    .slice()
    .sort((a, b) => a.nombre.localeCompare(b.nombre))

  return (
    <div className="p-4 space-y-3">
      <Tarjeta className="p-3">
        <div className="flex gap-2">
          <input
            value={nuevo}
            onChange={(e) => setNuevo(e.target.value)}
            placeholder="Agregar hermano…"
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2"
          />
          <Boton
            onClick={() => {
              if (nuevo.trim()) {
                acciones.agregarHermano(nuevo.trim())
                setNuevo('')
              }
            }}
          >
            Agregar
          </Boton>
        </div>
      </Tarjeta>

      <p className="text-xs text-slate-500 px-1">
        {lista.length} hermanos · toca para editar
      </p>

      <div className="space-y-2">
        {lista.map((h) => (
          <Tarjeta key={h.id} className="p-3">
            <div className="flex items-center gap-3">
              <Avatar nombre={h.nombre} size={36} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-800 truncate">
                  {h.nombre}
                </div>
                <div className="flex gap-1.5 mt-0.5">
                  {h.esAdmin && (
                    <span className="text-xs text-amber-600 font-medium">
                      Admin
                    </span>
                  )}
                  {!h.activo && (
                    <span className="text-xs text-slate-400">Inactivo</span>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <IconBtn
                  titulo={h.esAdmin ? 'Quitar admin' : 'Hacer admin'}
                  activo={h.esAdmin}
                  onClick={() =>
                    acciones.editarHermano(h.id, { esAdmin: !h.esAdmin })
                  }
                >
                  ⭐
                </IconBtn>
                <IconBtn
                  titulo={h.activo ? 'Desactivar' : 'Activar'}
                  activo={h.activo}
                  onClick={() =>
                    acciones.editarHermano(h.id, { activo: !h.activo })
                  }
                >
                  {h.activo ? '👁️' : '🚫'}
                </IconBtn>
                <IconBtn
                  titulo="Renombrar"
                  onClick={() => {
                    const n = prompt('Nuevo nombre:', h.nombre)
                    if (n && n.trim())
                      acciones.editarHermano(h.id, { nombre: n.trim() })
                  }}
                >
                  ✏️
                </IconBtn>
                <IconBtn
                  titulo="Eliminar"
                  peligro
                  onClick={() => {
                    if (confirm(`¿Eliminar a ${h.nombre}?`))
                      acciones.eliminarHermano(h.id)
                  }}
                >
                  🗑️
                </IconBtn>
              </div>
            </div>
          </Tarjeta>
        ))}
      </div>
    </div>
  )
}

function IconBtn({
  children,
  onClick,
  titulo,
  activo,
  peligro,
}: {
  children: React.ReactNode
  onClick: () => void
  titulo: string
  activo?: boolean
  peligro?: boolean
}) {
  return (
    <button
      title={titulo}
      onClick={onClick}
      className={`h-9 w-9 rounded-lg flex items-center justify-center text-sm ${
        peligro
          ? 'hover:bg-red-50'
          : activo
            ? 'bg-amber-50'
            : 'hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  )
}
