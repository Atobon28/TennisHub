import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { getAdminTournaments, getAdminCourts } from "../../firebase/services";
import { useAuth } from "../../context/useAuth";
import "../../styles/admin-home.css";
import court1 from "../../assets/court-1.jpg";

interface Tournament {
  id: string;
  level?: number;
  name: string;
  info: string;
  tournamentType?: string;
}

interface Court {
  id: string;
  name: string;
  image: string;
  courtType?: string;
}

function AdminHomePage() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [loadingCourts, setLoadingCourts] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!userData?.uid) return;

      try {
        const tournamentsData = await getAdminTournaments(userData.uid);
        setTournaments(tournamentsData as Tournament[]);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoadingTournaments(false);
      }

      try {
        const courtsData = await getAdminCourts(userData.uid);
        setCourts(courtsData as Court[]);
      } catch (error) {
        console.error("Error fetching courts:", error);
      } finally {
        setLoadingCourts(false);
      }
    };

    fetchAdminData();
  }, [userData]);

  const getTournamentBadge = (tournament: Tournament) => {
    if (tournament.tournamentType === "doubles") return "D";
    if (tournament.tournamentType === "both") return "S/D";

    return tournament.level || "S";
  };

  return (
    <div className="admin-home">
      <div className="admin-home__grid">
        <section className="admin-home__main">
          <div className="admin-home__section-header">
            <div className="admin-home__section-title-wrap">
              <span className="admin-home__icon-gradient-wrap">
                <span>🎾</span>
              </span>

              <h2 className="admin-home__section-title">
                My Upcoming Tournaments
              </h2>
            </div>

            <button
              type="button"
              className="admin-home__more-btn"
              onClick={() => navigate("/admin/tournaments")}
            >
              See more...
            </button>
          </div>

          {loadingTournaments ? (
            <p className="admin-home__loading">Loading tournaments...</p>
          ) : tournaments.length === 0 ? (
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
              {tournaments.slice(0, 4).map((tournament) => (
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

          {loadingCourts ? (
            <p className="admin-home__loading">Loading courts...</p>
          ) : courts.length === 0 ? (
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
                    src={court.image || court1}
                    alt={court.name}
                    className="admin-home__court-image"
                  />

                  <div className="admin-home__court-overlay">
                    <span className="admin-home__court-name">
                      {court.name}
                    </span>

                    {court.courtType && (
                      <span className="admin-home__court-type">
                        {court.courtType}
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