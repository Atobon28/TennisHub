interface TournamentCardProps {
  level: number;
  name: string;
  info: string;
  onView?: () => void;
  buttonLabel?: string;
}

function TournamentCard({
  level,
  name,
  info,
  onView,
  buttonLabel = "View",
}: TournamentCardProps) {
  return (
    <article className="player-home__tournament-card player-home__tournament-card--scroll">
      <div className="player-home__tournament-badge">{level}</div>
      <h3 className="player-home__tournament-name">{name}</h3>
      <p className="player-home__tournament-info">{info}</p>
      <button
        className="player-home__view-button player-home__view-button--small"
        onClick={onView}
      >
        {buttonLabel}
      </button>
    </article>
  );
}

export default TournamentCard;
