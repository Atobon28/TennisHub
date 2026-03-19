import { Outlet } from 'react-router-dom'
import SidebarPlayer from '../components/player/SidebarPlayer'
import TopbarMobilePlayer from '../components/player/TopbarMobilePlayer'
import BottomNavPlayer from '../components/player/BottomNavPlayer'
import '../styles/player-layout.css'
import logo from '../assets/Logo.png'

function PlayerLayout() {
  return (
    <div className="player-layout">
      <aside className="player-layout__sidebar">
        <div className="player-layout__sidebar-inner">
          <div className="player-layout__sidebar-top">
            <img
              src={logo}
              alt="TennisHub logo"
              className="player-layout__sidebar-top-logo"
            />
          </div>

          <SidebarPlayer />
        </div>
      </aside>

      <div className="player-layout__main-area">
        <header className="player-layout__desktop-topbar">
          <div className="player-layout__desktop-topbar-right">
            <span className="player-layout__desktop-hello">¡Hey Juan!</span>
            <span className="player-layout__desktop-level-text">Your Level:</span>
            <span className="player-layout__desktop-level-badge">5</span>
          </div>
        </header>

        <div className="player-layout__mobile-topbar">
          <TopbarMobilePlayer />
        </div>

        <main className="player-layout__content">
          <Outlet />
        </main>

        <div className="player-layout__mobile-bottomnav">
          <BottomNavPlayer />
        </div>
      </div>
    </div>
  )
}

export default PlayerLayout