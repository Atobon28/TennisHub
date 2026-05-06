import { useState, useEffect } from "react";
import AdBanners from "../../components/player/AdBanners";
import { useAuth } from "../../context/useAuth";
import "../../styles/coach-home.css";
import coach1 from "../../assets/coach-1.jpg";

function CoachHomePage() {
  const { userData } = useAuth();

  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [price, setPrice] = useState<string>("$150.000 COP");
  const [avatar, setAvatar] = useState<string>(coach1);

  const formatCurrency = (value: string | number) => {
    const onlyNumbers = String(value).replace(/\D/g, "");

    if (!onlyNumbers) return "$0 COP";

    const numberValue = Number(onlyNumbers);

    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(numberValue);
  };

  useEffect(() => {
    if (Array.isArray(userData?.availableDays)) {
      setAvailableDays(userData.availableDays);
    } else {
      setAvailableDays([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ]);
    }

    if (userData?.pricePerHour) {
      setPrice(formatCurrency(userData.pricePerHour));
    }

    const savedAvatar = localStorage.getItem("coachAvatar");

    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, [userData]);

  const name = userData?.username || "Coach";
  const username = userData?.username ? `@${userData.username}` : "@coach";

  return (
    <div className="coach-home">
      <div className="coach-home__grid">
        <section className="coach-home__main">
          <h1 className="coach-home__welcome">
            Welcome Back, <strong>{name}</strong>
          </h1>

          <p className="coach-home__subtitle">
            Your profile is active and visible to players looking to improve
            their game.
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
              availableDays.map((day) => (
                <div key={day} className="coach-home__day-row">
                  <img src={avatar} alt="" className="coach-home__day-icon" />

                  <span className="coach-home__day-name">{day}</span>

                  <span className="coach-home__check-circle coach-home__check-circle--active">
                    ✓
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default CoachHomePage;