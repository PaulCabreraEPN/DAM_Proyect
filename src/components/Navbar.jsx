import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Navbar({ user }) {
  const navigate = useNavigate()

  const logout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo}>📐 GeoAdmin</h1>
      <ul style={styles.menu}>
        <li style={styles.link} onClick={() => navigate('/dashboard')}>Inicio</li>
        <li style={styles.link} onClick={() => navigate('/usuarios')}>Usuarios</li>
        <li style={styles.link} onClick={() => navigate('/topografos')}>Topógrafos</li>
        <li style={styles.link} onClick={() => navigate('/terrenos')}>Terrenos</li>
        <li style={styles.link} onClick={() => navigate('/mapa')}>Mapa en tiempo real</li>
      </ul>
      <div style={styles.userArea}>
        <span style={styles.userInfo}>👤 {user?.email}</span>
        <button onClick={logout} style={styles.logoutButton}>Salir</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e1e2e', // Igual que el Dashboard
    padding: '1rem 2rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    color: '#fff',
  },
  logo: {
    fontSize: '1.5rem',
    color: '#fff',
    fontWeight: 'bold',
  },
  menu: {
    display: 'flex',
    gap: '2rem',
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  link: {
    color: '#cdd6f4',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    color: '#cdd6f4',
  },
  userInfo: {
    fontSize: '0.9rem',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4f46e5',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
}
