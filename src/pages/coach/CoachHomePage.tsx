import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { useAuth } from "../../context/useAuth";
import "../../styles/coach-home.css";
import coach1 from "../../assets/coach-1.jpg";

interface ScheduleDay {
  enabled: boolean;
  start: string;
  end: string;
}

const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function CoachHomePage() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const availableDays = Array.isArray(userData?.availableDays)
    ? userData.availableDays
    : [];

  const schedule: Record<string, ScheduleDay> =
    userData?.availableSchedule || {};

  const formatCurrency = (value: string | number) => {
    const onlyNumbers = String(value).replace(/\D/g, "");

    if (!onlyNumbers) return "Not configured";

    const numberValue = Number(onlyNumbers);

    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(numberValue);
  };

  const price = userData?.pricePerHour
    ? formatCurrency(userData.pricePerHour)
    : "Not configured";

  const avatar =
    (userData as { photoURL?: string } | null)?.photoURL || coach1;

  const showSetupNotice =
    !userData?.pricePerHour ||
    !Array.isArray(userData?.availableDays) ||
    userData.availableDays.length === 0;

  const name = userData?.username || "Coach";
  const username = userData?.username ? `@${userData.username}` : "@coach";

  return (
    <div className="coach-home">
      <div className="coach-home__grid">
        <section className="coach-home__main">
          {showSetupNotice && (
            <div
              style={{
                background: "#25292d",
                color: "white",
                borderRadius: "18px",
                padding: "1.25rem",
                marginBottom: "1.25rem",
                boxShadow: "0 12px 28px rgba(15, 14, 12, 0.16)",
                border: "1px solid rgba(191, 226, 18, 0.3)",
              }}
            >
              <h2
                style={{
                  margin: "0 0 0.5rem",
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  color: "white",
                }}
              >
                Complete your coach profile
              </h2>

              <p
                style={{
                  margin: "0 0 1rem",
                  color: "rgba(255,255,255,0.78)",
                  fontWeight: 600,
                  lineHeight: 1.45,
                }}
              >
                Configure your price per hour and available schedule so players
                can contact you with clear information.
              </p>

              <button
                type="button"
                onClick={() => navigate("/coach/profile")}
                style={{
                  border: "none",
                  borderRadius: "999px",
                  padding: "0.75rem 1.1rem",
                  background:
                    "linear-gradient(180deg, #bfe212 0%, #6f8500 100%)",
                  color: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Configure profile
              </button>
            </div>
          )}

          <h1 className="coach-home__welcome">
            Welcome Back, <strong>{name}</strong>
          </h1>

          <p className="coach-home__subtitle">
            Your profile is visible to players looking to improve their game.
            <br />
            Keep your information updated to increase visibility and attract
            more students.
          </p>

          <p className="coach-home__profile-label">
            <strong>Currently, players see your profile like this:</strong>
          </p>

          <div className="coach-home__profile-card">
            <div className="coach-home__profile-top">
              <img src={avatar} alt={name} className="coach-home__avatar" />

              <div>
                <h2 className="coach-home__coach-name">{name}</h2>
                <p className="coach-home__coach-username">{username}</p>
              </div>
            </div>

            <div className="coach-home__profile-details">
              <p>
                <span className="coach-home__detail-label">Contact:</span>{" "}
                {userData?.phone || "Not specified"}
              </p>

              <p>
                <span className="coach-home__detail-label">
                  Price per hour:
                </span>{" "}
                {price}
              </p>
            </div>
          </div>

          <div className="coach-home__schedule">
            {availableDays.length === 0 ? (
              <p
                style={{
                  color: "#777",
                  fontWeight: 700,
                  padding: "1rem 0",
                }}
              >
                No available days selected.
              </p>
            ) : (
              allDays
                .filter((day) => availableDays.includes(day))
                .map((day) => {
                  const currentDay = schedule[day];

                  return (
                    <div key={day} className="coach-home__day-row">
                      <img
                        src={avatar}
                        alt=""
                        className="coach-home__day-icon"
                      />

                      <span className="coach-home__day-name">
                        {day}

                        {currentDay?.start && currentDay?.end && (
                          <span
                            style={{
                              display: "block",
                              fontSize: "0.75rem",
                              color: "#777",
                              fontWeight: 700,
                              marginTop: "0.2rem",
                            }}
                          >
                            {currentDay.start} - {currentDay.end}
                          </span>
                        )}
                      </span>

                      <span className="coach-home__check-circle coach-home__check-circle--active">
                        ✓
                      </span>
                    </div>
                  );
                })
            )}
          </div>
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default CoachHomePage;