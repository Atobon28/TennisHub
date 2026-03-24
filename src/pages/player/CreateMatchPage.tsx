import { useState } from "react";
import AdBanners from "../../components/player/AdBanners";
import "../../styles/create-match.css";

const courts = ["Ciudad Jardín", "Granada", "Ingenio", "Lago Calima"];

const timeOptions = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

function CreateMatchPage() {
  const [court, setCourt] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [created, setCreated] = useState(false);

  const handleCreate = () => {
    if (!court || !date || !time) return;
    setCreated(true);
    setTimeout(() => setCreated(false), 3000);
  };

  return (
    <div className="create-match">
      <div className="create-match__grid">
        <section className="create-match__main">
          <div className="create-match__card">
            <h2 className="create-match__title">Create a new match</h2>

            <div className="create-match__section">
              <h3 className="create-match__section-title">Place</h3>
              <label className="create-match__label">Court:</label>
              <div className="create-match__select-wrap">
                <select
                  className="create-match__select"
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                >
                  <option value="">Select the court</option>
                  {courts.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="create-match__section">
              <h3 className="create-match__section-title">Date and Hour</h3>
              <div className="create-match__date-row">
                <div className="create-match__field">
                  <label className="create-match__label">Date:</label>
                  <div className="create-match__select-wrap">
                    <input
                      type="date"
                      className="create-match__select create-match__date-input"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="create-match__field">
                  <label className="create-match__label">Time:</label>
                  <div className="create-match__select-wrap">
                    <select
                      className="create-match__select"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    >
                      <option value="">00:00</option>
                      {timeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button className="create-match__btn" onClick={handleCreate}>
                  Create Match
                </button>
              </div>
              {created && (
                <p className="create-match__success">
                  ✓ Match created successfully!
                </p>
              )}
            </div>
          </div>
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default CreateMatchPage;
