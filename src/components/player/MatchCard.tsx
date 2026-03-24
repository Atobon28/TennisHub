interface MatchCardProps {
  time: string
  court: string
  host: string
}

function MatchCard({ time, court, host }: MatchCardProps) {
  return (
    <article className="player-home__match-card player-home__match-card--scroll">
      <div className="player-home__match-left">
        <p>{time}</p>
        <p>Court: {court}</p>
        <p>Host: {host}</p>
      </div>
      <div className="player-home__match-right">
        <div className="player-home__match-brand">
          <span className="player-home__brand-baloo">TennisHub</span>
          <span>Match</span>
        </div>
      </div>
    </article>
  )
}

export default MatchCard