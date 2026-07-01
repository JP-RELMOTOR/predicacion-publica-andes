import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Mapa interactivo (OpenStreetMap vía Leaflet): se puede mover y acercar.
export default function MapaPunto({
  lat,
  lng,
  nombre,
}: {
  lat: number
  lng: number
  nombre: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const map = L.map(ref.current, { scrollWheelZoom: false }).setView(
      [lat, lng],
      16,
    )
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)
    const icono = L.divIcon({
      html: '<div style="font-size:30px;line-height:30px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.4))">📍</div>',
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    })
    L.marker([lat, lng], { icon: icono }).addTo(map).bindPopup(nombre)
    return () => {
      map.remove()
    }
  }, [lat, lng, nombre])

  return <div ref={ref} className="h-56 w-full rounded-xl z-0" />
}
