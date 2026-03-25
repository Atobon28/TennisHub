import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { getAdminTournaments } from "../../firebase/services";
import "../../styles/admin-home.css";
import court1 from "../../assets/court-1.jpg";
import court2 from "../../assets/court-2.jpg";

interface Tournament {
  id: string;
  level: number;
  name: string;
  info: string;
}

const courts = [
  { id: 1, name: "Ciudad Jardín", image: court1 },
  { id: 2, name: "Granada", image: court2 },
];

function AdminHomePage() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await getAdminTournaments("admin1");
        setTournaments(data as Tournament[]);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  return (
    <div className="admin-home">
      <div className="admin-home__grid">
        <section className="admin-home__main">
          {/* Tournaments */}
          <div className="admin-home__section-header">
            <div className="admin-home__section-title-wrap">
              <span className="admin-home__icon-gradient-wrap">
                <span>🔍</span>
              </span>
              <h2 className="admin-home__section-title">
                My Upcoming Tournaments
              </h2>
            </div>
            <button className="admin-home__more-btn">Ver más...</button>
          </div>

          {loading ? (
            <p className="admin-home__loading">Loading tournaments...</p>
          ) : (
            <div className="admin-home__tournament-cards">
              {tournaments.map((t) => (
                <article key={t.id} className="admin-home__tournament-card">
                  <div className="admin-home__level-badge">{t.level}</div>
                  <h3 className="admin-home__card-name">{t.name}</h3>
                  <p className="admin-home__card-info">{t.info}</p>
                  <button
                    className="admin-home__view-btn"
                    onClick={() => navigate("/admin/tournaments/view")}
                  >
                    View
                  </button>
                </article>
              ))}
            </div>
          )}

          {/* Courts */}
          <div className="admin-home__section-header">
            <div className="admin-home__section-title-wrap">
              <span className="admin-home__icon-gradient-wrap admin-home__icon-gradient-wrap--orange">
                <span>🔥</span>
              </span>
              <h2 className="admin-home__section-title">My Courts</h2>
            </div>
            <button className="admin-home__more-btn">Ver más...</button>
          </div>

          <div className="admin-home__courts-grid">
            {courts.map((court) => (
              <article key={court.id} className="admin-home__court-card">
                <img
                  src={court.image}
                  alt={court.name}
                  className="admin-home__court-image"
                />
                <div className="admin-home__court-overlay">
                  <span className="admin-home__court-name">{court.name}</span>
                  <button
                    className="admin-home__see-more-btn"
                    onClick={() => navigate("/admin/courts/view")}
                  >
                    See more
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <AdBanners />
      </div>
    </div>
  );
}

export default AdminHomePage;
