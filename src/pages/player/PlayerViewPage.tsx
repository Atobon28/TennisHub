import { useEffect } from "react";
import { useParams } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { Icon } from "@iconify/react";
import { usePlayers } from "../../context";
import "../../styles/find-coach.css";
import player1 from "../../assets/player-1.jpg";

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("57")) return cleaned;
  if (cleaned.startsWith("3")) return `57${cleaned}`;

  return cleaned;
};

function PlayerViewPage() {
  const { uid } = useParams();

  const { selectedPlayer, loading, error, loadPlayerById } = usePlayers();

  useEffect(() => {
    if (!uid) return;

    loadPlayerById(uid);
  }, [uid, loadPlayerById]);

  if (loading) {
    return <p style={{ padding: 20, color: "#888" }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ padding: 20, color: "#888" }}>{error}</p>;
  }

  if (!selectedPlayer) {
    return <p style={{ padding: 20, color: "#888" }}>Player not found.</p>;
  }

  return (
    <div className="find-coach">
      <div className="find-coach__grid">
        <section className="find-coach__main">
          <div className="find-coach__section-title-wrap">
            <span className="find-coach__icon-gradient-wrap">
              <Icon icon="ph:user-fill" className="find-coach__section-icon" />
            </span>

            <h2 className="find-coach__section-title">Player Profile</h2>
          </div>

          <div
            style={{
              background: "var(--player-white)",
              borderRadius: 16,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                width: "100%",
              }}
            >
              <img
                src={
                  typeof selectedPlayer.photoURL === "string"
                    ? selectedPlayer.photoURL
                    : player1
                }
                alt={selectedPlayer.username || "Player"}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "999px",
                  objectFit: "cover",
                }}
              />

              <div style={{ textAlign: "center" }}>
                <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>
                  {selectedPlayer.username || "Player"}
                </h2>

                <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
                  @{selectedPlayer.username || "player"}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                width: "100%",
              }}
            >
              <p style={{ margin: 0, fontSize: "0.95rem" }}>
                <strong>Contact:</strong>{" "}
                {selectedPlayer.phone || selectedPlayer.email || "Not specified"}
              </p>

              <p style={{ margin: 0, fontSize: "0.95rem" }}>
                <strong>Level:</strong>{" "}
                {typeof selectedPlayer.level === "number"
                  ? selectedPlayer.level
                  : "Not specified"}
              </p>
            </div>

            {selectedPlayer.phone && (
              <a
                href={`https://wa.me/${formatPhone(selectedPlayer.phone)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "var(--player-green-gradient)",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "999px",
                  padding: "10px 0",
                  width: "100%",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textAlign: "center",
                  fontFamily: "inherit",
                }}
              >
                Contact Player on WhatsApp
              </a>
            )}
          </div>
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default PlayerViewPage;