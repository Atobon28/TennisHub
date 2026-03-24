import { Outlet } from 'react-router-dom'
import SidebarAdmin from '../components/admin/SidebarAdmin'
import '../styles/player-layout.css'
import logo from '../assets/Logo.png'

function AdminLayout() {
  return (
    <div className="player-layout">
      <aside className="player-layout__sidebar">
        <div className="player-layout__sidebar-inner">
          <div className="player-layout__sidebar-top">
            <img src={logo} alt="TennisHub logo" className="player-layout__sidebar-top-logo" />
          </div>
          <SidebarAdmin />
        </div>
      </aside>

      <div className="player-layout__main-area">
        <header className="player-layout__desktop-topbar">
          <div className="player-layout__desktop-topbar-right">
            <span className="player-layout__desktop-hello">¡Hey Admin 1!</span>
          </div>
        </header>

        <main className="player-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout