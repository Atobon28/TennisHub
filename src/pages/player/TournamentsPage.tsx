import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import AdBanners from "../../components/player/AdBanners";
import TournamentCard from "../../components/player/TournamentCard";
import { getTournaments } from "../../firebase/services";
import "../../styles/tournaments-page.css";

interface Tournament {
  id: string;
  name: string;
  info: string;
  level: number;
}

function TournamentsPage() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

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

          {loading ? (
            <p className="tournaments-page__loading">Loading tournaments...</p>
          ) : (
            <div className="tournaments-page__cards-grid">
              {tournaments.map((t) => (
                <TournamentCard
                  key={t.id}
                  level={t.level}
                  name={t.name}
                  info={t.info}
                  onView={() => navigate("/player/tournaments/view")}
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
