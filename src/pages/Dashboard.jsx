import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate('/')
      } else {
        setUser(data.user)
      }
    })
  }, [navigate])

  return (
    <div style={styles.page}>
      <Navbar user={user} />

      <main style={styles.content}>
        <h2>Bienvenido al Dashboard</h2>
        <p>Desde aquí puedes gestionar usuarios, ver topógrafos en tiempo real, y más.</p>
      </main>
    </div>
  )
}

const styles = {
  page: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    flexDirection: 'column',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: '2rem',
    textAlign: 'center',
  },
}
