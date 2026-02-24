import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createBoot, getBootById, updateBoot } from '../api/bootApi'

const initialForm = {
  name: '',
  brand: '',
  color: '',
  description: '',
  price: 30,
  releaseDate: '',
  inStock: true,
  stock: 1,
  size: 40,
  surface: 'FG',
}

function BootForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [alert, setAlert] = useState({ type: '', message: '' })

  const isEditMode = Boolean(id)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const { data } = await getBootById(id)
        setForm({
          ...data.data,
          releaseDate: data.data.releaseDate?.slice(0, 10),
        })
      } catch (error) {
        setAlert({ type: 'danger', message: error?.response?.data?.message || 'No se pudo cargar la bota.' })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const onChange = (event) => {
    const { name, value, type, checked } = event.target
    const parsedValue = type === 'checkbox' ? checked : value
    setForm((prev) => ({
      ...prev,
      [name]: ['price', 'stock', 'size'].includes(name) ? Number(parsedValue) : parsedValue,
    }))
  }

  const validate = () => {
    if (!form.name || form.name.length < 3) return 'El nombre debe tener al menos 3 caracteres.'
    if (!form.brand) return 'La marca es obligatoria.'
    if (!form.description || form.description.length < 10) return 'La descripción debe tener al menos 10 caracteres.'
    if (form.price < 30 || form.price > 500) return 'El precio debe estar entre 30 y 500€.'
    if (form.size < 36 || form.size > 47) return 'La talla debe estar entre 36 y 47.'
    if (!form.releaseDate) return 'La fecha de lanzamiento es obligatoria.'
    return ''
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    const validationError = validate()
    if (validationError) {
      setAlert({ type: 'danger', message: validationError })
      return
    }

    try {
      setSubmitting(true)
      const request = isEditMode ? updateBoot(id, form) : createBoot(form)
      const { data } = await request
      setAlert({ type: 'success', message: data.message || 'Guardado correctamente.' })
      setTimeout(() => navigate('/'), 700)
    } catch (error) {
      setAlert({ type: 'danger', message: error?.response?.data?.message || 'No se pudo guardar la bota.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Link className="btn btn-outline-secondary mb-3" to="/">← Volver</Link>

      <div className="card">
        <div className="card-header bg-dark text-white">{isEditMode ? 'Editar bota' : 'Nueva bota'}</div>
        <div className="card-body">
          {loading ? (
            <div className="loader-box d-flex align-items-center justify-content-center">
              <div className="spinner-border" role="status"></div>
            </div>
          ) : (
            <>
              {alert.message && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

              <form className="row g-3" onSubmit={onSubmit}>
                <div className="col-md-6">
                  <label className="form-label">Modelo</label>
                  <input className="form-control" name="name" value={form.name} onChange={onChange} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Marca</label>
                  <input className="form-control" name="brand" value={form.brand} onChange={onChange} />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Color</label>
                  <input className="form-control" name="color" value={form.color} onChange={onChange} />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Talla</label>
                  <input className="form-control" type="number" name="size" value={form.size} onChange={onChange} />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Superficie</label>
                  <select className="form-select" name="surface" value={form.surface} onChange={onChange}>
                    <option value="FG">Césped natural (FG)</option>
                    <option value="AG">Césped artificial (AG)</option>
                    <option value="TF">Turf / Moqueta (TF)</option>
                    <option value="IC">Interior / Sala (IC)</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Precio (€)</label>
                  <input className="form-control" type="number" name="price" value={form.price} onChange={onChange} />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Stock</label>
                  <input className="form-control" type="number" name="stock" value={form.stock} onChange={onChange} />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Lanzamiento</label>
                  <input className="form-control" type="date" name="releaseDate" value={form.releaseDate} onChange={onChange} />
                </div>

                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" rows="3" name="description" value={form.description} onChange={onChange}></textarea>
                </div>

                <div className="col-12 form-check ms-2">
                  <input className="form-check-input" type="checkbox" id="inStock" name="inStock" checked={form.inStock} onChange={onChange} />
                  <label className="form-check-label" htmlFor="inStock">Disponible en stock</label>
                </div>

                <div className="col-12 d-flex gap-2">
                  <button className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Guardando...' : 'Guardar'}
                  </button>
                  <Link className="btn btn-secondary" to="/">Cancelar</Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default BootForm