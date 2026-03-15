import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import './UserTasksPage.css'

function UserTasksPage() {
  const { userId } = useParams()
  const { state } = useLocation()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(`/api/users/${userId}/tasks/`)
        if (!response.ok) throw new Error(`Error ${response.status}: no se pudieron cargar tareas`)
        const data = await response.json()
        setTasks(data)
      } catch (err) {
        setError(err.message || 'Error inesperado')
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [userId])

  const userName = useMemo(
    () => state?.userName || tasks[0]?.full_name || `Usuario #${userId}`,
    [state, tasks, userId],
  )

  return (
    <main className="tasks-page">
      <section className="tasks-card">
        <div className="tasks-header">
          <h1>Tareas de {userName}</h1>
          <Link to="/" className="back-link">Volver</Link>
        </div>

        {loading && <p>Cargando tareas...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && tasks.length === 0 && (
          <p>No hay tareas registradas para este usuario.</p>
        )}

        {!loading && !error && tasks.length > 0 && (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.task_id}>
                  <td>{task.title}</td>
                  <td>{task.description || '-'}</td>
                  <td>{task.category}</td>
                  <td>{task.status || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}

export default UserTasksPage
