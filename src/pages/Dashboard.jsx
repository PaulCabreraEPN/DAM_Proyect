import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [territories, setTerritories] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTerritories: 0,
    enCampo: 0,
    inactivos: 0
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate('/')
      } else {
        setUser(data.user)
        fetchData()
      }
    })
  }, [navigate])

  const fetchData = async () => {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, username, email, created_at')

    if (userError) {
      console.error('Error al traer usuarios:', userError)
      return
    }

    const { data: territoryData, error: territoryError } = await supabase
      .from('territories')
      .select('*')

    if (territoryError) {
      console.error('Error al traer territorios:', territoryError)
      return
    }

    const { data: locationData, error: locationError } = await supabase
      .from('locations')
      .select('id_user, status, latitude, longitude')

    if (locationError) {
      console.error('Error al traer locations:', locationError)
      return
    }

    const activeUserIds = new Set(
      locationData.filter(loc => loc.status === true && loc.id_user).map(loc => loc.id_user)
    )

    const usersWithStatus = userData.map(u => {
      const location = locationData.find(loc => loc.id_user === u.id)
      return {
        ...u,
        estado: activeUserIds.has(u.id) ? 'Activo' : 'Inactivo',
        latitude: location?.latitude || '—',
        longitude: location?.longitude || '—'
      }
    })

    setUsers(usersWithStatus)
    setTerritories(territoryData)

    setStats({
      totalUsers: usersWithStatus.length,
      totalTerritories: territoryData.length,
      enCampo: activeUserIds.size,
      inactivos: usersWithStatus.length - activeUserIds.size
    })
  }

  return (
    <div style={styles.container}>
      <Navbar user={user} />
      <main style={styles.main}>
        <header style={styles.header}>
          <h1>Dashboard</h1>
          <p>Resumen de Topógrafos y Territorios</p>
        </header>

        <section style={styles.statsGrid}>
          <StatCard title="Total Topógrafos" value={stats.totalUsers} color="#0d6efd" icon="👷‍♂️" />
          <StatCard title="Territorios Registrados" value={stats.totalTerritories} color="#198754" icon="🗺️" />
          <StatCard title="Trabajadores en campo" value={stats.enCampo} color="#ffc107" icon="🛠️" />
          <StatCard title="Inactivos" value={stats.inactivos} color="#dc3545" icon="❌" />
        </section>

        <section style={styles.tableSection}>
          <h2>Actividad de Usuarios</h2>
          {users.length === 0 ? (
            <p>No hay usuarios registrados.</p>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeaderCell}>Nombre</th>
                    <th style={styles.tableHeaderCell}>Correo</th>
                    <th style={styles.tableHeaderCell}>Estado</th>
                    <th style={styles.tableHeaderCell}>Latitud</th>
                    <th style={styles.tableHeaderCell}>Longitud</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 10).map(usuario => (
                    <tr key={usuario.id}>
                      <td style={styles.tableCell}>{usuario.username || 'Sin nombre'}</td>
                      <td style={styles.tableCell}>{usuario.email}</td>
                      <td style={styles.tableCell}>
                        <span style={styles.statusBadge(usuario.estado)}>
                          {usuario.estado}
                        </span>
                      </td>
                      <td style={styles.tableCell}>{usuario.latitude}</td>
                      <td style={styles.tableCell}>{usuario.longitude}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function StatCard({ title, value, color, icon }) {
  return (
    <div style={{ ...styles.statCard, borderLeft: `6px solid ${color}` }}>
      <div>
        <h4>{title}</h4>
        <h2>{value}</h2>
      </div>
      <div style={{
        fontSize: 24,
        backgroundColor: `${color}22`,
        padding: 12,
        borderRadius: '50%'
      }}>
        {icon}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f3f4f6',
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
    marginBottom: '0.5rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem'
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  tableSection: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  tableContainer: {
    overflowX: 'auto',
    marginTop: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    minWidth: '600px',
  },
  tableHeaderCell: {
    backgroundColor: '#f1f5f9',
    fontWeight: '600',
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '2px solid #e2e8f0'
  },
  tableCell: {
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0'
  },
  statusBadge: estado => ({
    backgroundColor: estado === 'Activo' ? '#d1e7dd' : '#f8d7da',
    color: estado === 'Activo' ? '#0f5132' : '#842029',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '500',
    display: 'inline-block',
    minWidth: '70px',
    textAlign: 'center'
  })
}
