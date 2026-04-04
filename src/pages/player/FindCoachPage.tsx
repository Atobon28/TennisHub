import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import PersonCard from "../../components/player/PersonCard";
import { Icon } from "@iconify/react";
import { getCoaches } from "../../firebase/services";
import "../../styles/find-coach.css";
import coach1 from "../../assets/coach-1.jpg";

interface Coach {
  id: string;
  username: string;
  pricePerHour?: string;
  uid: string;
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
            <p
              style={{ color: "#888", textAlign: "center", padding: "20px 0" }}
            >
              Loading coaches...
            </p>
          ) : coaches.length === 0 ? (
            <p
              style={{ color: "#888", textAlign: "center", padding: "20px 0" }}
            >
              No coaches available yet.
            </p>
          ) : (
            <div className="find-coach__coaches-grid">
              {coaches.map((coach) => (
                <div
                  key={coach.id}
                  onClick={() => navigate(`/player/coaches/view/${coach.uid}`)}
                  style={{ cursor: "pointer" }}
                >
                  <PersonCard name={coach.username} image={coach1} />
                </div>
              ))}
            </div>
          )}
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default FindCoachPage;
