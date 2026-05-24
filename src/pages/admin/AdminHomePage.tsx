import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { useDashboard } from "../../context";
import { useAuth } from "../../context/useAuth";
import "../../styles/admin-home.css";
import court1 from "../../assets/court-1.jpg";

function AdminHomePage() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const {
    tournaments,
    courts,
    matches,
    registrations,
    loading,
    error,
    loadAdminDashboard,
  } = useDashboard();

  useEffect(() => {
    if (!userData?.uid) return;

    loadAdminDashboard(userData.uid);
  }, [userData?.uid, loadAdminDashboard]);

  const getTournamentBadge = (tournament: (typeof tournaments)[number]) => {
    if (tournament.tournamentType === "doubles") return "D";
    if (tournament.tournamentType === "both") return "S/D";

    return tournament.level || "S";
  };

  const isTournamentFull = (tournament: (typeof tournaments)[number]) => {
    if (tournament.status === "Full") return true;

    if (!tournament.capacityByCategory) return false;

    const tournamentRegistrations = registrations.filter(
      (registration) => registration.tournamentId === tournament.id,
    );

    const totalSingles = Object.values(tournament.capacityByCategory).reduce(
      (total, category) => total + (category.singlesPlayers || 0),
      0,
    );

    const totalPairs = Object.values(tournament.capacityByCategory).reduce(
      (total, category) => total + (category.doublesPairs || 0),
      0,
    );

    const usedSingles = tournamentRegistrations.filter(
      (registration) => registration.entryType === "singles",
    ).length;

    const usedPairs = tournamentRegistrations.filter(
      (registration) => registration.entryType === "doubles",
    ).length;

    return (
      (totalSingles > 0 && usedSingles >= totalSingles) ||
      (totalPairs > 0 && usedPairs >= totalPairs)
    );
  };

  const activeMatches = matches.filter((match) => {
    if (!match.date) return false;

    const today = new Date().toISOString().split("T")[0];
    return match.date >= today;
  });

  const fullTournaments = tournaments.filter(isTournamentFull);

  const playersLookingForPartner = registrations.filter(
    (registration) => registration.needsPartner,
  );

  const playersInMyTournaments = registrations.length;

  const recentTournaments = [...tournaments]
    .sort((a, b) => {
      const dateA =
        typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : 0;
      const dateB =
        typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : 0;

      return dateB - dateA;
    })
    .slice(0, 3);

  const recentMatches = [...matches]
    .sort((a, b) => {
      const dateA = new Date(`${a.date || ""} ${a.time || ""}`).getTime();
      const dateB = new Date(`${b.date || ""} ${b.time || ""}`).getTime();

      return dateB - dateA;
    })
    .slice(0, 3);

  if (loading) {
    return (
      <div className="admin-home">
        <div className="admin-home__grid">
          <section className="admin-home__main">
            <p className="admin-home__loading">Loading dashboard...</p>
          </section>

          <AdBanners />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-home">
      <div className="admin-home__grid">
        <section className="admin-home__main">
          <div className="admin-home__section-header">
            <div className="admin-home__section-title-wrap">
              <span className="admin-home__icon-gradient-wrap">
                <span>📊</span>
              </span>

              <h2 className="admin-home__section-title">Admin Dashboard</h2>
            </div>
          </div>

          {error && <p className="admin-home__loading">{error}</p>}

          <div className="admin-home__metrics-grid">
            <article className="admin-home__metric-card">
              <span className="admin-home__metric-label">Total courts</span>
              <strong className="admin-home__metric-value">
                {courts.length}
              </strong>
            </article>

            <article className="admin-home__metric-card">
              <span className="admin-home__metric-label">
                Total tournaments
              </span>
              <strong className="admin-home__metric-value">
                {tournaments.length}
              </strong>
            </article>

            <article className="admin-home__metric-card">
              <span className="admin-home__metric-label">Active matches</span>
              <strong className="admin-home__metric-value">
                {activeMatches.length}
              </strong>
            </article>

            <article className="admin-home__metric-card">
              <span className="admin-home__metric-label">
                Players in My Tournaments
              </span>
              <strong className="admin-home__metric-value">
                {playersInMyTournaments}
              </strong>
            </article>

            <article className="admin-home__metric-card">
              <span className="admin-home__metric-label">Full tournaments</span>
              <strong className="admin-home__metric-value">
                {fullTournaments.length}
              </strong>
            </article>

            <article className="admin-home__metric-card">
              <span className="admin-home__metric-label">
                Looking for partner
              </span>
              <strong className="admin-home__metric-value">
                {playersLookingForPartner.length}
              </strong>
            </article>
          </div>

          <div className="admin-home__section-header">
            <div className="admin-home__section-title-wrap">
              <span className="admin-home__icon-gradient-wrap">
                <span>🎾</span>
              </span>

              <h2 className="admin-home__section-title">Latest Tournaments</h2>
            </div>

            <button
              type="button"
              className="admin-home__more-btn"
              onClick={() => navigate("/admin/tournaments")}
            >
              See more...
            </button>
          </div>

          {recentTournaments.length === 0 ? (
            <div className="admin-home__empty-state">
              <p className="admin-home__loading">
                You have not created tournaments yet.
              </p>

              <button
                type="button"
                className="admin-home__primary-btn"
                onClick={() => navigate("/admin/tournaments")}
              >
                Create first tournament
              </button>
            </div>
          ) : (
            <div className="admin-home__tournament-cards">
              {recentTournaments.map((tournament) => (
                <article
                  key={tournament.id}
                  className="admin-home__tournament-card"
                >
                  <div className="admin-home__level-badge">
                    {getTournamentBadge(tournament)}
                  </div>

                  <h3 className="admin-home__card-name">{tournament.name}</h3>

                  <p className="admin-home__card-info">{tournament.info}</p>

                  <button
                    type="button"
                    className="admin-home__view-btn"
                    onClick={() =>
                      navigate(`/admin/tournaments/view/${tournament.id}`)
                    }
                  >
                    View
                  </button>
                </article>
              ))}
            </div>
          )}

          <div className="admin-home__section-header">
            <div className="admin-home__section-title-wrap">
              <span className="admin-home__icon-gradient-wrap">
                <span>⚡</span>
              </span>

              <h2 className="admin-home__section-title">Latest Matches</h2>
            </div>
          </div>

          {recentMatches.length === 0 ? (
            <div className="admin-home__empty-state">
              <p className="admin-home__loading">
                No matches have been created in your courts yet.
              </p>
            </div>
          ) : (
            <div className="admin-home__recent-list">
              {recentMatches.map((match) => (
                <article key={match.id} className="admin-home__recent-card">
                  <h3 className="admin-home__card-name">
                    {typeof match.court === "string"
                      ? match.court
                      : "Not specified"}
                  </h3>

                  <p className="admin-home__card-info">
                    {match.date || "Not specified"}{" "}
                    {match.time ? `- ${match.time}` : ""}
                  </p>

                  <p className="admin-home__card-info">
                    Host:{" "}
                    {typeof match.hostUsername === "string"
                      ? match.hostUsername
                      : typeof match.hostName === "string"
                        ? match.hostName
                        : "Not specified"}
                  </p>

                  <p className="admin-home__card-info">
                    Players: {match.players?.length || 0}/
                    {match.maxPlayers || "?"}
                  </p>
                </article>
              ))}
            </div>
          )}

          <div className="admin-home__section-header">
            <div className="admin-home__section-title-wrap">
              <span className="admin-home__icon-gradient-wrap admin-home__icon-gradient-wrap--orange">
                <span>🔥</span>
              </span>

              <h2 className="admin-home__section-title">My Courts</h2>
            </div>

            <button
              type="button"
              className="admin-home__more-btn"
              onClick={() => navigate("/admin/courts")}
            >
              See more...
            </button>
          </div>

          {courts.length === 0 ? (
            <div className="admin-home__empty-state">
              <p className="admin-home__loading">
                You have not created courts yet.
              </p>

              <button
                type="button"
                className="admin-home__primary-btn"
                onClick={() => navigate("/admin/courts")}
              >
                Create first court
              </button>
            </div>
          ) : (
            <div className="admin-home__courts-grid">
              {courts.slice(0, 4).map((court) => (
                <article key={court.id} className="admin-home__court-card">
                  <img
                    src={typeof court.image === "string" ? court.image : court1}
                    alt={court.name || "Court"}
                    className="admin-home__court-image"
                  />

                  <div className="admin-home__court-overlay">
                    <span className="admin-home__court-name">
                      {court.name || "Unnamed court"}
                    </span>

                    {court.courtType && (
                      <span className="admin-home__court-type">
                        {String(court.courtType)}
                      </span>
                    )}

                    <button
                      type="button"
                      className="admin-home__see-more-btn"
                      onClick={() => navigate(`/admin/courts/view/${court.id}`)}
                    >
                      See more
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default AdminHomePage;