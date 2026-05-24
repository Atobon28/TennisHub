import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import AdBanners from "../../components/player/AdBanners";
import TournamentCard from "../../components/player/TournamentCard";
import { useTournaments } from "../../context";
import { useAuth } from "../../context/useAuth";
import "../../styles/tournaments-page.css";

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

  const playerCategory = getPlayerCategory(
    userData?.level,
    userData?.category,
  );

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

          {loading ? (
            <p className="tournaments-page__loading">Loading tournaments...</p>
          ) : error ? (
            <p className="tournaments-page__loading">{error}</p>
          ) : tournaments.length === 0 ? (
            <p className="tournaments-page__loading">
              No tournaments available yet.
            </p>
          ) : (
            <div className="tournaments-page__cards-grid">
              {tournaments.map((tournament) => {
                const categories = tournament.categories || [];

                const canApply =
                  categories.length === 0 ||
                  categories.includes(playerCategory) ||
                  categories.includes("Open");

                const badge =
                  categories.length === 1
                    ? getCategoryBadge(categories[0])
                    : "🎾";

                return (
                  <TournamentCard
                    key={tournament.id}
                    categoryBadge={badge}
                    name={tournament.name}
                    info={tournament.info}
                    buttonLabel="View"
                    disabled={!canApply}
                    disabledLabel="Not eligible"
                    onView={() =>
                      navigate(`/player/tournaments/view/${tournament.id}`)
                    }
                  />
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

export default TournamentsPage;