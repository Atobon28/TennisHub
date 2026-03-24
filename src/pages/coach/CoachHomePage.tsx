import { useState, useEffect } from "react";
import AdBanners from "../../components/player/AdBanners";
import "../../styles/coach-home.css";
import coach1 from "../../assets/coach-1.jpg";

function CoachHomePage() {
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [price, setPrice] = useState<string>("$150.000");

  useEffect(() => {
    const savedDays = localStorage.getItem("coachDays");
    if (savedDays) {
      setAvailableDays(JSON.parse(savedDays));
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

    const savedPrice = localStorage.getItem("coachPrice");
    if (savedPrice) setPrice(savedPrice);
  }, []);

  return (
    <div className="coach-home">
      <div className="coach-home__grid">
        <section className="coach-home__main">
          <h1 className="coach-home__welcome">
            Welcome Back, <strong>Leo</strong>
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

          {/* Profile card */}
          <div className="coach-home__profile-card">
            <div className="coach-home__profile-top">
              <img
                src={coach1}
                alt="Juan Ceballos"
                className="coach-home__avatar"
              />
              <div>
                <h2 className="coach-home__coach-name">Juan Ceballos</h2>
                <p className="coach-home__coach-username">@Juanceballospro</p>
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

          {/* Schedule - solo lectura */}
          <div className="coach-home__schedule">
            {availableDays.map((day) => (
              <div key={day} className="coach-home__day-row">
                <img src={coach1} alt="" className="coach-home__day-icon" />
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
