import courtFallback from "../../assets/court-1.jpg";

interface CourtCardProps {
  name: string;
  image?: string;
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
  const courtName = name || "Tennis court";

  return (
    <article className={`player-home__court-card ${className}`}>
      <img
        src={image || courtFallback}
        alt={`${courtName} court`}
        className="player-home__court-image"
        onError={(event) => {
          event.currentTarget.src = courtFallback;
        }}
      />

      <div className="player-home__court-overlay">
        <span className="player-home__court-name">{courtName}</span>

        {courtType && (
          <span
            aria-label={`Court type: ${courtType}`}
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
          aria-label={`See more details for ${courtName}`}
          onClick={onSeeMore}
        >
          See more
        </button>
      </div>
    </article>
  );
}

export default CourtCard;