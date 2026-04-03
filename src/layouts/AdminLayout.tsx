import { Outlet } from "react-router-dom";
import SidebarAdmin from "../components/admin/SidebarAdmin";
import TopbarMobileAdmin from "../components/admin/TopbarMobileAdmin";
import BottomNavAdmin from "../components/admin/BottomNavAdmin";
import { useAuth } from "../context/AuthContext";
import "../styles/player-layout.css";
import logo from "../assets/Logo.png";

function AdminLayout() {
  const { userData } = useAuth();
  const username = userData?.username || "Admin";

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
          <SidebarAdmin />
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
          <TopbarMobileAdmin />
        </div>

        <main className="player-layout__content">
          <Outlet />
        </main>

        <div className="player-layout__mobile-bottomnav">
          <BottomNavAdmin />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
