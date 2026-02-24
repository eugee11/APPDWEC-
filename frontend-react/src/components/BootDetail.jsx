import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getBootById } from '../api/bootApi'

const SURFACE_LABELS = {
  FG: 'Césped natural (FG)',
  AG: 'Césped artificial (AG)',
  TF: 'Turf / Moqueta (TF)',
  IC: 'Interior / Sala (IC)',
}

function BootDetail() {
  const { id } = useParams()
  const [boot, setBoot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data } = await getBootById(id)
        setBoot(data.data)
      } catch (err) {
        setError(err?.response?.data?.message || 'No se pudo cargar el detalle.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  return (
    <>
      <Link className="btn btn-outline-secondary mb-3" to="/">← Volver</Link>

      {loading && (
        <div className="loader-box d-flex align-items-center justify-content-center">
          <div className="spinner-border" role="status"></div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {boot && (
        <div className="card">
          <div className="card-header bg-dark text-white">Detalle de la bota</div>
          <div className="card-body row g-3">
            <div className="col-md-6"><strong>Modelo:</strong> {boot.name}</div>
            <div className="col-md-6"><strong>Marca:</strong> {boot.brand}</div>
            <div className="col-md-6"><strong>Color:</strong> {boot.color}</div>
            <div className="col-md-6"><strong>Talla:</strong> {boot.size}</div>
            <div className="col-md-6"><strong>Precio:</strong> {Number(boot.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</div>
            <div className="col-md-6"><strong>Superficie:</strong> {SURFACE_LABELS[boot.surface] || boot.surface}</div>
            <div className="col-md-6"><strong>Stock:</strong> {boot.stock}</div>
            <div className="col-md-6"><strong>Disponible:</strong> {boot.inStock ? 'Sí' : 'No'}</div>
            <div className="col-12"><strong>Descripción:</strong> {boot.description}</div>
            <div className="col-md-6"><strong>Lanzamiento:</strong> {new Date(boot.releaseDate).toLocaleDateString()}</div>
          </div>
          <div className="card-footer d-flex gap-2">
            <Link className="btn btn-warning" to={`/boots/edit/${boot._id}`}>Editar</Link>
            <Link className="btn btn-secondary" to="/">Listado</Link>
          </div>
        </div>
      )}
    </>
  )
}

export default BootDetail
