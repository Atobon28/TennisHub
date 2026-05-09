interface CourtCardProps {
  name: string;
  image: string;
  courtType?: string;
  className?: string;
  onSeeMore?: () => void;
}

function CourtCard({
  name,
  image,
  courtType,
  className = "",
  onSeeMore,
}: CourtCardProps) {
  return (
    <article className={`player-home__court-card ${className}`}>
      <img src={image} alt={name} className="player-home__court-image" />

      <div className="player-home__court-overlay">
        <span className="player-home__court-name">{name}</span>

        {courtType && (
          <span
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              color: "#111",
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 800,
              marginTop: "0.35rem",
            }}
          >
            {courtType}
          </span>
        )}

        <button
          type="button"
          className="player-home__court-see-more"
          onClick={onSeeMore}
        >
          See more
        </button>
      </div>
    </article>
  );
}

export default CourtCard;