import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import './UserTasksPage.css'

function CreateTaskPage() {
  const { userId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [formError, setFormError] = useState('')
  const [isClassifying, setIsClassifying] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    status: 'Pendiente',
  })

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        setFormError('')
        const response = await fetch('/api/categories/')
        if (!response.ok) throw new Error(`Error ${response.status}: no se pudieron cargar categorías`)
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        setFormError(err.message || 'No se pudieron cargar las categorías')
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  const userName = useMemo(
    () => state?.userName || `Usuario #${userId}`,
    [state, userId],
  )

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setAiError('')
    setAiSuggestion(null)
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateTask = async (event) => {
    event.preventDefault()
    setFormError('')
    setIsClassifying(false)

    if (!formData.title.trim()) {
      setFormError('El título es obligatorio.')
      return
    }

    if (!formData.category_id) {
      setFormError('Debes seleccionar una categoría.')
      return
    }

    try {
      const selectedCategoryId = String(formData.category_id)
      const suggestedCategoryId = String(aiSuggestion?.suggested_category_id ?? '')
      const createdWithAI = Boolean(aiSuggestion) && selectedCategoryId === suggestedCategoryId

      setSubmitting(true)
      const response = await fetch(`/api/users/${userId}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          status: formData.status || 'Pendiente',
          category_id: Number(formData.category_id),
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.detail || `Error ${response.status}: no se pudo crear la tarea`)
      }

      navigate(`/users/${userId}/tasks`, {
        state: {
          userName,
          created: true,
          createdWithAI,
        },
      })
    } catch (err) {
      setFormError(err.message || 'Error al crear la tarea')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClassifyWithAI = async () => {
    const title = formData.title.trim()
    const description = formData.description.trim()

    setFormError('')
    setAiError('')
    setAiSuggestion(null)

    if (!title) {
      setAiError('Ingresa un título antes de pedir sugerencia IA.')
      return
    }

    try {
      setIsClassifying(true)
      const response = await fetch(`/api/users/${userId}/tasks/classify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        if (payload?.code === 'ai_unavailable') {
          throw new Error('El servicio de IA no está disponible en este momento. Intenta nuevamente.')
        }
        throw new Error(payload?.detail || `Error ${response.status}: no se pudo clasificar la tarea`)
      }

      setAiSuggestion(payload)
      setFormData((prev) => ({
        ...prev,
        category_id: String(payload.suggested_category_id ?? ''),
      }))
    } catch (err) {
      setAiError(err.message || 'No se pudo obtener sugerencia IA')
    } finally {
      setIsClassifying(false)
    }
  }

  return (
    <main className="tasks-page">
      <section className="tasks-card">
        <div className="tasks-header">
          <h1>Crear tarea para {userName}</h1>
          <Link
            to={`/users/${userId}/tasks`}
            state={{ userName }}
            className="back-link"
          >
            Volver a tareas
          </Link>
        </div>

        <section className="task-form-section">
          <h2>Nueva tarea</h2>
          <form className="task-form" onSubmit={handleCreateTask}>
            <label htmlFor="title">Título</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ej: Llamar al cliente"
              disabled={submitting || loadingCategories}
            />

            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe la tarea"
              disabled={submitting || loadingCategories}
            />

            <label htmlFor="category_id">Categoría</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              disabled={submitting || loadingCategories}
            >
              <option value="">
                {loadingCategories ? 'Cargando categorías...' : 'Selecciona una categoría'}
              </option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.description}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="in-progress-task-button"
              onClick={handleClassifyWithAI}
              disabled={submitting || loadingCategories || isClassifying}
            >
              {isClassifying ? 'Consultando IA...' : 'Sugerir categoría con IA'}
            </button>

            <label htmlFor="status">Estado</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={submitting || loadingCategories}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En progreso">En progreso</option>
            </select>

            <button
              type="submit"
              className="create-task-button"
              disabled={submitting || loadingCategories}
            >
              {submitting ? 'Creando tarea...' : 'Crear tarea'}
            </button>
          </form>

          {formError && <p className="error">{formError}</p>}
          {isClassifying && <p className="ai-info">Consultando sugerencia IA...</p>}
          {aiError && <p className="error">{aiError}</p>}
          {aiSuggestion && (
            <div className="ai-suggestion-card">
              <p className="ai-suggestion-title">Sugerencia IA aplicada</p>
              <p>
                Categoría: <strong>{aiSuggestion.suggested_category}</strong> ({Math.round((aiSuggestion.confidence || 0) * 100)}%)
              </p>
              {aiSuggestion.reason && <p>Motivo: {aiSuggestion.reason}</p>}
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default CreateTaskPage
