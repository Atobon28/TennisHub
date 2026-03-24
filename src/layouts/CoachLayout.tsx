import { Outlet } from "react-router-dom";
import SidebarCoach from "../components/coach/SidebarCoach";
import "../styles/player-layout.css";
import logo from "../assets/Logo.png";

function CoachLayout() {
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
          <SidebarCoach />
        </div>
      </aside>

      <div className="player-layout__main-area">
        <header className="player-layout__desktop-topbar">
          <div className="player-layout__desktop-topbar-right">
            <span className="player-layout__desktop-hello">¡Hey Leo!</span>
          </div>
        </header>

        <main className="player-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CoachLayout;
