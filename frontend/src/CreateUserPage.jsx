import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './App.css'

function CreateUserPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('Nombre y apellido son obligatorios.')
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch('/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.detail || `Error ${response.status}: no se pudo crear el usuario`)
      }

      navigate('/', { state: { userCreated: true } })
    } catch (err) {
      setError(err.message || 'Error al crear el usuario')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="landing">
      <section className="card">
        <p className="badge">Nuevo Usuario</p>
        <h1>Agregar usuario</h1>
        <p className="subtitle">
          Completa los datos para registrar un nuevo usuario.
        </p>

        <form className="task-form" onSubmit={handleSubmit}>
          <label htmlFor="first_name">Nombre</label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleInputChange}
            disabled={submitting}
          />

          <label htmlFor="last_name">Apellido</label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={handleInputChange}
            disabled={submitting}
          />

          <button type="submit" className="review-button" disabled={submitting}>
            {submitting ? 'Creando usuario...' : 'Crear usuario'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="create-user-actions">
          <Link to="/" className="create-user-back-link">Volver</Link>
        </div>
      </section>
    </main>
  )
}

export default CreateUserPage
