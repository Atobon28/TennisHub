import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import "../../styles/player-profile.css";
import player1 from "../../assets/player-1.jpg";

const matches = [
  {
    id: 1,
    time: "Today - 05:00 PM",
    court: "Ciudad Jardín",
    host: "Juan Carlos Salazar",
  },
  { id: 2, time: "Tomorrow - 07:00 AM", court: "Ciudad Jardín", host: "You" },
  { id: 3, time: "29/02/26 - 02:00 PM", court: "Ingenio", host: "Laura Vélez" },
  {
    id: 4,
    time: "31/02/26 - 05:00 PM",
    court: "Ciudad Jardín",
    host: "Juan Carlos Salazar",
  },
];

const tournaments = [
  {
    id: 1,
    time: "28/02/26 - 08:00 AM",
    court: "Ciudad Jardín",
    host: "Tournament of champions",
  },
  {
    id: 2,
    time: "07/03/26 - 08:00 AM",
    court: "Granada",
    host: "Beginners Tournament",
  },
  {
    id: 3,
    time: "10/03/26 - 06:00 PM",
    court: "Ingenio",
    host: "Open Tournament Clash",
  },
];

function PlayerProfilePage() {
  const [activeTab, setActiveTab] = useState<"matches" | "tournaments">(
    "matches",
  );
  const navigate = useNavigate();

  const items = activeTab === "matches" ? matches : tournaments;

  return (
    <div className="player-profile">
      <div className="player-profile__grid">
        <section className="player-profile__main">
          {/* Header */}
          <div className="player-profile__header">
            <div className="player-profile__avatar-wrap">
              <img
                src={player1}
                alt="Juan Castro"
                className="player-profile__avatar"
              />
              <button className="player-profile__edit-btn">✏️</button>
            </div>
            <div className="player-profile__user-info">
              <div className="player-profile__name-row">
                <h2 className="player-profile__name">Juan Castro</h2>
                <div className="player-profile__level-wrap">
                  <span className="player-profile__level-text">
                    Your Level:
                  </span>
                  <span className="player-profile__level-badge">5</span>
                </div>
              </div>
              <p className="player-profile__username">@Juancastrog10</p>
              <div className="player-profile__links">
                <button
                  className="player-profile__link"
                  onClick={() => navigate("/player/profile/change-password")}
                >
                  Change Password
                </button>
                <button
                  className="player-profile__link player-profile__link--logout"
                  onClick={() => navigate("/")}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="player-profile__tabs">
            <button
              className={`player-profile__tab ${activeTab === "matches" ? "player-profile__tab--active" : ""}`}
              onClick={() => setActiveTab("matches")}
            >
              My Matches
            </button>
            <button
              className={`player-profile__tab ${activeTab === "tournaments" ? "player-profile__tab--active" : ""}`}
              onClick={() => setActiveTab("tournaments")}
            >
              My Tournaments
            </button>
          </div>

          {/* Items list */}
          <div className="player-profile__list">
            {items.map((item) => (
              <article key={item.id} className="player-profile__match-card">
                <div className="player-profile__match-left">
                  <p>{item.time}</p>
                  <p>Court: {item.court}</p>
                  <p>Host: {item.host}</p>
                </div>
                <div className="player-profile__match-right">
                  <span className="player-profile__brand">TennisHub</span>
                  <span className="player-profile__brand-sub">Match</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default PlayerProfilePage;
