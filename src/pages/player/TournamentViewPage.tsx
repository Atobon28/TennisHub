import AdBanners from "../../components/player/AdBanners";
import "../../styles/tournament-view.css";
import court1 from "../../assets/court-1.jpg";

const tournament = {
  name: "Tournament of champions",
  court: "Ciudad Jardín",
  date: "28/02/26",
  hour: "08:00 AM",
  minLevel: 5,
  image: court1,
};

function TournamentViewPage() {
  return (
    <div className="tournament-view">
      <div className="tournament-view__grid">
        <section className="tournament-view__main">
          <div className="tournament-view__card">
            <h2 className="tournament-view__title">{tournament.name}</h2>
            <div className="tournament-view__body">
              <img
                src={tournament.image}
                alt={tournament.name}
                className="tournament-view__image"
              />
              <div className="tournament-view__info">
                <p className="tournament-view__detail">
                  <span className="tournament-view__label">Court: </span>
                  {tournament.court}
                </p>
                <p className="tournament-view__detail">
                  <span className="tournament-view__label">Date: </span>
                  {tournament.date}
                </p>
                <p className="tournament-view__detail">
                  <span className="tournament-view__label">Hour: </span>
                  {tournament.hour}
                </p>
                <p className="tournament-view__detail tournament-view__detail--level">
                  <span className="tournament-view__label">
                    Minimum Level:{" "}
                  </span>
                  <span className="tournament-view__level-badge">
                    {tournament.minLevel}
                  </span>
                </p>
              </div>
            </div>
            <button className="tournament-view__join-btn">Join</button>
          </div>
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default TournamentViewPage;
