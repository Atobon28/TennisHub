import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { Icon } from "@iconify/react";
import { getUserByUid } from "../../firebase/services";
import "../../styles/find-coach.css";
import player1 from "../../assets/player-1.jpg";

interface Player {
  id: string;
  username: string;
  email: string;
  level?: number;
  uid: string;
  phone?: string;
  photoURL?: string;
}

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("57")) return cleaned;
  if (cleaned.startsWith("3")) return `57${cleaned}`;

  return cleaned;
};

function PlayerViewPage() {
  const { uid } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!uid) return;

      try {
        const data = await getUserByUid(uid);
        setPlayer(data as Player);
      } catch (error) {
        console.error("Error fetching player:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [uid]);

  if (loading) {
    return <p style={{ padding: 20, color: "#888" }}>Loading...</p>;
  }

  if (!player) {
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
                src={player.photoURL || player1}
                alt={player.username}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "999px",
                  objectFit: "cover",
                }}
              />

              <div style={{ textAlign: "center" }}>
                <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>
                  {player.username}
                </h2>

                <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
                  @{player.username}
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
                <strong>Contact:</strong> {player.phone || player.email}
              </p>

              <p style={{ margin: 0, fontSize: "0.95rem" }}>
                <strong>Level:</strong> {player.level || "Not specified"}
              </p>
            </div>

            {player.phone && (
              <a
                href={`https://wa.me/${formatPhone(player.phone)}`}
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
