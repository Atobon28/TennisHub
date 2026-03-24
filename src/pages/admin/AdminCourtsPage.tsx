import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { Icon } from "@iconify/react";
import "../../styles/admin-courts.css";
import court1 from "../../assets/court-1.jpg";
import court2 from "../../assets/court-2.jpg";

const courts = [
  { id: 1, name: "Ciudad Jardín", image: court1 },
  { id: 2, name: "Granada", image: court2 },
];

function AdminCourtsPage() {
  const navigate = useNavigate();

  return (
    <div className="admin-courts">
      <div className="admin-courts__grid">
        <section className="admin-courts__main">
          <div className="admin-courts__section-title-wrap">
            <span className="admin-courts__icon-gradient-wrap">
              <Icon
                icon="mingcute:fire-fill"
                className="admin-courts__section-icon"
              />
            </span>
            <h2 className="admin-courts__section-title">My Courts</h2>
          </div>

          <div className="admin-courts__courts-grid">
            {courts.map((court) => (
              <article key={court.id} className="admin-courts__court-card">
                <img
                  src={court.image}
                  alt={court.name}
                  className="admin-courts__court-image"
                />
                <div className="admin-courts__court-overlay">
                  <span className="admin-courts__court-name">{court.name}</span>
                  <button
                    className="admin-courts__see-more-btn"
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

export default AdminCourtsPage;
