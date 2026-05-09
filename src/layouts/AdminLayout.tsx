import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SidebarAdmin from "../components/admin/SidebarAdmin";
import TopbarMobileAdmin from "../components/admin/TopbarMobileAdmin";
import BottomNavAdmin from "../components/admin/BottomNavAdmin";
import { useAuth } from "../context/useAuth";
import "../styles/player-layout.css";
import logo from "../assets/Logo.png";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuth();

  const username = userData?.username || "Admin";

  const openCreateCourt = () => {
    if (location.pathname === "/admin/courts") {
      window.dispatchEvent(new Event("admin:addCourt"));
      return;
    }

    navigate("/admin/courts");

    setTimeout(() => {
      window.dispatchEvent(new Event("admin:addCourt"));
    }, 150);
  };

  const openCreateTournament = () => {
    if (location.pathname === "/admin/tournaments") {
      window.dispatchEvent(new Event("admin:addTournament"));
      return;
    }

    navigate("/admin/tournaments");

    setTimeout(() => {
      window.dispatchEvent(new Event("admin:addTournament"));
    }, 150);
  };

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
          <div
            className="player-layout__desktop-topbar-right"
            style={{
              width: "100%",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <span className="player-layout__desktop-hello">
              Hey {username}!
            </span>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={openCreateCourt}
                style={{
                  border: "none",
                  borderRadius: "999px",
                  padding: "0.65rem 1rem",
                  background: "#25292d",
                  color: "white",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                + Add Court
              </button>

              <button
                type="button"
                onClick={openCreateTournament}
                style={{
                  border: "none",
                  borderRadius: "999px",
                  padding: "0.65rem 1rem",
                  background:
                    "linear-gradient(180deg, #bfe212 0%, #6f8500 100%)",
                  color: "white",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                + Add Tournament
              </button>
            </div>
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