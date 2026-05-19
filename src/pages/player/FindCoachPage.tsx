import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { Icon } from "@iconify/react";
import { getCoaches } from "../../firebase/services";
import "../../styles/find-coach.css";
import coach1 from "../../assets/coach-1.jpg";

interface Coach {
  id: string;
  username: string;
  pricePerHour?: string;
  uid: string;
  specialty?: string;
  availableDays?: string[];
  phone?: string;
}

function FindCoachPage() {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const data = await getCoaches();
        setCoaches(data as Coach[]);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

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
                      src={coach1}
                      alt={coach.username}
                      className="find-coach__coach-image"
                    />

                    <div className="find-coach__coach-info">
                      <h3 className="find-coach__coach-name">
                        {coach.username}
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
