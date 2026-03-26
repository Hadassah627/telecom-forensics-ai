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
      const lat = row.lat ?? row.latitude
      const lng = row.lng ?? row.longitude
      const coords =
        Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))
          ? [Number(lat), Number(lng)]
          : getCoordsFromLocation(row.location)
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

function createIcon(color) {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<span style="display:inline-block;width:14px;height:14px;border-radius:999px;border:2px solid #fff;background:${color};box-shadow:0 0 8px rgba(15,23,42,.6)"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -8],
  })
}

const CRIME_ICON = createIcon('#ef4444')
const SUSPECT_ICON = createIcon('#f59e0b')
const NORMAL_ICON = createIcon('#22c55e')

function MapView({ towerData = null, rows = [], crimeTowerId = null, suspectTowers = [] }) {
  const sourceRows = Array.isArray(towerData?.towers) ? towerData.towers : rows
  const points = useMemo(() => buildTowerPoints(sourceRows), [sourceRows])
  const suspectSet = useMemo(
    () => new Set((suspectTowers || []).map((item) => String(item || '').toLowerCase())),
    [suspectTowers]
  )
  const crimeTowerKey = String(crimeTowerId || '').toLowerCase()

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
            <Marker
              key={`${point.towerId}-${idx}`}
              position={point.coords}
              icon={
                String(point.towerId || '').toLowerCase() === crimeTowerKey
                  ? CRIME_ICON
                  : suspectSet.has(String(point.towerId || '').toLowerCase())
                    ? SUSPECT_ICON
                    : NORMAL_ICON
              }
            >
              <Popup>
                <strong>{point.towerId}</strong>
                <br />
                {point.location}
                <br />
                {point.time || '-'}
              </Popup>
            </Marker>
          ))}
          {path.length > 1 && <Polyline positions={path} color="#38bdf8" weight={4} opacity={0.85} />}
        </MapContainer>
      </div>
    </div>
  )
}

export default MapView
