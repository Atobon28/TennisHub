import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import logo from "../../assets/Logo.png";

function TopbarMobileAdmin() {
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
    <header className="player-mobile-topbar">
      <div className="player-mobile-topbar__brand">
        <img
          src={logo}
          alt="TennisHub logo"
          className="player-mobile-topbar__logo"
        />
      </div>

      <div className="player-mobile-topbar__user">
        <span className="player-mobile-topbar__hello">Hey {username}!</span>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          gap: "0.5rem",
          marginTop: "0.75rem",
        }}
      >
        <button
          type="button"
          onClick={openCreateCourt}
          style={{
            flex: 1,
            border: "none",
            borderRadius: "999px",
            padding: "0.6rem 0.75rem",
            background: "#25292d",
            color: "white",
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "0.78rem",
          }}
        >
          + Court
        </button>

        <button
          type="button"
          onClick={openCreateTournament}
          style={{
            flex: 1,
            border: "none",
            borderRadius: "999px",
            padding: "0.6rem 0.75rem",
            background: "linear-gradient(180deg, #bfe212 0%, #6f8500 100%)",
            color: "white",
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "0.78rem",
          }}
        >
          + Tournament
        </button>
      </div>
    </header>
  );
}

export default TopbarMobileAdmin;