import { useMemo } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const LOCATION_COORDS = {
  hyderabad: [17.385, 78.4867],
  bangalore: [12.9716, 77.5946],
  bengaluru: [12.9716, 77.5946],
  delhi: [28.6139, 77.209],
  chennai: [13.0827, 80.2707],
  mumbai: [19.076, 72.8777],
  pune: [18.5204, 73.8567],
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

function getCoordsFromLocation(location = '') {
  const key = String(location).trim().toLowerCase()
  return LOCATION_COORDS[key] || null
}

function buildTowerPoints(rows = []) {
  return rows
    .map((row) => {
      const coords = getCoordsFromLocation(row.location)
      if (!coords) {
        return null
      }
      return {
        towerId: row.tower_id || row.tower || 'Unknown tower',
        location: row.location,
        time: row.time || row.timestamp || null,
        coords,
      }
    })
    .filter(Boolean)
}

function MapView({ rows = [] }) {
  const points = useMemo(() => buildTowerPoints(rows), [rows])

  if (!points.length) {
    return (
      <div className="result-block">
        <h3>Map View</h3>
        <p className="muted">No map locations available for this result.</p>
      </div>
    )
  }

  const center = points[0].coords
  const path = points.map((point) => point.coords)

  return (
    <div className="result-block">
      <h3>Map View</h3>
      <div className="map-wrap">
        <MapContainer center={center} zoom={6} scrollWheelZoom className="forensics-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((point, idx) => (
            <Marker key={`${point.towerId}-${idx}`} position={point.coords}>
              <Popup>
                <strong>{point.towerId}</strong>
                <br />
                {point.location}
                <br />
                {point.time || '-'}
              </Popup>
            </Marker>
          ))}
          {path.length > 1 && <Polyline positions={path} color="#1d4ed8" weight={4} opacity={0.8} />}
        </MapContainer>
      </div>
    </div>
  )
}

export default MapView
