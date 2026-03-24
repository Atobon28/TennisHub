import { Icon } from "@iconify/react";
import "../../styles/player-home.css";
import coach1 from "../../assets/coach-1.jpg";
import coach2 from "../../assets/coach-2.jpg";
import coach3 from "../../assets/coach-3.jpg";
import player1 from "../../assets/player-1.jpg";
import player2 from "../../assets/player-2.jpg";
import player3 from "../../assets/player-3.jpg";
import court1 from "../../assets/court-1.jpg";
import court2 from "../../assets/court-2.jpg";
import AdBanners from "../../components/player/AdBanners";
import MatchCard from "../../components/player/MatchCard";
import TournamentCard from "../../components/player/TournamentCard";

function PlayerHomePage() {
  const coaches = [
    { name: "Juan Ceballos", image: coach1 },
    { name: "Sebas López", image: coach2 },
    { name: "Santi Pérez", image: coach3 },
  ];

  const players = [
    { name: "Daniela Salazar", image: player1, level: 3 },
    { name: "Juan Sarmiento", image: player2, level: 2 },
    { name: "Tony Hernández", image: player3, level: 5 },
  ];

  const matches = [
    {
      id: 1,
      time: "Today - 05:00 PM",
      court: "Ciudad Jardín",
      host: "Juan Carlos Salazar",
    },
    {
      id: 2,
      time: "Today - 08:00 PM",
      court: "Ingenio",
      host: "Daniela Rojas",
    },
    { id: 3, time: "Today - 09:00 PM", court: "Granada", host: "Sebas López" },
  ];

  const tournaments = [
    {
      id: 1,
      name: "Tournament of champions",
      info: "28/02/26 - 08:00 AM - Court: Ciudad Jardín",
      level: 5,
    },
    {
      id: 2,
      name: "Beginners Tournament",
      info: "07/03/26 - 08:00 AM - Court: Granada",
      level: 2,
    },
    {
      id: 3,
      name: "Open Tournament Clash",
      info: "10/03/26 - 06:00 PM - Court: Ingenio",
      level: 4,
    },
  ];

  const courts = [
    {
      name: "Ciudad Jardín",
      image: court1,
      className: "player-home__court-card--large",
    },
    {
      name: "Granada",
      image: court2,
      className: "player-home__court-card--small-top",
    },
    {
      name: "Lago Calima",
      image: court2,
      className: "player-home__court-card--small-bottom",
    },
  ];

  return (
    <div className="player-home">
      <div className="player-home__mobile-actions">
        <button className="player-home__action player-home__action--primary">
          Create Match
        </button>
        <button className="player-home__action player-home__action--secondary">
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
                <button className="player-home__section-more-button">
                  Ver más...
                </button>
              </div>
              <div className="player-home__small-cards">
                {players.map((player) => (
                  <article
                    key={player.name}
                    className="player-home__person-card"
                  >
                    <img
                      src={player.image}
                      alt={player.name}
                      className="player-home__person-image"
                    />
                    <div className="player-home__person-name">
                      {player.name}
                    </div>
                    <div className="player-home__level-badge">
                      {player.level}
                    </div>
                  </article>
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
                <button className="player-home__section-more-button">
                  Ver más...
                </button>
              </div>
              <div className="player-home__small-cards">
                {coaches.map((coach) => (
                  <article
                    key={coach.name}
                    className="player-home__person-card"
                  >
                    <img
                      src={coach.image}
                      alt={coach.name}
                      className="player-home__person-image"
                    />
                    <div className="player-home__person-name">{coach.name}</div>
                  </article>
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
              <button className="player-home__section-more-button">
                Ver más...
              </button>
            </div>
            <div className="player-home__horizontal-scroll">
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
              <button className="player-home__section-more-button">
                Ver más...
              </button>
            </div>
            <div className="player-home__horizontal-scroll">
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
              <button className="player-home__section-more-button">
                Ver más...
              </button>
            </div>
            <div className="player-home__courts-grid">
              {courts.map((court) => (
                <article
                  key={court.name}
                  className={`player-home__court-card ${court.className}`}
                >
                  <img
                    src={court.image}
                    alt={court.name}
                    className="player-home__court-image"
                  />
                </article>
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
