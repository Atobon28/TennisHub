import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import "../../styles/tournaments-page.css";

const tournaments = [
  {
    id: 1,
    level: 5,
    name: "Tournament of champions",
    info: "28/02/26 - 08:00 AM - Court: Ciudad Jardín",
  },
  {
    id: 2,
    level: 2,
    name: "Beginners Tournament",
    info: "07/03/26 - 08:00 AM - Court: Granada",
  },
  {
    id: 3,
    level: 3,
    name: "Green Court Clash",
    info: "28/02/26 - 08:00 AM - Court: Ingenio",
  },
  {
    id: 4,
    level: 4,
    name: "Weekend Cup",
    info: "07/03/26 - 08:00 AM - Court: Lago Calima",
  },
];

function TournamentsPage() {
  const navigate = useNavigate();

  return (
    <div className="tournaments-page">
      <div className="tournaments-page__grid">
        <section className="tournaments-page__main">
          <div className="tournaments-page__section-title-wrap">
            <span className="tournaments-page__icon-gradient-wrap">
              <Icon
                icon="game-icons:tennis-racket"
                className="tournaments-page__section-icon"
              />
            </span>
            <h2 className="tournaments-page__section-title">
              Upcoming Tournaments
            </h2>
          </div>

          <div className="tournaments-page__cards-grid">
            {tournaments.map((t) => (
              <article key={t.id} className="tournaments-page__card">
                <div className="tournaments-page__level-badge">{t.level}</div>
                <h3 className="tournaments-page__card-name">{t.name}</h3>
                <p className="tournaments-page__card-info">{t.info}</p>
                <button
                  className="tournaments-page__view-btn"
                  onClick={() => navigate("/player/tournaments/view")}
                >
                  View
                </button>
              </article>
            ))}
          </div>
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default TournamentsPage;
