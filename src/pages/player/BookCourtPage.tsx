import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { getCourts } from "../../firebase/services";
import "../../styles/book-court.css";
import court1 from "../../assets/court-1.jpg";
import AdBanners from "../../components/player/AdBanners";

interface Court {
  id: string;
  name: string;
  image: string;
}

function BookCourtPage() {
  const navigate = useNavigate();
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const data = await getCourts();
        setCourts(data as Court[]);
      } catch (error) {
        console.error("Error fetching courts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

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

          {loading ? (
            <p className="book-court__loading">Loading courts...</p>
          ) : (
            <div className="book-court__courts-grid">
              {courts.map((court) => (
                <article key={court.id} className="book-court__court-card">
                  <img
                    src={court.image || court1}
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
          )}
        </section>
        <AdBanners />
      </div>
    </div>
  );
}

export default BookCourtPage;
