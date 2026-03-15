import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import './UserTasksPage.css'

function UserTasksPage() {
  const { userId } = useParams()
  const { state } = useLocation()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingTaskId, setUpdatingTaskId] = useState(null)

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

  useEffect(() => {
    loadTasks()
  }, [userId])

  const userName = useMemo(
    () => state?.userName || tasks[0]?.full_name || `Usuario #${userId}`,
    [state, tasks, userId],
  )

  const handleMarkAsCompleted = async (taskId) => {
    try {
      setError('')
      setUpdatingTaskId(taskId)
      const response = await fetch(`/api/users/${userId}/tasks/${taskId}/complete/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error(`Error ${response.status}: no se pudo actualizar la tarea`)
      await loadTasks()
    } catch (err) {
      setError(err.message || 'Error al actualizar la tarea')
    } finally {
      setUpdatingTaskId(null)
    }
  }

  const handleMoveToInProgress = async (taskId) => {
    try {
      setError('')
      setUpdatingTaskId(taskId)
      const response = await fetch(`/api/users/${userId}/tasks/${taskId}/status/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'En progreso' }),
      })
      if (!response.ok) throw new Error(`Error ${response.status}: no se pudo actualizar la tarea`)
      await loadTasks()
    } catch (err) {
      setError(err.message || 'Error al actualizar la tarea')
    } finally {
      setUpdatingTaskId(null)
    }
  }

  return (
    <main className="tasks-page">
      <section className="tasks-card">
        <div className="tasks-header">
          <h1>Tareas de {userName}</h1>
          <div className="tasks-actions">
            <Link
              to={`/users/${userId}/tasks/create`}
              state={{ userName }}
              className="create-task-link"
            >
              Crear tarea
            </Link>
            <Link to="/" className="back-link">Volver</Link>
          </div>
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
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.task_id}
                  className={`task-row ${
                    task.status === 'Pendiente'
                      ? 'task-row--pending'
                      : task.status === 'En progreso'
                        ? 'task-row--in-progress'
                        : task.status === 'Completada'
                          ? 'task-row--completed'
                          : ''
                  }`}
                >
                  <td>{task.title}</td>
                  <td>{task.description || '-'}</td>
                  <td>{task.category}</td>
                  <td>{task.status || '-'}</td>
                  <td className="task-action-cell">
                    {task.status === 'Completada' ? (
                      <span className="task-done-badge">Completada</span>
                    ) : task.status === 'Pendiente' ? (
                      <div className="task-action-group">
                        <button
                          type="button"
                          className="in-progress-task-button"
                          disabled={updatingTaskId === task.task_id}
                          onClick={() => handleMoveToInProgress(task.task_id)}
                        >
                          {updatingTaskId === task.task_id ? 'Actualizando...' : 'Pasar a En progreso'}
                        </button>
                        <button
                          type="button"
                          className="complete-task-button"
                          disabled={updatingTaskId === task.task_id}
                          onClick={() => handleMarkAsCompleted(task.task_id)}
                        >
                          {updatingTaskId === task.task_id ? 'Actualizando...' : 'Marcar completada'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="complete-task-button"
                        disabled={updatingTaskId === task.task_id}
                        onClick={() => handleMarkAsCompleted(task.task_id)}
                      >
                        {updatingTaskId === task.task_id ? 'Actualizando...' : 'Marcar completada'}
                      </button>
                    )}
                  </td>
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
