import { Link } from 'react-router-dom'

function AppNavbar() {
  return (
    <nav className="navbar navbar-dark bg-dark app-navbar mb-4">
      <div className="container d-flex justify-content-between">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span>
            <strong>Tienda de Botas de Fútbol</strong>
            <small className="d-block">Frontend React</small>
          </span>
        </Link>
      </div>
    </nav>
  )
}

export default AppNavbar
