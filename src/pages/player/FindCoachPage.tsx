import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { Icon } from "@iconify/react";
import { useCoaches } from "../../context";
import type { Coach } from "../../context/CoachesContext";
import "../../styles/find-coach.css";
import coach1 from "../../assets/coach-1.jpg";

function FindCoachPage() {
  const navigate = useNavigate();

  const { coaches, loading, error, loadCoaches } = useCoaches();

  useEffect(() => {
    loadCoaches();
  }, [loadCoaches]);

  const isCoachComplete = (coach: Coach) => {
    return (
      coach.username &&
      coach.pricePerHour &&
      coach.specialty &&
      coach.availableDays &&
      coach.availableDays.length > 0 &&
      coach.phone
    );
  };

  return (
    <div className="find-coach">
      <div className="find-coach__grid">
        <section className="find-coach__main">
          <div className="find-coach__section-title-wrap">
            <span className="find-coach__icon-gradient-wrap">
              <Icon icon="mdi:arm-flex" className="find-coach__section-icon" />
            </span>
            <h2 className="find-coach__section-title">Coaches</h2>
          </div>

          {loading ? (
            <p className="find-coach__empty">Loading coaches...</p>
          ) : error ? (
            <p className="find-coach__empty">{error}</p>
          ) : coaches.length === 0 ? (
            <p className="find-coach__empty">No coaches available yet.</p>
          ) : (
            <div className="find-coach__coaches-grid">
              {coaches.map((coach) => {
                const complete = isCoachComplete(coach);

                return (
                  <article
                    key={coach.id}
                    className={`find-coach__coach-card ${
                      !complete ? "find-coach__coach-card--incomplete" : ""
                    }`}
                    onClick={() =>
                      complete && navigate(`/player/coaches/view/${coach.uid}`)
                    }
                  >
                    <img
                      src={
                        typeof coach.photoURL === "string"
                          ? coach.photoURL
                          : coach1
                      }
                      alt={coach.username || "Coach"}
                      className="find-coach__coach-image"
                    />

                    <div className="find-coach__coach-info">
                      <h3 className="find-coach__coach-name">
                        {coach.username || "Coach"}
                      </h3>

                      <p className="find-coach__coach-detail">
                        <strong>Price:</strong>{" "}
                        {coach.pricePerHour || "Not specified"}
                      </p>

                      <p className="find-coach__coach-detail">
                        <strong>Specialty:</strong>{" "}
                        {coach.specialty || "Not specified"}
                      </p>

                      <p className="find-coach__coach-detail">
                        <strong>Availability:</strong>{" "}
                        {coach.availableDays?.length
                          ? coach.availableDays.join(", ")
                          : "Not specified"}
                      </p>

                      {!complete && (
                        <p className="find-coach__coach-warning">
                          Incomplete profile
                        </p>
                      )}

                      {complete && (
                        <button type="button" className="find-coach__coach-btn">
                          View coach
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default FindCoachPage;