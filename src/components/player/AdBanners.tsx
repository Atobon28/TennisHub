import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import bannerTournament from "../../assets/banner-tournament.jpg";
import bannerBrand from "../../assets/banner-brand.jpg";

function AdBanners() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuth();

  const getCurrentRole = () => {
    if (location.pathname.startsWith("/admin")) return "admin";
    if (location.pathname.startsWith("/coach")) return "coach";
    if (location.pathname.startsWith("/player")) return "player";

    if (userData?.role) return userData.role;

    return localStorage.getItem("role") || "player";
  };

  const role = getCurrentRole();

  const goToTournaments = () => {
    if (role === "admin") {
      navigate("/admin/tournaments");
      return;
    }

    if (role === "coach") {
      navigate("/coach/home");
      return;
    }

    navigate("/player/tournaments");
  };

  const goToHome = () => {
    if (role === "admin") {
      navigate("/admin/home");
      return;
    }

    if (role === "coach") {
      navigate("/coach/home");
      return;
    }

    navigate("/player/home");
  };

  return (
    <aside className="player-home__aside">
      <button
        type="button"
        className="player-home__aside-card player-home__aside-card--button"
        onClick={goToTournaments}
      >
        <img
          src={bannerTournament}
          alt="Tournament banner"
          className="player-home__aside-image"
        />

        <div className="player-home__aside-text">
          <span className="player-home__aside-text-big">New</span>
          <span className="player-home__aside-text-big">Tournaments</span>
          <span className="player-home__aside-text-small">
            {role === "coach" ? "View profile" : "Sign Up Now"}
          </span>
        </div>
      </button>

      <button
        type="button"
        className="player-home__aside-card player-home__aside-card--button"
        onClick={goToHome}
      >
        <img
          src={bannerBrand}
          alt="Brand banner"
          className="player-home__aside-image"
        />

        <div className="player-home__aside-text">
          <span className="player-home__aside-brand player-home__brand-baloo">
            TennisHub
          </span>

          <span className="player-home__aside-text-small player-home__aside-text-small--brand">
            Plan less. Play more.
          </span>
        </div>
      </button>
    </aside>
  );
}

export default AdBanners;