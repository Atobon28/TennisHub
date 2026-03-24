import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import "../../styles/book-court.css";
import court1 from "../../assets/court-1.jpg";
import court2 from "../../assets/court-2.jpg";
import bannerTournament from "../../assets/banner-tournament.jpg";
import bannerBrand from "../../assets/banner-brand.jpg";

const courts = [
  { id: 1, name: "Ciudad Jardín", image: court1 },
  { id: 2, name: "Granada", image: court2 },
  { id: 3, name: "Ingenio", image: court1 },
  { id: 4, name: "Lago Calima", image: court2 },
];

function BookCourtPage() {
  const navigate = useNavigate();

  return (
    <div className="book-court">
      <div className="book-court__grid">
        <section className="book-court__main">
          <div className="book-court__section-title-wrap">
            <span className="book-court__icon-gradient-wrap">
              <Icon
                icon="mingcute:fire-fill"
                className="book-court__section-icon"
              />
            </span>
            <h2 className="book-court__section-title">Trending Courts</h2>
          </div>

          <div className="book-court__courts-grid">
            {courts.map((court) => (
              <article key={court.id} className="book-court__court-card">
                <img
                  src={court.image}
                  alt={court.name}
                  className="book-court__court-image"
                />
                <div className="book-court__court-overlay">
                  <span className="book-court__court-name">{court.name}</span>
                  <button
                    className="book-court__see-more-btn"
                    onClick={() => navigate("/player/courts/view")}
                  >
                    See more
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="book-court__aside">
          <button className="book-court__aside-card">
            <img
              src={bannerTournament}
              alt="Tournament banner"
              className="book-court__aside-image"
            />
            <div className="book-court__aside-text">
              <span className="book-court__aside-text-big">New</span>
              <span className="book-court__aside-text-big">Tournaments</span>
              <span className="book-court__aside-text-small">Sign Up Now</span>
            </div>
          </button>
          <button className="book-court__aside-card">
            <img
              src={bannerBrand}
              alt="Brand banner"
              className="book-court__aside-image"
            />
            <div className="book-court__aside-text">
              <span className="book-court__aside-brand">TennisHub</span>
              <span className="book-court__aside-text-small book-court__aside-text-small--brand">
                Plan less. Play more.
              </span>
            </div>
          </button>
        </aside>
      </div>
    </div>
  );
}

export default BookCourtPage;
