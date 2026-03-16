import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import './UserTasksPage.css'

const STATUS_PRIORITY = {
  Pendiente: 0,
  'En progreso': 1,
  Completada: 2,
}

function UserTasksPage() {
  const { userId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingTaskId, setUpdatingTaskId] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [hideCompleted, setHideCompleted] = useState(false)
  const [showPendingOnly, setShowPendingOnly] = useState(false)

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

  const orderedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const aPriority = STATUS_PRIORITY[a.status] ?? 99
      const bPriority = STATUS_PRIORITY[b.status] ?? 99

      if (aPriority !== bPriority) return aPriority - bPriority
      return (a.task_id ?? 0) - (b.task_id ?? 0)
    })
  }, [tasks])

  const visibleTasks = useMemo(() => {
    let filteredTasks = orderedTasks

    if (showPendingOnly) {
      return filteredTasks.filter((task) => task.status === 'Pendiente')
    }

    if (hideCompleted) {
      filteredTasks = filteredTasks.filter((task) => task.status !== 'Completada')
    }

    return filteredTasks
  }, [hideCompleted, orderedTasks, showPendingOnly])

  const handleTogglePendingOnly = () => {
    setShowPendingOnly((previousValue) => {
      const nextValue = !previousValue
      if (nextValue) {
        setHideCompleted(false)
      }
      return nextValue
    })
  }

  useEffect(() => {
    if (!state?.created) return

    const message = state?.createdWithAI
      ? 'Tarea creada correctamente con categoría sugerida por IA.'
      : 'Tarea creada correctamente.'

    setSuccessMessage(message)

    navigate(`/users/${userId}/tasks`, {
      replace: true,
      state: state?.userName ? { userName: state.userName } : undefined,
    })
  }, [state, navigate, userId])

  useEffect(() => {
    if (!successMessage) return

    const timeoutId = setTimeout(() => {
      setSuccessMessage('')
    }, 4500)

    return () => clearTimeout(timeoutId)
  }, [successMessage])

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
            {!showPendingOnly && (
              <button
                type="button"
                className="toggle-completed-button"
                onClick={() => setHideCompleted((prev) => !prev)}
              >
                {hideCompleted ? 'Mostrar completadas' : 'Ocultar completadas'}
              </button>
            )}
            <button
              type="button"
              className="toggle-completed-button"
              onClick={handleTogglePendingOnly}
            >
              {showPendingOnly ? 'Ver todas' : 'Ver solo pendientes'}
            </button>
            <Link to="/" className="back-link">Volver</Link>
          </div>
        </div>

        {loading && <p>Cargando tareas...</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && tasks.length === 0 && (
          <p>No hay tareas registradas para este usuario.</p>
        )}

        {!loading && !error && tasks.length > 0 && visibleTasks.length === 0 && (
          <p>{showPendingOnly ? 'No hay tareas pendientes visibles.' : 'No hay tareas visibles con el filtro actual.'}</p>
        )}

        {!loading && !error && visibleTasks.length > 0 && (
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
              {visibleTasks.map((task) => (
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
