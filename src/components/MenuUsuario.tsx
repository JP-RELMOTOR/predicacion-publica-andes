import { useState } from 'react'
import {
  anclarPerfil,
  cambiarPerfilActivo,
  desvincularDispositivo,
  useAnclaje,
  useApp,
} from '../store'
import { NOTA_PRIVACIDAD, WHATSAPP_AYUDA } from '../config'
import type { Hermano } from '../types'
import { Avatar, Boton, Tarjeta } from '../ui'
import PinDialog from './PinDialog'

type Modal = null | 'perfil' | 'pin-agregar' | 'agregar' | 'pin-desvincular'

export default function MenuUsuario({ hermano }: { hermano: Hermano }) {
  const s = useApp()
  const anclaje = useAnclaje()
  const [abierto, setAbierto] = useState(false)
  const [modal, setModal] = useState<Modal>(null)

  const otro = anclaje.anclados
    .filter((id) => id !== hermano.id)
    .map((id) => s.hermanos.find((h) => h.id === id))
    .find(Boolean)

  const puntoPref = s.puntos.find((p) => p.id === hermano.puntoPreferidoId)

  function cerrar() {
    setAbierto(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setAbierto((v) => !v)}
        aria-label="Menú de usuario"
        className="rounded-full ring-2 ring-sky-300/60"
      >
        <Avatar nombre={hermano.nombre} size={36} />
      </button>

      {abierto && (
        <>
          {/* fondo para cerrar al tocar fuera */}
          <div className="fixed inset-0 z-30" onClick={cerrar} />
          <div className="absolute right-0 top-11 z-40 w-64 rounded-2xl bg-white shadow-xl border border-slate-200 py-2">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs text-slate-400">Conectado como</p>
              <p className="font-semibold text-slate-800 truncate">
                {hermano.nombre}
              </p>
            </div>

            {otro && (
              <ItemMenu
                icono="🔄"
                texto={`Cambiar a ${otro.nombre}`}
                onClick={() => {
                  cambiarPerfilActivo(otro.id)
                  cerrar()
                }}
              />
            )}

            <ItemMenu
              icono="👤"
              texto="Mi perfil"
              onClick={() => {
                setModal('perfil')
                cerrar()
              }}
            />

            <a
              href={`https://wa.me/${WHATSAPP_AYUDA}?text=${encodeURIComponent(
                `Hola, necesito ayuda con la app de Predicación Pública (soy ${hermano.nombre})`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              onClick={cerrar}
            >
              <span className="text-lg">💬</span> Ayuda (WhatsApp)
            </a>

            {anclaje.anclados.length < 2 && (
              <ItemMenu
                icono="➕"
                texto="Agregar persona a este teléfono"
                onClick={() => {
                  setModal('pin-agregar')
                  cerrar()
                }}
              />
            )}

            <div className="border-t border-slate-100 mt-1 pt-1">
              <ItemMenu
                icono="🔓"
                texto="Desvincular este teléfono"
                onClick={() => {
                  setModal('pin-desvincular')
                  cerrar()
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* ---- Modales ---- */}
      {modal === 'perfil' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
          <Tarjeta className="p-5 w-full max-w-xs text-center">
            <div className="flex justify-center">
              <Avatar nombre={hermano.nombre} size={64} />
            </div>
            <h3 className="font-bold text-slate-800 mt-3 text-lg">
              {hermano.nombre}
            </h3>
            {hermano.esAdmin && (
              <p className="text-xs font-semibold text-amber-600 mt-0.5">
                Administrador
              </p>
            )}
            <p className="text-sm text-slate-500 mt-2">
              📍 Punto preferido:{' '}
              <b>{puntoPref ? puntoPref.nombre : 'Sin preferencia'}</b>
            </p>
            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed text-left">
              {NOTA_PRIVACIDAD}
            </p>
            <Boton className="w-full mt-4" onClick={() => setModal(null)}>
              Cerrar
            </Boton>
          </Tarjeta>
        </div>
      )}

      {modal === 'pin-agregar' && (
        <PinDialog
          titulo="Para agregar otra persona a este teléfono."
          onOk={() => setModal('agregar')}
          onCancel={() => setModal(null)}
        />
      )}

      {modal === 'agregar' && (
        <SelectorAgregar
          excluir={anclaje.anclados}
          onElegir={(id) => {
            anclarPerfil(id)
            setModal(null)
          }}
          onCancel={() => setModal(null)}
        />
      )}

      {modal === 'pin-desvincular' && (
        <PinDialog
          titulo="Para desvincular los perfiles de este teléfono."
          onOk={() => {
            desvincularDispositivo()
            setModal(null)
          }}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  )
}

function ItemMenu({
  icono,
  texto,
  onClick,
}: {
  icono: string
  texto: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 text-left"
    >
      <span className="text-lg">{icono}</span> {texto}
    </button>
  )
}

function SelectorAgregar({
  excluir,
  onElegir,
  onCancel,
}: {
  excluir: string[]
  onElegir: (id: string) => void
  onCancel: () => void
}) {
  const s = useApp()
  const [busca, setBusca] = useState('')
  const lista = s.hermanos
    .filter((h) => h.activo && !excluir.includes(h.id))
    .filter((h) => h.nombre.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => a.nombre.localeCompare(b.nombre))

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-4 w-full max-w-xs shadow-xl max-h-[70vh] flex flex-col">
        <h3 className="font-bold text-slate-800 mb-2">¿A quién agregamos?</h3>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar…"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 mb-2"
        />
        <div className="flex-1 overflow-y-auto space-y-1">
          {lista.map((h) => (
            <button
              key={h.id}
              onClick={() => onElegir(h.id)}
              className="w-full flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-50 text-left"
            >
              <Avatar nombre={h.nombre} size={30} />
              <span className="text-sm text-slate-700">{h.nombre}</span>
            </button>
          ))}
        </div>
        <Boton variante="secundario" className="w-full mt-2" onClick={onCancel}>
          Cancelar
        </Boton>
      </div>
    </div>
  )
}
