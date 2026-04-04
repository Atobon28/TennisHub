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
} from "../../firebase/services";

interface Tournament {
  id: string;
  name: string;
  info: string;
  level: number;
}

interface Court {
  id: string;
  name: string;
  image: string;
}

interface Player {
  id: string;
  uid: string;
  username: string;
  level?: number;
}

interface Coach {
  id: string;
  uid: string;
  username: string;
}

const classNames = [
  "player-home__court-card--large",
  "player-home__court-card--small-top",
  "player-home__court-card--small-bottom",
];

const matches = [
  {
    id: 1,
    time: "Today - 05:00 PM",
    court: "Ciudad Jardín",
    host: "Juan Carlos Salazar",
  },
  { id: 2, time: "Today - 08:00 PM", court: "Ingenio", host: "Daniela Rojas" },
  { id: 3, time: "Today - 09:00 PM", court: "Granada", host: "Sebas López" },
];

function PlayerHomePage() {
  const navigate = useNavigate();
  const matchesScrollRef = useRef<HTMLDivElement | null>(null);
  const tournamentsScrollRef = useRef<HTMLDivElement | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tournamentsData, courtsData, playersData, coachesData] =
          await Promise.all([
            getTournaments(),
            getCourts(),
            getPlayers(),
            getCoaches(),
          ]);
        setTournaments(tournamentsData as Tournament[]);
        setCourts(courtsData as Court[]);
        setPlayers(playersData as Player[]);
        setCoaches(coachesData as Coach[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAll();
  }, []);

  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right",
  ) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "right" ? 300 : -300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="player-home">
      <div className="player-home__mobile-actions">
        <button
          className="player-home__action player-home__action--primary"
          onClick={() => navigate("/player/create-match")}
        >
          Create Match
        </button>
        <button
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
            {/* Players Nearby */}
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
                  className="player-home__section-more-button"
                  onClick={() => navigate("/player/players")}
                >
                  Ver más...
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

            {/* Coaches */}
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
                  className="player-home__section-more-button"
                  onClick={() => navigate("/player/coaches")}
                >
                  Ver más...
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

          {/* Today's Matches */}
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
                <button className="player-home__section-more-button">
                  Ver más...
                </button>
                <div className="player-home__scroll-btns">
                  <button
                    className="player-home__scroll-btn"
                    onClick={() => scroll(matchesScrollRef, "left")}
                  >
                    ‹
                  </button>
                  <button
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
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  time={match.time}
                  court={match.court}
                  host={match.host}
                />
              ))}
            </div>
          </section>

          {/* Upcoming Tournaments */}
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
                  className="player-home__section-more-button"
                  onClick={() => navigate("/player/tournaments")}
                >
                  Ver más...
                </button>
                <div className="player-home__scroll-btns">
                  <button
                    className="player-home__scroll-btn"
                    onClick={() => scroll(tournamentsScrollRef, "left")}
                  >
                    ‹
                  </button>
                  <button
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
              {tournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  level={tournament.level}
                  name={tournament.name}
                  info={tournament.info}
                />
              ))}
            </div>
          </section>

          {/* Trending Courts */}
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
                className="player-home__section-more-button"
                onClick={() => navigate("/player/courts")}
              >
                Ver más...
              </button>
            </div>
            <div className="player-home__courts-grid">
              {courts.slice(0, 3).map((court, index) => (
                <CourtCard
                  key={court.id}
                  name={court.name}
                  image={court.image || court1}
                  className={classNames[index]}
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
