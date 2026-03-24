import { useNavigate } from "react-router-dom";
import bannerTournament from "../../assets/banner-tournament.jpg";
import bannerBrand from "../../assets/banner-brand.jpg";

function AdBanners() {
  const navigate = useNavigate();

  return (
    <aside className="player-home__aside">
      <button
        className="player-home__aside-card player-home__aside-card--button"
        onClick={() => navigate("/player/tournaments")}
      >
        <img
          src={bannerTournament}
          alt="Tournament banner"
          className="player-home__aside-image"
        />
        <div className="player-home__aside-text">
          <span className="player-home__aside-text-big">New</span>
          <span className="player-home__aside-text-big">Tournaments</span>
          <span className="player-home__aside-text-small">Sign Up Now</span>
        </div>
      </button>
      <button className="player-home__aside-card player-home__aside-card--button">
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
