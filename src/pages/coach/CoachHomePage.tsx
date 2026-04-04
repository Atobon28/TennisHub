import { useState, useEffect } from "react";
import AdBanners from "../../components/player/AdBanners";
import { useAuth } from "../../context/AuthContext";
import "../../styles/coach-home.css";
import coach1 from "../../assets/coach-1.jpg";

function CoachHomePage() {
  const { userData } = useAuth();
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [price, setPrice] = useState<string>("$150.000");
  const [avatar, setAvatar] = useState<string>(coach1);

  useEffect(() => {
    if (userData?.availableDays) {
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
      setPrice(
        userData.pricePerHour.startsWith("$")
          ? userData.pricePerHour
          : `$${userData.pricePerHour}`,
      );
    }
    const savedAvatar = localStorage.getItem("coachAvatar");
    if (savedAvatar) setAvatar(savedAvatar);
  }, [userData]);

  const name = userData?.username || "Leo";
  const username = userData?.username
    ? `@${userData.username}`
    : "@Juanceballospro";

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
                <span className="coach-home__detail-label">Contact:</span> +57
                3176480086
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
            {availableDays.map((day) => (
              <div key={day} className="coach-home__day-row">
                <img src={avatar} alt="" className="coach-home__day-icon" />
                <span className="coach-home__day-name">{day}</span>
                <span className="coach-home__check-circle coach-home__check-circle--active">
                  ✓
                </span>
              </div>
            ))}
          </div>
        </section>
        <AdBanners />
      </div>
    </div>
  );
}

export default CoachHomePage;
