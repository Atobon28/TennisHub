import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import PersonCard from "../../components/player/PersonCard";
import { Icon } from "@iconify/react";
import { usePlayers } from "../../context";
import "../../styles/find-coach.css";
import player1 from "../../assets/player-1.jpg";

function PlayersPage() {
  const navigate = useNavigate();

  const { players, loading, error, loadPlayers } = usePlayers();

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  return (
    <div className="find-coach">
      <div className="find-coach__grid">
        <section className="find-coach__main">
          <div className="find-coach__section-title-wrap">
            <span className="find-coach__icon-gradient-wrap">
              <Icon icon="ph:user-fill" className="find-coach__section-icon" />
            </span>
            <h2 className="find-coach__section-title">Players Nearby</h2>
          </div>

          {loading ? (
            <p
              style={{ color: "#888", textAlign: "center", padding: "20px 0" }}
            >
              Loading players...
            </p>
          ) : error ? (
            <p
              style={{ color: "#888", textAlign: "center", padding: "20px 0" }}
            >
              {error}
            </p>
          ) : players.length === 0 ? (
            <p
              style={{ color: "#888", textAlign: "center", padding: "20px 0" }}
            >
              No players available yet.
            </p>
          ) : (
            <div className="find-coach__coaches-grid">
              {players.map((player) => (
                <div
                  key={player.id}
                  onClick={() => navigate(`/player/players/view/${player.uid}`)}
                  style={{ cursor: "pointer" }}
                >
                  <PersonCard
                    name={player.username || "Player"}
                    image={
                      typeof player.photoURL === "string"
                        ? player.photoURL
                        : player1
                    }
                    level={
                      typeof player.level === "number"
                        ? player.level
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default PlayersPage;