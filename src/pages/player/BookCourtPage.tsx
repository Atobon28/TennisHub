import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useCourts } from "../../context";
import "../../styles/book-court.css";
import court1 from "../../assets/court-1.jpg";
import AdBanners from "../../components/player/AdBanners";

const courtTypeFilters = ["All", "Grass", "Hard", "Clay"];

function BookCourtPage() {
  const navigate = useNavigate();

  const { courts, loading, error, loadCourts } = useCourts();

  const [selectedType, setSelectedType] = useState("All");
  const hasLoadedCourts = useRef(false);

  useEffect(() => {
    if (hasLoadedCourts.current) return;

    hasLoadedCourts.current = true;
    loadCourts();
  }, [loadCourts]);

  const filteredCourts =
    selectedType === "All"
      ? courts
      : courts.filter((court) => court.courtType === selectedType);

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

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginBottom: "1.5rem",
            }}
          >
            {courtTypeFilters.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                style={{
                  border: "none",
                  borderRadius: "999px",
                  padding: "0.65rem 1rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  background:
                    selectedType === type
                      ? "linear-gradient(180deg, #bfe212 0%, #6f8500 100%)"
                      : "#ffffff",
                  color: selectedType === type ? "#ffffff" : "#111111",
                  boxShadow:
                    selectedType === type
                      ? "0 8px 18px rgba(15, 14, 12, 0.16)"
                      : "0 4px 12px rgba(15, 14, 12, 0.08)",
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="book-court__loading">Loading courts...</p>
          ) : error ? (
            <p className="book-court__loading">{error}</p>
          ) : courts.length === 0 ? (
            <p className="book-court__loading">No courts available.</p>
          ) : filteredCourts.length === 0 ? (
            <p className="book-court__loading">
              No courts found for this surface.
            </p>
          ) : (
            <div className="book-court__courts-grid">
              {filteredCourts.map((court) => (
                <article key={court.id} className="book-court__court-card">
                  <img
                    src={court.image || court1}
                    alt={court.name || "Tennis court"}
                    className="book-court__court-image"
                  />

                  <div className="book-court__court-overlay">
                    <span className="book-court__court-name">
                      {court.name}
                    </span>

                    {court.courtType && (
                      <span
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.92)",
                          color: "#111",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "999px",
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          marginTop: "0.35rem",
                        }}
                      >
                        {String(court.courtType)}
                      </span>
                    )}

                    <button
                      type="button"
                      className="book-court__see-more-btn"
                      onClick={() =>
                        navigate(`/player/courts/view/${court.id}`)
                      }
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