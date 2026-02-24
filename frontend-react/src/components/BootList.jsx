import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBoots, deleteBoot } from '../api/bootApi'

const SURFACE_LABELS = {
  FG: 'Césped natural (FG)',
  AG: 'Césped artificial (AG)',
  TF: 'Turf / Moqueta (TF)',
  IC: 'Interior / Sala (IC)',
}

function BootList() {
  const [boots, setBoots] = useState([])
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ type: '', message: '' })
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [surface, setSurface] = useState('')
  const [deleteId, setDeleteId] = useState('')

  const fetchData = async (currentPage = page, currentSearch = search, currentSurface = surface) => {
    try {
      setLoading(true)
      const { data } = await getBoots({
        page: currentPage,
        limit,
        search: currentSearch,
        surface: currentSurface,
      })
      setBoots(data.data)
      setTotal(data.total)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      setAlert({ type: 'danger', message: error?.response?.data?.message || 'No se pudieron cargar las botas.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(1, '', '')
  }, [])

  const applyFilters = () => {
    setPage(1)
    fetchData(1, search, surface)
  }

  const clearFilters = () => {
    setSearch('')
    setSurface('')
    setPage(1)
    fetchData(1, '', '')
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const { data } = await deleteBoot(deleteId)
      setAlert({ type: 'success', message: data.message })
      setDeleteId('')
      fetchData(page, search, surface)
    } catch (error) {
      setAlert({ type: 'danger', message: error?.response?.data?.message || 'No se pudo eliminar la bota.' })
      setDeleteId('')
    }
  }

  const goPrev = () => {
    if (page <= 1) return
    const next = page - 1
    setPage(next)
    fetchData(next, search, surface)
  }

  const goNext = () => {
    if (page >= totalPages) return
    const next = page + 1
    setPage(next)
    fetchData(next, search, surface)
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">Inventario de botas</h2>
        <Link className="btn btn-primary" to="/boots/new">Añadir bota</Link>
      </div>

      {alert.message && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="card mb-3 filter-panel">
        <div className="card-body row g-2 align-items-end">
          <div className="col-md-6">
            <label className="form-label">Buscar por nombre, marca o descripción</label>
            <input className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Superficie</label>
            <select className="form-select" value={surface} onChange={(e) => setSurface(e.target.value)}>
              <option value="">Todas</option>
              <option value="FG">Césped natural (FG)</option>
              <option value="AG">Césped artificial (AG)</option>
              <option value="TF">Turf / Moqueta (TF)</option>
              <option value="IC">Interior / Sala (IC)</option>
            </select>
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button className="btn btn-dark w-100" onClick={applyFilters}>Filtrar</button>
            <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>Limpiar</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loader-box d-flex align-items-center justify-content-center">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Modelo</th>
                <th>Marca</th>
                <th>Talla</th>
                <th>Precio</th>
                <th>Superficie</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {boots.map((boot) => (
                <tr key={boot._id}>
                  <td>{boot.name}</td>
                  <td>{boot.brand}</td>
                  <td>{boot.size}</td>
                  <td>{Number(boot.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</td>
                  <td>{SURFACE_LABELS[boot.surface] || boot.surface}</td>
                  <td>{boot.stock}</td>
                  <td className="d-flex gap-2">
                    <Link className="btn btn-sm btn-info" to={`/boots/${boot._id}`}>Detalle</Link>
                    <Link className="btn btn-sm btn-warning" to={`/boots/edit/${boot._id}`}>Editar</Link>
                    <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(boot._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
              {boots.length === 0 && (
                <tr><td colSpan="7" className="text-center">No hay resultados para los filtros aplicados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <small>Total registros: {total}</small>
        <div className="btn-group">
          <button className="btn pager-btn" onClick={goPrev} disabled={page === 1}>Anterior</button>
          <button className="btn pager-indicator disabled">Página {page} / {totalPages}</button>
          <button className="btn pager-btn" onClick={goNext} disabled={page === totalPages}>Siguiente</button>
        </div>
      </div>

      {deleteId && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,.45)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button type="button" className="btn-close" onClick={() => setDeleteId('')}></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">¿Seguro que deseas eliminar esta bota?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteId('')}>Cancelar</button>
                <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BootList
