import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "../../styles/player-home.css";
import court1 from "../../assets/court-1.jpg";
import AdBanners from "../../components/player/AdBanners";
import MatchCard from "../../components/player/MatchCard";
import TournamentCard from "../../components/player/TournamentCard";
import PersonCard from "../../components/player/PersonCard";
import CourtCard from "../../components/player/CourtCard";
import {
  getTournaments,
  getCourts,
  getPlayers,
  getCoaches,
  getMatches,
} from "../../firebase/services";

interface Tournament {
  id: string;
  name: string;
  info: string;
  level?: number;
  categories?: string[];
}

interface Court {
  id: string;
  name: string;
  image: string;
  courtType?: string;
}

interface Player {
  id: string;
  uid: string;
  username: string;
  level?: number;
  category?: string;
}

interface Coach {
  id: string;
  uid: string;
  username: string;
}

interface Match {
  id: string;
  court: string;
  date: string;
  time: string;
  hostUsername: string;
  players: { uid: string; username: string }[];
  playerIds: string[];
  maxPlayers: number;
}

const classNames = [
  "player-home__court-card--large",
  "player-home__court-card--small-top",
  "player-home__court-card--small-bottom",
];

function PlayerHomePage() {
  const navigate = useNavigate();

  const matchesScrollRef = useRef<HTMLDivElement | null>(null);
  const tournamentsScrollRef = useRef<HTMLDivElement | null>(null);

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [todayMatches, setTodayMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          tournamentsData,
          courtsData,
          playersData,
          coachesData,
          matchesData,
        ] = await Promise.all([
          getTournaments(),
          getCourts(),
          getPlayers(),
          getCoaches(),
          getMatches(),
        ]);

        setTournaments(tournamentsData as Tournament[]);
        setCourts(courtsData as Court[]);
        setPlayers(playersData as Player[]);
        setCoaches(coachesData as Coach[]);

        const today = new Date().toISOString().split("T")[0];

        const filteredMatches = (matchesData as Match[]).filter(
          (match) => match.date === today
        );

        setTodayMatches(filteredMatches);
      } catch (error) {
        console.error("Error fetching player home data:", error);
      }
    };

    fetchAll();
  }, []);

  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right"
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
                      name={player.username}
                      image={court1}
                      level={player.level}
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
                    <PersonCard name={coach.username} image={court1} />
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
                    time={match.time}
                    court={match.court}
                    host={match.hostUsername}
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
                tournaments.map((tournament) => (
                  <TournamentCard
                    key={tournament.id}
                    level={tournament.level}
                    name={tournament.name}
                    info={tournament.info}
                    buttonLabel="View"
                    onView={() =>
                      navigate(`/player/tournaments/view/${tournament.id}`)
                    }
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
                  name={court.name}
                  image={court.image || court1}
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