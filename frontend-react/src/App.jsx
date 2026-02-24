import { Routes, Route } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import BootList from './components/BootList'
import BootForm from './components/BootForm'
import BootDetail from './components/BootDetail'

function App() {
  return (
    <div className="app-shell">
      <AppNavbar />
      <main className="container pb-4 app-main">
        <Routes>
          <Route path="/" element={<BootList />} />
          <Route path="/boots/new" element={<BootForm />} />
          <Route path="/boots/edit/:id" element={<BootForm />} />
          <Route path="/boots/:id" element={<BootDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
