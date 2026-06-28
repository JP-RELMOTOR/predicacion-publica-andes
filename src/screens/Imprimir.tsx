import { useApp } from '../store'
import { etiquetaMes } from '../lib/dates'
import { Boton } from '../ui'
import ProgramaTabla from '../components/ProgramaTabla'

const RECOMENDACIONES = [
  'Los publicadores que atienden un exhibidor deben ser de trato afectuoso, amable y atrayente.',
  'No deben abordar directamente a la gente, sino dejar que esta los aborde a ellos.',
  'Las sonrisas cálidas y el contacto visual adecuado son fundamentales.',
  'Evitar usar innecesariamente dispositivos electrónicos o conversar demasiado entre sí.',
  'Cuando sea posible, dar amplia publicidad a jw.org.',
  'Por seguridad y por el carácter voluntario del ministerio, no aceptar donaciones ni colocar cajas de contribuciones.',
]

export default function Imprimir() {
  const s = useApp()
  const mesId = s.mesActivoId

  return (
    <div className="p-4 space-y-4">
      <div className="no-print flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Vista para compartir. Toca el botón y elige “Guardar como PDF”.
        </p>
        <Boton onClick={() => window.print()}>🖨️ Guardar PDF</Boton>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 print:border-0 print:p-0">
        <div className="text-center mb-4 no-print">
          <h2 className="text-lg font-bold text-slate-800">
            Programa de Predicación Pública — {etiquetaMes(mesId)}
          </h2>
          <p className="text-sm text-slate-500">Congregación Andes</p>
        </div>

        <ProgramaTabla mesId={mesId} />

        <div className="mt-5 text-[11px] text-slate-600">
          <p className="font-bold mb-1">Recomendaciones:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {RECOMENDACIONES.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
