import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import "../../styles/coach-profile.css";
import coach1 from "../../assets/coach-1.jpg";

const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function CoachProfilePage() {
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);
  const [saved, setSaved] = useState(false);

  const toggleDay = (day: string) => {
    setSaved(false);
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <div className="coach-profile">
      <div className="coach-profile__grid">
        <section className="coach-profile__main">
          {/* Header */}
          <div className="coach-profile__header">
            <div className="coach-profile__avatar-wrap">
              <img
                src={coach1}
                alt="Leo Cruz"
                className="coach-profile__avatar"
              />
              <button className="coach-profile__edit-btn">✏️</button>
            </div>
            <div className="coach-profile__user-info">
              <h2 className="coach-profile__name">Leo Cruz</h2>
              <p className="coach-profile__username">@Leocruz_coach</p>
              <div className="coach-profile__links">
                <button className="coach-profile__link">Change Password</button>
                <button
                  className="coach-profile__link coach-profile__link--logout"
                  onClick={() => navigate("/")}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="coach-profile__details">
            <p>
              <span className="coach-profile__detail-label">Contact:</span> +57
              3176480086
            </p>
            <p>
              <span className="coach-profile__detail-label">
                Price per hour:
              </span>{" "}
              $150.000
            </p>
            <button className="coach-profile__change-price">
              Change Price
            </button>
          </div>

          {/* Availability */}
          <p className="coach-profile__availability-label">
            <strong>Edit availability:</strong>
          </p>

          <div className="coach-profile__schedule">
            {allDays.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <div key={day} className="coach-profile__day-row">
                  <img
                    src={coach1}
                    alt=""
                    className="coach-profile__day-icon"
                  />
                  <span className="coach-profile__day-name">{day}</span>
                  <button
                    className={`coach-profile__check-circle ${isSelected ? "coach-profile__check-circle--active" : ""}`}
                    onClick={() => toggleDay(day)}
                  >
                    {isSelected ? "✓" : ""}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Save */}
          <div className="coach-profile__save-wrap">
            {saved && (
              <span className="coach-profile__saved-msg">✓ Profile saved!</span>
            )}
            <button className="coach-profile__save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default CoachProfilePage;
