import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import AdBanners from "../../components/player/AdBanners";
import TournamentCard from "../../components/player/TournamentCard";
import { getTournaments } from "../../firebase/services";
import { useAuth } from "../../context/useAuth";
import "../../styles/tournaments-page.css";

interface Tournament {
  id: string;
  name: string;
  info: string;
  level?: number;
  categories?: string[];
}

const getPlayerCategory = (
  level?: number | null,
  category?: string | null
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

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  const playerCategory = getPlayerCategory(
    userData?.level,
    userData?.category
  );

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await getTournaments();
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