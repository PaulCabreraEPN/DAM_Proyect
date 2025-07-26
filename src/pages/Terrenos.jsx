import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import { MapContainer, TileLayer, Polygon } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function Terrenos() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [territories, setTerritories] = useState([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate('/')
      } else {
        setUser(data.user)
        fetchTerritories()
      }
    })
  }, [navigate])

  const fetchTerritories = async () => {
    const { data, error } = await supabase.from('territories').select('*')
    if (error) {
      console.error('Error al traer territorios:', error)
      return
    }
    setTerritories(data)
  }

  const getPolygonCoords = (lat, lng, shape) => {
    const offset = 0.0005 // "radio" angular

    const createRegularPolygon = (sides) => {
      const coords = []
      for (let i = 0; i < sides; i++) {
        const angle = (2 * Math.PI * i) / sides
        const pointLat = lat + offset * Math.sin(angle)
        const pointLng = lng + offset * Math.cos(angle)
        coords.push([pointLat, pointLng])
      }
      return coords
    }

    switch (shape) {
      case 'Cuadrado':
        return [
          [lat - offset, lng - offset],
          [lat - offset, lng + offset],
          [lat + offset, lng + offset],
          [lat + offset, lng - offset],
        ]
      case 'Triángulo':
        return createRegularPolygon(3)
      case 'Pentágono':
        return createRegularPolygon(5)
      case 'Hexágono':
        return createRegularPolygon(6)
      case 'Círculo':
        return createRegularPolygon(12) // más lados = más "circular"
      default:
        return []
    }
  }


  return (
    <div style={styles.container}>
      <Navbar user={user} />
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.title}>🌍 Terrenos Registrados</h1>
          <p style={styles.subtitle}>Visualiza los terrenos guardados con su ubicación geográfica.</p>
        </header>

        <section style={styles.tableSection}>
          {territories.length === 0 ? (
            <p>No hay territorios registrados.</p>
          ) : (
            <>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeaderCell}>Área (m²)</th>
                      <th style={styles.tableHeaderCell}>Latitud</th>
                      <th style={styles.tableHeaderCell}>Longitud</th>
                      <th style={styles.tableHeaderCell}>Propiedades</th>
                      <th style={styles.tableHeaderCell}>Forma</th>
                      <th style={styles.tableHeaderCell}>Creado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {territories.map(t => (
                      <tr key={t.id}>
                        <td style={styles.tableCell}>{t.area}</td>
                        <td style={styles.tableCell}>{t.latitude}</td>
                        <td style={styles.tableCell}>{t.longitude}</td>
                        <td style={styles.tableCell}>{t.propieties}</td>
                        <td style={styles.tableCell}>{t.polygon}</td>
                        <td style={styles.tableCell}>
                          {new Date(t.created_at).toLocaleString('es-EC')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Mapa de Territorios</h2>
                <MapContainer
                  center={[territories[0].latitude, territories[0].longitude]}
                  zoom={18}
                  style={{ height: '400px', borderRadius: '12px' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  {territories.map((t, i) => (
                    <Polygon
                      key={i}
                      positions={getPolygonCoords(t.latitude, t.longitude, t.polygon)}
                      pathOptions={{ color: 'blue' }}
                    />
                  ))}
                </MapContainer>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f0f4f8',
    overflow: 'hidden'
  },
  main: {
    padding: '2rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  header: {
    textAlign: 'center'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#64748b'
  },
  tableSection: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '700px'
  },
  tableHeaderCell: {
    backgroundColor: '#e2e8f0',
    fontWeight: '600',
    padding: '14px 18px',
    textAlign: 'left',
    borderBottom: '2px solid #cbd5e1'
  },
  tableCell: {
    padding: '12px 18px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  }
}
