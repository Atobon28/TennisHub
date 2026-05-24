import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "../../styles/player-home.css";
import court1 from "../../assets/court-1.jpg";
import AdBanners from "../../components/player/AdBanners";
import MatchCard from "../../components/player/MatchCard";
import TournamentCard from "../../components/player/TournamentCard";
import PersonCard from "../../components/player/PersonCard";
import CourtCard from "../../components/player/CourtCard";
import { useAuth } from "../../context/useAuth";
import player1 from "../../assets/player-1.jpg";
import {
  useTournaments,
  useCourts,
  usePlayers,
  useCoaches,
  useMatches,
} from "../../context";

const classNames = [
  "player-home__court-card--large",
  "player-home__court-card--small-top",
  "player-home__court-card--small-bottom",
];

const getPlayerCategory = (level?: number | null, category?: string | null) => {
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

function PlayerHomePage() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const matchesScrollRef = useRef<HTMLDivElement | null>(null);
  const tournamentsScrollRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedHomeData = useRef(false);

  const { tournaments, loadTournaments } = useTournaments();
  const { courts, loadCourts } = useCourts();
  const { players, loadPlayers } = usePlayers();
  const { coaches, loadCoaches } = useCoaches();
  const { matches, loadMatches } = useMatches();

  const playerCategory = getPlayerCategory(userData?.level, userData?.category);

  useEffect(() => {
    if (hasLoadedHomeData.current) return;

    hasLoadedHomeData.current = true;

    loadTournaments();
    loadCourts();
    loadPlayers();
    loadCoaches();
    loadMatches();
  }, [loadTournaments, loadCourts, loadPlayers, loadCoaches, loadMatches]);

  const today = new Date().toISOString().split("T")[0];

  const todayMatches = matches.filter((match) => match.date === today);

  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right",
  ) => {
    if (!ref.current) return;

    ref.current.scrollBy({
      left: direction === "right" ? 300 : -300,
      behavior: "smooth",
    });
  };

  return (
    <div className="player-home">
      <div className="player-home__mobile-actions">
        <button
          type="button"
          className="player-home__action player-home__action--primary"
          onClick={() => navigate("/player/create-match")}
        >
          Create Match
        </button>

        <button
          type="button"
          className="player-home__action player-home__action--secondary"
          onClick={() => navigate("/player/coaches")}
        >
          <Icon
            icon="solar:magnifer-linear"
            className="player-home__action-icon"
          />

          <span>Find a Coach</span>
        </button>
      </div>

      <div className="player-home__grid">
        <section className="player-home__main">
          <div className="player-home__top-cards">
            <div className="player-home__mini-section">
              <div className="player-home__section-header">
                <div className="player-home__section-title-wrap">
                  <span className="player-home__icon-gradient-wrap">
                    <Icon
                      icon="ph:user-fill"
                      className="player-home__section-icon"
                    />
                  </span>

                  <h2 className="player-home__section-title">Players Nearby</h2>
                </div>

                <button
                  type="button"
                  className="player-home__section-more-button"
                  onClick={() => navigate("/player/players")}
                >
                  See more...
                </button>
              </div>

              <div className="player-home__small-cards">
                {players.slice(0, 3).map((player) => (
                  <div
                    key={player.id}
                    onClick={() =>
                      navigate(`/player/players/view/${player.uid}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <PersonCard
                      name={player.username || "Player"}
                      image={
                        typeof player.photoURL === "string"
                          ? player.photoURL
                          : player1
                      }
                      level={
                        typeof player.level === "number"
                          ? player.level
                          : undefined
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="player-home__mini-section">
              <div className="player-home__section-header">
                <div className="player-home__section-title-wrap">
                  <span className="player-home__icon-gradient-wrap">
                    <Icon
                      icon="mdi:arm-flex"
                      className="player-home__section-icon"
                    />
                  </span>

                  <h2 className="player-home__section-title">Coaches</h2>
                </div>

                <button
                  type="button"
                  className="player-home__section-more-button"
                  onClick={() => navigate("/player/coaches")}
                >
                  See more...
                </button>
              </div>

              <div className="player-home__small-cards">
                {coaches.slice(0, 3).map((coach) => (
                  <div
                    key={coach.id}
                    onClick={() =>
                      navigate(`/player/coaches/view/${coach.uid}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <PersonCard
                      name={coach.username || "Coach"}
                      image={
                        typeof coach.photoURL === "string"
                          ? coach.photoURL
                          : court1
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="player-home__section">
            <div className="player-home__section-header">
              <div className="player-home__section-title-wrap">
                <span className="player-home__icon-gradient-wrap">
                  <Icon
                    icon="game-icons:tennis-racket"
                    className="player-home__section-icon"
                  />
                </span>

                <h2 className="player-home__section-title">Today's Matches</h2>
              </div>

              <div className="player-home__section-right">
                <button
                  type="button"
                  className="player-home__section-more-button"
                  onClick={() => navigate("/player/matches")}
                >
                  See more...
                </button>

                <div className="player-home__scroll-btns">
                  <button
                    type="button"
                    className="player-home__scroll-btn"
                    onClick={() => scroll(matchesScrollRef, "left")}
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    className="player-home__scroll-btn"
                    onClick={() => scroll(matchesScrollRef, "right")}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            <div
              className="player-home__horizontal-scroll"
              ref={matchesScrollRef}
            >
              {todayMatches.length === 0 ? (
                <p
                  style={{
                    color: "#888",
                    fontSize: "0.9rem",
                    padding: "8px 0",
                  }}
                >
                  No matches today.
                </p>
              ) : (
                todayMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    time={match.time || ""}
                    court={match.court || ""}
                    host={match.hostUsername || match.hostName || ""}
                    onClick={() => navigate(`/player/matches/view/${match.id}`)}
                  />
                ))
              )}
            </div>
          </section>

          <section className="player-home__section">
            <div className="player-home__section-header">
              <div className="player-home__section-title-wrap">
                <span className="player-home__icon-gradient-wrap">
                  <Icon
                    icon="game-icons:tennis-racket"
                    className="player-home__section-icon"
                  />
                </span>

                <h2 className="player-home__section-title">
                  Upcoming Tournaments
                </h2>
              </div>

              <div className="player-home__section-right">
                <button
                  type="button"
                  className="player-home__section-more-button"
                  onClick={() => navigate("/player/tournaments")}
                >
                  See more...
                </button>

                <div className="player-home__scroll-btns">
                  <button
                    type="button"
                    className="player-home__scroll-btn"
                    onClick={() => scroll(tournamentsScrollRef, "left")}
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    className="player-home__scroll-btn"
                    onClick={() => scroll(tournamentsScrollRef, "right")}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            <div
              className="player-home__horizontal-scroll"
              ref={tournamentsScrollRef}
            >
              {tournaments.length === 0 ? (
                <p
                  style={{
                    color: "#888",
                    fontSize: "0.9rem",
                    padding: "8px 0",
                  }}
                >
                  No tournaments available.
                </p>
              ) : (
                tournaments.map((tournament) => {
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
                })
              )}
            </div>
          </section>

          <section className="player-home__section">
            <div className="player-home__section-header">
              <div className="player-home__section-title-wrap">
                <span className="player-home__icon-gradient-wrap">
                  <Icon
                    icon="mingcute:fire-fill"
                    className="player-home__section-icon"
                  />
                </span>

                <h2 className="player-home__section-title">Trending Courts</h2>
              </div>

              <button
                type="button"
                className="player-home__section-more-button"
                onClick={() => navigate("/player/courts")}
              >
                See more...
              </button>
            </div>

            <div className="player-home__courts-grid">
              {courts.slice(0, 3).map((court, index) => (
                <CourtCard
                  key={court.id}
                  name={court.name || "Court"}
                  image={typeof court.image === "string" ? court.image : court1}
                  courtType={
                    typeof court.courtType === "string"
                      ? court.courtType
                      : undefined
                  }
                  className={classNames[index]}
                  onSeeMore={() => navigate(`/player/courts/view/${court.id}`)}
                />
              ))}
            </div>
          </section>
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default PlayerHomePage;