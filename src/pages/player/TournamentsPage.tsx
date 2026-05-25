import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import AdBanners from "../../components/player/AdBanners";
import TournamentCard from "../../components/player/TournamentCard";
import { useTournaments } from "../../context";
import { useAuth } from "../../context/useAuth";
import "../../styles/tournaments-page.css";

const categoryOptions = [
  "All",
  "Open",
  "First Category",
  "Second Category",
  "Third Category",
  "Fourth Category",
  "Fifth Category",
  "Beginner",
  "Junior",
  "Senior",
];

const statusOptions = ["All", "Open", "Full", "Closed"];

const getPlayerCategory = (
  level?: number | null,
  category?: string | null,
) => {
  if (category) return category;

  if (level === 1) return "First Category";
  if (level === 2) return "Second Category";
  if (level === 3) return "Third Category";
  if (level === 4) return "Fourth Category";
  if (level === 5) return "Fifth Category";

  return "";
};

const getCategoryBadge = (category?: string) => {
  if (!category) return "🎾";

  const badges: Record<string, string> = {
    Open: "O",
    "First Category": "1",
    "Second Category": "2",
    "Third Category": "3",
    "Fourth Category": "4",
    "Fifth Category": "5",
    Beginner: "B",
    Junior: "J",
    Senior: "S",
  };

  return badges[category] || category.charAt(0);
};

function TournamentsPage() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const { tournaments, loading, error, loadTournaments } = useTournaments();
  const hasLoadedTournaments = useRef(false);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const playerCategory = useMemo(
    () => getPlayerCategory(userData?.level, userData?.category),
    [userData?.level, userData?.category],
  );

  const visibleTournaments = useMemo(() => {
    return tournaments
      .map((tournament) => {
        const categories = tournament.categories || [];
        const status = tournament.status || "Open";

        const canApply =
          categories.length === 0 ||
          categories.includes(playerCategory) ||
          categories.includes("Open");

        const badge =
          categories.length === 1 ? getCategoryBadge(categories[0]) : "🎾";

        return {
          ...tournament,
          categories,
          status,
          canApply,
          badge,
        };
      })
      .filter((tournament) => {
        const matchesCategory =
          selectedCategory === "All" ||
          tournament.categories.includes(selectedCategory) ||
          (selectedCategory === "Open" &&
            tournament.categories.includes("Open"));

        const matchesStatus =
          selectedStatus === "All" || tournament.status === selectedStatus;

        return matchesCategory && matchesStatus;
      });
  }, [tournaments, playerCategory, selectedCategory, selectedStatus]);

  useEffect(() => {
    if (hasLoadedTournaments.current) return;

    hasLoadedTournaments.current = true;
    loadTournaments();
  }, [loadTournaments]);

  return (
    <div className="tournaments-page">
      <div className="tournaments-page__grid">
        <section className="tournaments-page__main">
          <div className="tournaments-page__section-title-wrap">
            <span
              className="tournaments-page__icon-gradient-wrap"
              aria-hidden="true"
            >
              <Icon
                icon="game-icons:tennis-racket"
                className="tournaments-page__section-icon"
              />
            </span>

            <h2 className="tournaments-page__section-title">
              Upcoming Tournaments
            </h2>
          </div>

          {playerCategory && (
            <p
              style={{
                marginBottom: "1rem",
                fontWeight: 700,
                color: "#555",
              }}
            >
              Your category: {playerCategory}
            </p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <select
              aria-label="Filter tournaments by category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              style={{
                border: "none",
                borderRadius: "999px",
                padding: "0.8rem 1rem",
                fontWeight: 800,
                fontFamily: "inherit",
                background: "white",
                color: "#111",
                boxShadow: "0 4px 12px rgba(15, 14, 12, 0.08)",
              }}
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter tournaments by status"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              style={{
                border: "none",
                borderRadius: "999px",
                padding: "0.8rem 1rem",
                fontWeight: 800,
                fontFamily: "inherit",
                background: "white",
                color: "#111",
                boxShadow: "0 4px 12px rgba(15, 14, 12, 0.08)",
              }}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All Statuses" : status}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="tournaments-page__loading" role="status">
              Loading tournaments...
            </p>
          ) : error ? (
            <p className="tournaments-page__loading" role="alert">
              {error}
            </p>
          ) : visibleTournaments.length === 0 ? (
            <p className="tournaments-page__loading" role="status">
              No tournaments match your filters.
            </p>
          ) : (
            <div className="tournaments-page__cards-grid">
              {visibleTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  categoryBadge={tournament.badge}
                  name={tournament.name}
                  info={tournament.info}
                  buttonLabel="View"
                  disabled={!tournament.canApply}
                  disabledLabel="Not eligible"
                  onView={() =>
                    navigate(`/player/tournaments/view/${tournament.id}`)
                  }
                />
              ))}
            </div>
          )}
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default TournamentsPage;