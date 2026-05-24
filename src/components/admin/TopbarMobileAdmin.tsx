import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
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
          display: "flex",
          gap: "0.45rem",
          alignItems: "center",
          marginLeft: "auto",
        }}
      >
        <button
          type="button"
          onClick={openCreateCourt}
          aria-label="Create court"
          title="Create court"
          style={{
            width: "38px",
            height: "38px",
            border: "none",
            borderRadius: "999px",
            background: "#25292d",
            color: "white",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Icon icon="mdi:tennis-ball-outline" width={20} height={20} />
        </button>

        <button
          type="button"
          onClick={openCreateTournament}
          aria-label="Create tournament"
          title="Create tournament"
          style={{
            width: "38px",
            height: "38px",
            border: "none",
            borderRadius: "999px",
            background: "linear-gradient(180deg, #bfe212 0%, #6f8500 100%)",
            color: "white",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Icon icon="game-icons:tennis-racket" width={20} height={20} />
        </button>
      </div>
    </header>
  );
}

export default TopbarMobileAdmin;
