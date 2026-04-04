import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { Icon } from "@iconify/react";
import { getUserByUid } from "../../firebase/services";
import "../../styles/find-coach.css";
import coach1 from "../../assets/coach-1.jpg";

interface Coach {
  id: string;
  username: string;
  email: string;
  pricePerHour?: string;
  uid: string;
  availableDays?: string[];
  phone?: string;
}

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("57")) return cleaned;
  if (cleaned.startsWith("3")) return `57${cleaned}`;
  return cleaned;
};

function CoachViewPage() {
  const { uid } = useParams();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoach = async () => {
      if (!uid) return;
      try {
        const data = await getUserByUid(uid);
        setCoach(data as Coach);
      } catch (error) {
        console.error("Error fetching coach:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoach();
  }, [uid]);

  if (loading) return <p style={{ padding: 20, color: "#888" }}>Loading...</p>;
  if (!coach)
    return <p style={{ padding: 20, color: "#888" }}>Coach not found.</p>;

  const availableDays = coach.availableDays || [];

  return (
    <div className="find-coach">
      <div className="find-coach__grid">
        <section className="find-coach__main">
          <div className="find-coach__section-title-wrap">
            <span className="find-coach__icon-gradient-wrap">
              <Icon icon="mdi:arm-flex" className="find-coach__section-icon" />
            </span>
            <h2 className="find-coach__section-title">Coach Profile</h2>
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
            {/* Avatar + info */}
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
                src={coach1}
                alt={coach.username}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "999px",
                  objectFit: "cover",
                }}
              />
              <div style={{ textAlign: "center" }}>
                <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>
                  {coach.username}
                </h2>
                <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
                  @{coach.username}
                </p>
              </div>
            </div>

            {/* Details */}
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
                <strong>Contact:</strong> {coach.phone || coach.email}
              </p>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>
                <strong>Price per hour:</strong>{" "}
                {coach.pricePerHour || "Not specified"}
              </p>
            </div>

            {/* WhatsApp button */}
            <button
              onClick={() =>
                coach.phone
                  ? window.open(
                      `https://wa.me/${formatPhone(coach.phone)}?text=Hi! I found you on TennisHub and would like to connect.`,
                      "_blank",
                    )
                  : alert("This coach has no phone number registered.")
              }
              style={{
                background: "var(--player-green-gradient)",
                color: "white",
                border: "none",
                borderRadius: "999px",
                padding: "10px 0",
                width: "100%",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Contact via WhatsApp
            </button>

            {/* Available days */}
            {availableDays.length > 0 && (
              <>
                <h3
                  style={{
                    margin: "8px 0 0",
                    alignSelf: "flex-start",
                    fontSize: "1rem",
                  }}
                >
                  Available Days
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    width: "100%",
                  }}
                >
                  {availableDays.map((day) => (
                    <div
                      key={day}
                      style={{
                        background: "var(--player-bg)",
                        borderRadius: 12,
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      <img
                        src={coach1}
                        alt=""
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "999px",
                          objectFit: "cover",
                        }}
                      />
                      <span style={{ flex: 1, fontWeight: 600 }}>{day}</span>
                      <span
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: "999px",
                          background: "var(--player-green)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.82rem",
                        }}
                      >
                        ✓
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
        <AdBanners />
      </div>
    </div>
  );
}

export default CoachViewPage;
