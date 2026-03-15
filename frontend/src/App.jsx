import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'

function App() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch('/api/users/')
        if (!response.ok) throw new Error(`Error ${response.status}: no se pudieron cargar usuarios`)
        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err.message || 'Error inesperado')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const selectedUser = useMemo(
    () => users.find((user) => String(user.user_id) === selectedUserId),
    [users, selectedUserId],
  )

  const selectedUserName = selectedUser
    ? (selectedUser.full_name || `${selectedUser.first_name} ${selectedUser.last_name}`)
    : ''

  return (
    <main className="landing">
      <button
        type="button"
        className="add-user-button"
        onClick={() => navigate('/users/create')}
      >
        Agregar usuario
      </button>

      <section className="card">
        <h1>Organizador de TarIAs</h1>
        <p className="subtitle">
          Selecciona un usuario para comenzar a gestionar tareas.
        </p>

        <label htmlFor="user-select">Usuario</label>
        <select
          id="user-select"
          value={selectedUserId}
          onChange={(event) => setSelectedUserId(event.target.value)}
          disabled={loading || !!error}
        >
          <option value="">
            {loading ? 'Cargando usuarios...' : 'Selecciona un usuario'}
          </option>
          {users.map((user) => (
            <option key={user.user_id} value={user.user_id}>
              {user.full_name || `${user.first_name} ${user.last_name}`}
            </option>
          ))}
        </select>

        {error && <p className="error">{error}</p>}

        <button
          type="button"
          className="review-button"
          disabled={!selectedUser || loading || !!error}
          onClick={() =>
            navigate(`/users/${selectedUserId}/tasks`, {
              state: { userName: selectedUserName },
            })
          }
        >
          {selectedUser ? `Revisar tareas de ${selectedUserName}` : 'Selecciona un usuario para revisar tareas'}
        </button>

      </section>
    </main>
  )
}

export default App
