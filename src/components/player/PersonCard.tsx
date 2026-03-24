interface PersonCardProps {
  name: string;
  image: string;
  level?: number;
}

function PersonCard({ name, image, level }: PersonCardProps) {
  return (
    <article className="player-home__person-card">
      <img src={image} alt={name} className="player-home__person-image" />
      <div className="player-home__person-name">{name}</div>
      {level !== undefined && (
        <div className="player-home__level-badge">{level}</div>
      )}
    </article>
  );
}

export default PersonCard;
