import { useState } from "react";
import AdBanners from "../../components/player/AdBanners";
import "../../styles/admin-tournament-view.css";
import court1 from "../../assets/court-1.jpg";

function AdminTournamentViewPage() {
  const [court, setCourt] = useState("Ciudad Jardín");
  const [date, setDate] = useState("28/02/26");
  const [hour, setHour] = useState("08:00 AM");
  const [minLevel, setMinLevel] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [tempCourt, setTempCourt] = useState(court);
  const [tempDate, setTempDate] = useState(date);
  const [tempHour, setTempHour] = useState(hour);
  const [tempLevel, setTempLevel] = useState(String(minLevel));

  const handleSave = () => {
    setCourt(tempCourt);
    setDate(tempDate);
    setHour(tempHour);
    setMinLevel(parseInt(tempLevel) || minLevel);
    setShowModal(false);
  };

  const handleOpen = () => {
    setTempCourt(court);
    setTempDate(date);
    setTempHour(hour);
    setTempLevel(String(minLevel));
    setShowModal(true);
  };

  return (
    <div className="admin-tournament-view">
      <div className="admin-tournament-view__grid">
        <section className="admin-tournament-view__main">
          <div className="admin-tournament-view__card">
            <h2 className="admin-tournament-view__title">
              Tournament of champions
            </h2>
            <div className="admin-tournament-view__body">
              <img
                src={court1}
                alt="Tournament"
                className="admin-tournament-view__image"
              />
              <div className="admin-tournament-view__info">
                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Court: </span>
                  {court}
                </p>
                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Date: </span>
                  {date}
                </p>
                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Hour: </span>
                  {hour}
                </p>
                <p className="admin-tournament-view__detail admin-tournament-view__detail--level">
                  <span className="admin-tournament-view__label">
                    Minimum Level:{" "}
                  </span>
                  <span className="admin-tournament-view__level-badge">
                    {minLevel}
                  </span>
                </p>
              </div>
            </div>
            <button
              className="admin-tournament-view__edit-btn"
              onClick={handleOpen}
            >
              Edit
            </button>
          </div>
        </section>

        <AdBanners />
      </div>

      {/* Modal Edit */}
      {showModal && (
        <div className="admin-tournament-view__modal-overlay">
          <div className="admin-tournament-view__modal">
            <button
              className="admin-tournament-view__modal-close"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="admin-tournament-view__modal-title">
              Edit Tournament
            </h2>
            <div className="admin-tournament-view__modal-section">
              <label className="admin-tournament-view__modal-label">
                Court:
              </label>
              <input
                type="text"
                className="admin-tournament-view__modal-input"
                value={tempCourt}
                onChange={(e) => setTempCourt(e.target.value)}
              />
              <label className="admin-tournament-view__modal-label">
                Date:
              </label>
              <input
                type="text"
                className="admin-tournament-view__modal-input"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
              />
              <label className="admin-tournament-view__modal-label">
                Hour:
              </label>
              <input
                type="text"
                className="admin-tournament-view__modal-input"
                value={tempHour}
                onChange={(e) => setTempHour(e.target.value)}
              />
              <label className="admin-tournament-view__modal-label">
                Minimum Level:
              </label>
              <input
                type="number"
                min="1"
                max="5"
                className="admin-tournament-view__modal-input"
                value={tempLevel}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 1 && val <= 5) setTempLevel(e.target.value);
                  if (e.target.value === "") setTempLevel("");
                }}
              />
            </div>
            <button
              className="admin-tournament-view__modal-confirm"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTournamentViewPage;
