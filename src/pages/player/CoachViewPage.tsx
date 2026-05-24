import { useEffect } from "react";
import { useParams } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { Icon } from "@iconify/react";
import { useCoaches } from "../../context";
import "../../styles/find-coach.css";
import coach1 from "../../assets/coach-1.jpg";

const buildCoachWhatsAppLink = (phone: string, coachName: string) => {
  const cleaned = phone.replace(/\D/g, "");

  if (!cleaned) return "";

  const formattedPhone = cleaned.startsWith("57")
    ? cleaned
    : cleaned.startsWith("3")
      ? `57${cleaned}`
      : cleaned;

  const message = `Hi ${coachName}! I found your profile on TennisHub and I would like to connect for coaching sessions.`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
};

function CoachViewPage() {
  const { uid } = useParams();

  const { selectedCoach, loading, error, loadCoachById } = useCoaches();

  useEffect(() => {
    if (!uid) return;

    loadCoachById(uid);
  }, [uid, loadCoachById]);

  if (loading) {
    return <p style={{ padding: 20, color: "#888" }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ padding: 20, color: "#888" }}>{error}</p>;
  }

  if (!selectedCoach) {
    return <p style={{ padding: 20, color: "#888" }}>Coach not found.</p>;
  }

  const availableDays = selectedCoach.availableDays || [];

  const whatsappLink =
    typeof selectedCoach.phone === "string"
      ? buildCoachWhatsAppLink(
          selectedCoach.phone,
          selectedCoach.username || "Coach",
        )
      : "";

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
                  typeof selectedCoach.photoURL === "string"
                    ? selectedCoach.photoURL
                    : coach1
                }
                alt={selectedCoach.username || "Coach"}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "999px",
                  objectFit: "cover",
                }}
              />

              <div style={{ textAlign: "center" }}>
                <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>
                  {selectedCoach.username || "Coach"}
                </h2>

                <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
                  @{selectedCoach.username || "coach"}
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
                {selectedCoach.phone || selectedCoach.email || "Not specified"}
              </p>

              <p style={{ margin: 0, fontSize: "0.95rem" }}>
                <strong>Price per hour:</strong>{" "}
                {selectedCoach.pricePerHour || "Not specified"}
              </p>
            </div>

            {whatsappLink ? (
              <a
                href={whatsappLink}
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
                Contact Coach on WhatsApp
              </a>
            ) : (
              <p
                style={{
                  color: "#888",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                This coach has no WhatsApp phone number available.
              </p>
            )}

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
                        src={
                          typeof selectedCoach.photoURL === "string"
                            ? selectedCoach.photoURL
                            : coach1
                        }
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