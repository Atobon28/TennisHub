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
  image?: string;
  courtType?: string;
}

const courtTypeFilters = ["All", "Grass", "Hard", "Clay"];

function BookCourtPage() {
  const navigate = useNavigate();

  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedType, setSelectedType] = useState("All");
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

  const filteredCourts =
    selectedType === "All"
      ? courts
      : courts.filter((court) => court.courtType === selectedType);

  return (
    <div className="book-court">
      <div className="book-court__grid">
        <section className="book-court__main">
          <div className="book-court__section-title-wrap">
            <span className="book-court__icon-gradient-wrap" aria-hidden="true">
              <Icon
                icon="mingcute:fire-fill"
                className="book-court__section-icon"
              />
            </span>

            <h2 className="book-court__section-title">Trending Courts</h2>
          </div>

          <div
            aria-label="Court surface filters"
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginBottom: "1.5rem",
            }}
          >
            {courtTypeFilters.map((type) => {
              const isSelected = selectedType === type;

              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`Filter courts by ${type}`}
                  onClick={() => setSelectedType(type)}
                  style={{
                    border: isSelected ? "2px solid #111111" : "1px solid #dddddd",
                    borderRadius: "999px",
                    padding: "0.65rem 1rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    background: isSelected
                      ? "linear-gradient(180deg, #bfe212 0%, #6f8500 100%)"
                      : "#ffffff",
                    color: isSelected ? "#ffffff" : "#111111",
                    boxShadow: isSelected
                      ? "0 8px 18px rgba(15, 14, 12, 0.16)"
                      : "0 4px 12px rgba(15, 14, 12, 0.08)",
                  }}
                >
                  {isSelected ? `✓ ${type}` : type}
                </button>
              );
            })}
          </div>

          {loading ? (
            <p className="book-court__loading">Loading courts...</p>
          ) : courts.length === 0 ? (
            <p className="book-court__loading">No courts available.</p>
          ) : filteredCourts.length === 0 ? (
            <p className="book-court__loading">
              No courts found for this surface.
            </p>
          ) : (
            <div className="book-court__courts-grid">
              {filteredCourts.map((court) => {
                const courtName = court.name || "Tennis court";

                return (
                  <article key={court.id} className="book-court__court-card">
                    <img
                      src={court.image || court1}
                      alt={`${courtName} court`}
                      className="book-court__court-image"
                      onError={(event) => {
                        event.currentTarget.src = court1;
                      }}
                    />

                    <div className="book-court__court-overlay">
                      <span className="book-court__court-name">
                        {courtName}
                      </span>

                      {court.courtType && (
                        <span
                          aria-label={`Court type: ${court.courtType}`}
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
                          {court.courtType}
                        </span>
                      )}

                      <button
                        type="button"
                        className="book-court__see-more-btn"
                        aria-label={`See more details for ${courtName}`}
                        onClick={() =>
                          navigate(`/player/courts/view/${court.id}`)
                        }
                      >
                        See more
                      </button>
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

export default BookCourtPage;