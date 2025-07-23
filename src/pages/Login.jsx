import { useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    // Chequea si ya hay una sesión activa
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate('/dashboard')
      }
    })

    // Listener para login nuevo
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/dashboard')
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [navigate])

  return (
    <div style={styles.container}>
      <div style={styles.authBox}>
        <h1 style={styles.title}>Bienvenido</h1>
        <p style={styles.subtitle}>Inicia sesión para continuar</p>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={['google']}
        />
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(to right, #1e1e2e, #232946)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authBox: {
    backgroundColor: '#2a2a40',
    padding: '3rem',
    borderRadius: '1rem',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#cbd5e1',
    marginBottom: '2rem',
  },
}
