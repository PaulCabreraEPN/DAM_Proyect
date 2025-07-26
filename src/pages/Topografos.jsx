import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'

export default function Topografos() {
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

  const [showModal, setShowModal] = useState(false)
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' })
  const [loadingInsert, setLoadingInsert] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const [lastCredentials, setLastCredentials] = useState({ username: '', password: '' })

  const [editingUser, setEditingUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

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
      .select('id_user, status')

    if (locationError) {
      console.error('Error al traer locations:', locationError)
      return
    }

    const activeUserIds = new Set(
      locationData.filter(loc => loc.status === true && loc.id_user).map(loc => loc.id_user)
    )

    const usersWithStatus = userData.map(u => ({
      ...u,
      estado: activeUserIds.has(u.id) ? 'Activo' : 'Inactivo'
    }))

    setUsers(usersWithStatus)
    setTerritories(territoryData)

    setStats({
      totalUsers: usersWithStatus.length,
      totalTerritories: territoryData.length,
      enCampo: activeUserIds.size,
      inactivos: usersWithStatus.length - activeUserIds.size
    })
  }

  const handleInsertUser = async () => {
    const { username, email, password } = newUser

    if (!username || !email || !password) {
      alert('Todos los campos son obligatorios.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert('Por favor, ingresa un correo electrónico válido.')
      return
    }

    setLoadingInsert(true)

    const { error } = await supabase
      .from('users')
      .insert([{ username, email, password }])

    setLoadingInsert(false)

    if (error) {
      alert('Error al insertar: ' + error.message)
    } else {
      setShowModal(false)
      setLastCredentials({ username, password })
      setShowCredentials(true)
      setNewUser({ username: '', email: '', password: '' })
      fetchData()
    }
  }

  const handleEditUser = async () => {
    const { id, username, email } = editingUser
    if (!username || !email) {
      alert('Todos los campos son obligatorios.')
      return
    }
    setLoadingInsert(true)
    const { error } = await supabase
      .from('users')
      .update({ username, email })
      .eq('id', id)
    setLoadingInsert(false)
    if (error) {
      alert('Error al actualizar: ' + error.message)
    } else {
      setShowEditModal(false)
      fetchData()
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    if (error) {
      alert('Error al eliminar: ' + error.message)
    } else {
      fetchData()
    }
  }

  function generateSecurePassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
    let password = ''
    for (let i = 0; i < length; i++) {
      const rand = Math.floor(Math.random() * charset.length)
      password += charset[rand]
    }
    return password
  }

  const copyToClipboard = () => {
    const text = `Usuario: ${lastCredentials.username}\nContraseña: ${lastCredentials.password}`
    navigator.clipboard.writeText(text)
      .then(() => alert('Credenciales copiadas al portapapeles'))
      .catch(err => alert('Error al copiar: ' + err))
  }

  return (
    <div style={styles.container}>
      <Navbar user={user} />
      <main style={styles.main}>
        <header style={styles.header}>
          <h1>Topógrafos</h1>
          <p>Listado de los trabajadores registrados</p>
        </header>

        <section style={styles.tableSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Registros</h2>
            <button style={styles.addBtn} onClick={() => setShowModal(true)}>+ Agregar usuario</button>
          </div>

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
                    <th style={styles.tableHeaderCell}>Registro</th>
                    <th style={styles.tableHeaderCell}>Acciones</th>
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
                      <td style={styles.tableCell}>
                        {new Date(usuario.created_at).toLocaleDateString()}
                      </td>
                      <td style={styles.tableCell}>
                        <button onClick={() => handleDeleteUser(usuario.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2>Agregar nuevo topógrafo</h2>
              <label>Nombre de usuario:</label>
              <input type="text" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} style={styles.input} placeholder="Usuario" />
              <label>Correo electrónico:</label>
              <input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} style={styles.input} placeholder="correo@ejemplo.com" />
              <label>Contraseña:</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="text" value={newUser.password} readOnly style={{ ...styles.input, flex: 1 }} placeholder="Contraseña generada" />
                <button type="button" onClick={() => setNewUser({ ...newUser, password: generateSecurePassword() })} style={{ padding: '8px 12px', cursor: 'pointer' }}>Generar</button>
              </div>
              <div style={styles.modalActions}>
                <button onClick={() => setShowModal(false)} style={styles.cancelBtn}>Cancelar</button>
                <button onClick={handleInsertUser} style={styles.confirmBtn} disabled={loadingInsert}>{loadingInsert ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && editingUser && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2>Editar topógrafo</h2>
              <label>Nombre:</label>
              <input type="text" value={editingUser.username} onChange={e => setEditingUser({ ...editingUser, username: e.target.value })} style={styles.input} />
              <label>Correo:</label>
              <input type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} style={styles.input} />
              <div style={styles.modalActions}>
                <button onClick={() => setShowEditModal(false)} style={styles.cancelBtn}>Cancelar</button>
                <button onClick={handleEditUser} style={styles.confirmBtn}>Guardar</button>
              </div>
            </div>
          </div>
        )}

        {showCredentials && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2>Usuario creado</h2>
              <p><strong>Usuario:</strong> {lastCredentials.username}</p>
              <p><strong>Contraseña:</strong> {lastCredentials.password}</p>
              <div style={styles.modalActions}>
                <button onClick={copyToClipboard} style={styles.confirmBtn}>Copiar credenciales</button>
                <button onClick={() => setShowCredentials(false)} style={styles.cancelBtn}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

const styles = {
  container: {
    display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh', width: '100vw', backgroundColor: '#f3f4f6', overflow: 'hidden'
  },
  main: {
    padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem'
  },
  header: {
    marginBottom: '0.5rem'
  },
  tableSection: {
    backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', flexGrow: 1, display: 'flex', flexDirection: 'column'
  },
  tableContainer: {
    overflowX: 'auto', marginTop: '1rem', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
  },
  table: {
    width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: '600px'
  },
  tableHeaderCell: {
    backgroundColor: '#f1f5f9', fontWeight: '600', padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #e2e8f0'
  },
  tableCell: {
    padding: '12px 16px', borderBottom: '1px solid #e2e8f0'
  },
  statusBadge: estado => ({
    backgroundColor: estado === 'Activo' ? '#d1e7dd' : '#f8d7da',
    color: estado === 'Activo' ? '#0f5132' : '#842029',
    padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500', display: 'inline-block', minWidth: '70px', textAlign: 'center'
  }),
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '1rem'
  },
  modalActions: {
    display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem'
  },
  cancelBtn: {
    backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer'
  },
  confirmBtn: {
    backgroundColor: '#198754', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer'
  },
  addBtn: {
    backgroundColor: '#0d6efd', color: '#fff', padding: '10px 20px', borderRadius: '6px', border: 'none', fontSize: '1rem', cursor: 'pointer'
  },
  input: {
    padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem'
  }
}
