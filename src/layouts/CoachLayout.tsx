import { Outlet } from "react-router-dom";
import SidebarCoach from "../components/coach/SidebarCoach";
import TopbarMobileCoach from "../components/coach/TopbarMobileCoach";
import BottomNavCoach from "../components/coach/BottomNavCoach";
import { useAuth } from "../context/useAuth";
import "../styles/player-layout.css";
import logo from "../assets/Logo.png";

function CoachLayout() {
  const { userData } = useAuth();
  const username = userData?.username || "Leo";

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
            <span className="player-layout__desktop-hello">
              ¡Hey {username}!
            </span>
          </div>
        </header>

        <div className="player-layout__mobile-topbar">
          <TopbarMobileCoach />
        </div>

        <main className="player-layout__content">
          <Outlet />
        </main>

        <div className="player-layout__mobile-bottomnav">
          <BottomNavCoach />
        </div>
      </div>
    </div>
  );
}

export default CoachLayout;
