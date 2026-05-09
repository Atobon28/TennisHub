interface TournamentCardProps {
  level?: number;
  categoryBadge?: string;
  name: string;
  info: string;
  onView?: () => void;
  buttonLabel?: string;
  disabled?: boolean;
  disabledLabel?: string;
}

function TournamentCard({
  level,
  categoryBadge,
  name,
  info,
  onView,
  buttonLabel = "View",
  disabled = false,
  disabledLabel = "Not eligible",
}: TournamentCardProps) {
  const badge = categoryBadge || level || "🎾";

  return (
    <article
      className="player-home__tournament-card player-home__tournament-card--scroll"
      style={{
        opacity: disabled ? 0.45 : 1,
        filter: disabled ? "grayscale(1)" : "none",
        pointerEvents: "auto",
      }}
    >
      <div className="player-home__tournament-badge">{badge}</div>

      <h3 className="player-home__tournament-name">{name}</h3>

      <p className="player-home__tournament-info">{info}</p>

      {disabled ? (
        <button
          type="button"
          className="player-home__view-button player-home__view-button--small"
          disabled
          style={{
            backgroundColor: "#9b9b9b",
            cursor: "not-allowed",
          }}
        >
          {disabledLabel}
        </button>
      ) : (
        <button
          type="button"
          className="player-home__view-button player-home__view-button--small"
          onClick={onView}
        >
          {buttonLabel}
        </button>
      )}
    </article>
  );
}

export default TournamentCard;