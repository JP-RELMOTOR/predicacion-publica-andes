import { useState } from 'react'
import { ADMIN_PIN } from '../config'
import { Boton } from '../ui'

export default function PinDialog({
  titulo,
  onOk,
  onCancel,
}: {
  titulo: string
  onOk: () => void
  onCancel: () => void
}) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  function verificar() {
    if (pin === ADMIN_PIN) {
      onOk()
    } else {
      setError(true)
      setPin('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-5 w-full max-w-xs shadow-xl">
        <h3 className="font-bold text-slate-800 mb-1">🔒 PIN del encargado</h3>
        <p className="text-sm text-slate-500 mb-3">{titulo}</p>
        <input
          type="tel"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ''))
            setError(false)
          }}
          onKeyDown={(e) => e.key === 'Enter' && verificar()}
          placeholder="••••••"
          className={`w-full text-center text-2xl tracking-widest rounded-xl border px-3 py-2.5 mb-2 ${
            error ? 'border-red-400 bg-red-50' : 'border-slate-300'
          }`}
        />
        {error && (
          <p className="text-xs text-red-500 text-center mb-2">
            PIN incorrecto. Pídeselo al encargado.
          </p>
        )}
        <div className="flex gap-2">
          <Boton variante="secundario" className="flex-1" onClick={onCancel}>
            Cancelar
          </Boton>
          <Boton className="flex-1" onClick={verificar} disabled={!pin}>
            Aceptar
          </Boton>
        </div>
      </div>
    </div>
  )
}
