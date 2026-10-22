import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { HOODS } from './data'

// Quartieri = cerchi tratteggiati (vuoti). Selezionato / spazio prenotato = riempimento giallo.
export default function MapView({ spaces = [], hood, onHood, onSpace, pick, onPick, height = 380 }) {
  const el = useRef(), map = useRef(), layer = useRef()

  useEffect(() => {
    map.current = L.map(el.current).setView([52.51, 13.41], 12)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO', maxZoom: 19,
    }).addTo(map.current)
    layer.current = L.layerGroup().addTo(map.current)
    return () => map.current.remove()
  }, [])

  useEffect(() => {
    const m = map.current
    m.off('click')
    if (onPick) m.on('click', (e) => onPick(e.latlng.lat, e.latlng.lng))
  }, [onPick])

  useEffect(() => {
    const g = layer.current
    g.clearLayers()
    const stop = (fn) => (e) => { L.DomEvent.stopPropagation(e); fn() }
    if (onHood) {
      Object.entries(HOODS).forEach(([n, c]) => {
        const on = hood === n
        L.circle(c, { radius: 1500, color: '#FFD100', weight: 2, dashArray: on ? null : '6 6', fillColor: '#FFD100', fillOpacity: on ? 0.22 : 0 })
          .on('click', stop(() => onHood(on ? '' : n)))
          .bindTooltip(n, { permanent: true, direction: 'center', className: 'hood' })
          .addTo(g)
      })
    }
    spaces.forEach((s) =>
      L.circleMarker([s.lat, s.lng], { radius: 8, color: '#FFD100', weight: 2, fillColor: '#FFD100', fillOpacity: s.booked ? 1 : 0.12, dashArray: s.booked ? null : '3 3' })
        .on('click', stop(() => onSpace && onSpace(s.id)))
        .bindTooltip(s.name)
        .addTo(g)
    )
    if (pick) L.circleMarker(pick, { radius: 9, color: '#fff', weight: 2, fillColor: '#FFD100', fillOpacity: 1 }).addTo(g)
  }, [spaces, hood, pick, onHood, onSpace])

  return <div ref={el} className="map" style={{ height }} />
}
