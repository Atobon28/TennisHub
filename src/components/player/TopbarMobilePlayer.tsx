import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/Logo.png";

function TopbarMobilePlayer() {
  const { userData } = useAuth();
  const username = userData?.username || "Juan";
  const level =
    userData?.level || parseInt(localStorage.getItem("playerLevel") || "5");

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
        <span className="player-mobile-topbar__hello">¡Hey {username}!</span>
        <span className="player-mobile-topbar__level-text">Your Level:</span>
        <span className="player-mobile-topbar__level-badge">{level}</span>
      </div>
    </header>
  );
}

export default TopbarMobilePlayer;
