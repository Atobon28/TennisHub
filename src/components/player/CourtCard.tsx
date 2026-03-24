interface CourtCardProps {
  name: string;
  image: string;
  className?: string;
  onSeeMore?: () => void;
}

function CourtCard({ name, image, className = "", onSeeMore }: CourtCardProps) {
  return (
    <article className={`player-home__court-card ${className}`}>
      <img src={image} alt={name} className="player-home__court-image" />
      <div className="player-home__court-overlay">
        <span className="player-home__court-name">{name}</span>
        <button className="player-home__court-see-more" onClick={onSeeMore}>
          See more
        </button>
      </div>
    </article>
  );
}

export default CourtCard;
