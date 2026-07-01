import { acciones, useApp } from '../../store'
import { type Punto } from '../../types'
import { Boton, Tarjeta } from '../../ui'

export default function Puntos() {
  const s = useApp()

  function nuevo() {
    const nombre = prompt('Nombre del punto (ej: Carrito Plaza Centro):')
    if (!nombre?.trim()) return
    const p: Punto = {
      id: 'p_' + Date.now().toString(36),
      nombre: nombre.trim(),
      tipo: 'carrito',
      familia: '',
      lugarRetiro: '',
      lugarAsignacion: '',
      operaSemana: true,
      operaSabado: true,
      activo: true,
    }
    acciones.guardarPunto(p)
  }

  return (
    <div className="p-4 space-y-3">
      <Boton onClick={nuevo} className="w-full">
        ＋ Agregar punto
      </Boton>

      {s.puntos.map((p) => (
        <Tarjeta key={p.id} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <input
              value={p.nombre}
              onChange={(e) =>
                acciones.guardarPunto({ ...p, nombre: e.target.value })
              }
              className="font-bold text-slate-800 border-b border-transparent focus:border-slate-300 outline-none flex-1"
            />
            <button
              onClick={() => {
                if (confirm(`¿Eliminar ${p.nombre}?`))
                  acciones.eliminarPunto(p.id)
              }}
              className="text-slate-400 hover:text-red-500 px-2"
            >
              🗑️
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <Campo
              etiqueta="Familia"
              valor={p.familia}
              onChange={(v) => acciones.guardarPunto({ ...p, familia: v })}
            />
            <Select
              etiqueta="Tipo"
              valor={p.tipo}
              opciones={[
                { v: 'carrito', t: 'Carrito' },
                { v: 'pendon', t: 'Pendón' },
              ]}
              onChange={(v) =>
                acciones.guardarPunto({ ...p, tipo: v as Punto['tipo'] })
              }
            />
            <Campo
              etiqueta="Retiro del exhibidor (dirección)"
              valor={p.lugarRetiro}
              onChange={(v) => acciones.guardarPunto({ ...p, lugarRetiro: v })}
            />
            <Campo
              etiqueta="Contacto retiro (nombre)"
              valor={p.contactoNombre ?? ''}
              onChange={(v) =>
                acciones.guardarPunto({ ...p, contactoNombre: v || undefined })
              }
            />
            <Campo
              etiqueta="Contacto retiro (teléfono)"
              valor={p.contactoTelefono ?? ''}
              onChange={(v) =>
                acciones.guardarPunto({
                  ...p,
                  contactoTelefono: v || undefined,
                })
              }
            />
            <Campo
              etiqueta="Foto (URL o ruta)"
              valor={p.foto ?? ''}
              onChange={(v) =>
                acciones.guardarPunto({ ...p, foto: v || undefined })
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <Campo
                etiqueta="Latitud"
                valor={p.lat != null ? String(p.lat) : ''}
                onChange={(v) => {
                  const n = parseFloat(v)
                  acciones.guardarPunto({
                    ...p,
                    lat: Number.isFinite(n) ? n : undefined,
                  })
                }}
              />
              <Campo
                etiqueta="Longitud"
                valor={p.lng != null ? String(p.lng) : ''}
                onChange={(v) => {
                  const n = parseFloat(v)
                  acciones.guardarPunto({
                    ...p,
                    lng: Number.isFinite(n) ? n : undefined,
                  })
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm pt-1">
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={p.operaSemana}
                onChange={(e) =>
                  acciones.guardarPunto({ ...p, operaSemana: e.target.checked })
                }
              />
              Lun–Vie
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={p.operaSabado}
                onChange={(e) =>
                  acciones.guardarPunto({ ...p, operaSabado: e.target.checked })
                }
              />
              Sábado
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={p.activo}
                onChange={(e) =>
                  acciones.guardarPunto({ ...p, activo: e.target.checked })
                }
              />
              Activo
            </label>
          </div>
          <p className="text-xs text-slate-400">Turno único: 08:00–10:00</p>
        </Tarjeta>
      ))}
    </div>
  )
}

function Campo({
  etiqueta,
  valor,
  onChange,
}: {
  etiqueta: string
  valor: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="text-xs text-slate-500">{etiqueta}</span>
      <input
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 mt-0.5"
      />
    </label>
  )
}

function Select({
  etiqueta,
  valor,
  opciones,
  onChange,
}: {
  etiqueta: string
  valor: string
  opciones: { v: string; t: string }[]
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="text-xs text-slate-500">{etiqueta}</span>
      <select
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 mt-0.5 bg-white"
      >
        {opciones.map((o) => (
          <option key={o.v} value={o.v}>
            {o.t}
          </option>
        ))}
      </select>
    </label>
  )
}
