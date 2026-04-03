import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/Logo.png";

function TopbarMobileCoach() {
  const { userData } = useAuth();
  const username = userData?.username || "Coach";

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
      </div>
    </header>
  );
}

export default TopbarMobileCoach;
