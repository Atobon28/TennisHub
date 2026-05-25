import playerFallback from "../../assets/player-1.jpg";

interface PersonCardProps {
  name: string;
  image?: string;
  level?: number;
}

function PersonCard({ name, image, level }: PersonCardProps) {
  const personName = name || "Tennis user";

  return (
    <article className="player-home__person-card">
      <img
        src={image || playerFallback}
        alt={`${personName} profile photo`}
        className="player-home__person-image"
        onError={(event) => {
          event.currentTarget.src = playerFallback;
        }}
      />

      <div className="player-home__person-name">{personName}</div>

      {level !== undefined && (
        <div
          className="player-home__level-badge"
          aria-label={`Player level ${level}`}
        >
          {level}
        </div>
      )}
    </article>
  );
}

export default PersonCard;