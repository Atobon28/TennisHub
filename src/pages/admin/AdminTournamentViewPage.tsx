import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import {
  getTournaments,
  getTournamentRegistrations,
  updateTournament,
} from "../../firebase/services";
import "../../styles/admin-tournament-view.css";
import court1 from "../../assets/court-1.jpg";

interface CapacityByCategory {
  [category: string]: {
    singlesPlayers?: number;
    doublesPairs?: number;
  };
}

interface Tournament {
  id: string;
  name: string;
  info: string;
  date?: string;
  hour?: string;
  categories?: string[];
  courts?: string[];
  image?: string;
  tournamentType?: string;
  capacityByCategory?: CapacityByCategory;
  status?: "Open" | "Full" | "Closed";
}

interface TournamentRegistration {
  id: string;
  playerUsername?: string;
  playerCategory?: string;
  entryType?: "singles" | "doubles";
  hasPartner?: boolean;
  partnerName?: string;
  needsPartner?: boolean;
  joinedAt?: string;
}

function AdminTournamentViewPage() {
  const { id } = useParams();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempDate, setTempDate] = useState("");
  const [tempHour, setTempHour] = useState("");
  const [tempStatus, setTempStatus] = useState<"Open" | "Full" | "Closed">(
    "Open",
  );

  useEffect(() => {
    const fetchTournamentData = async () => {
      if (!id) return;

      setLoading(true);
      setError("");

      try {
        const tournamentsData = (await getTournaments()) as Tournament[];
        const selectedTournament = tournamentsData.find(
          (item) => item.id === id,
        );

        if (!selectedTournament) {
          setError("Tournament not found.");
          return;
        }

        const registrationsData = (await getTournamentRegistrations(
          id,
        )) as TournamentRegistration[];

        setTournament(selectedTournament);
        setRegistrations(registrationsData);
      } catch (err) {
        console.error("Error loading tournament:", err);
        setError("Error loading tournament.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [id]);

  const singlesPlayers = registrations.filter(
    (registration) => registration.entryType === "singles",
  );

  const doublesPairs = registrations.filter(
    (registration) => registration.entryType === "doubles",
  );

  const playersLookingForPartner = registrations.filter(
    (registration) =>
      registration.entryType === "doubles" && registration.needsPartner,
  );

  const totalSinglesSpots = tournament?.capacityByCategory
    ? Object.values(tournament.capacityByCategory).reduce(
        (total, category) => total + (category.singlesPlayers || 0),
        0,
      )
    : 0;

  const totalDoublesPairs = tournament?.capacityByCategory
    ? Object.values(tournament.capacityByCategory).reduce(
        (total, category) => total + (category.doublesPairs || 0),
        0,
      )
    : 0;

  const usedSinglesSpots = singlesPlayers.length;
  const usedDoublesPairs = doublesPairs.length;

  const availableSinglesSpots = Math.max(
    totalSinglesSpots - usedSinglesSpots,
    0,
  );

  const availableDoublesPairs = Math.max(
    totalDoublesPairs - usedDoublesPairs,
    0,
  );

  const tournamentStatus =
    tournament?.status === "Closed"
      ? "Closed"
      : availableSinglesSpots <= 0 && availableDoublesPairs <= 0
        ? "Full"
        : "Open";

  const formatDate = (date?: string) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleOpen = () => {
    if (!tournament) return;

    setTempName(tournament.name || "");
    setTempDate(tournament.date || "");
    setTempHour(tournament.hour || "");
    setTempStatus(tournament.status || tournamentStatus);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!tournament) return;

    try {
      await updateTournament(tournament.id, {
        name: tempName,
        date: tempDate,
        hour: tempHour,
        status: tempStatus,
      });

      setTournament({
        ...tournament,
        name: tempName,
        date: tempDate,
        hour: tempHour,
        status: tempStatus,
      });

      setShowModal(false);
    } catch (err) {
      console.error("Error updating tournament:", err);
      setError("Error updating tournament.");
    }
  };

  if (loading) {
    return (
      <div className="admin-tournament-view">
        <div className="admin-tournament-view__grid">
          <section className="admin-tournament-view__main">
            <p>Loading tournament...</p>
          </section>

          <AdBanners />
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="admin-tournament-view">
        <div className="admin-tournament-view__grid">
          <section className="admin-tournament-view__main">
            <div className="admin-tournament-view__card">
              <h2 className="admin-tournament-view__title">
                Tournament not found
              </h2>
              {error && <p>{error}</p>}
            </div>
          </section>

          <AdBanners />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-tournament-view">
      <div className="admin-tournament-view__grid">
        <section className="admin-tournament-view__main">
          <div className="admin-tournament-view__card">
            <h2 className="admin-tournament-view__title">{tournament.name}</h2>

            <div className="admin-tournament-view__body">
              <img
                src={tournament.image || court1}
                alt={tournament.name}
                className="admin-tournament-view__image"
              />

              <div className="admin-tournament-view__info">
                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Info: </span>
                  {tournament.info}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Date: </span>
                  {tournament.date || "Not specified"}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Hour: </span>
                  {tournament.hour || "Not specified"}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Courts: </span>
                  {tournament.courts?.length
                    ? tournament.courts.join(", ")
                    : "Not specified"}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">
                    Categories:{" "}
                  </span>
                  {tournament.categories?.length
                    ? tournament.categories.join(", ")
                    : "Not specified"}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Status: </span>
                  {tournamentStatus}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">
                    Players:{" "}
                  </span>
                  {usedSinglesSpots}/{totalSinglesSpots}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Pairs: </span>
                  {usedDoublesPairs}/{totalDoublesPairs}
                </p>
              </div>
            </div>

            <button
              className="admin-tournament-view__edit-btn"
              onClick={handleOpen}
            >
              Edit
            </button>
          </div>

          <div
            className="admin-tournament-view__card"
            style={{ marginTop: "1.5rem" }}
          >
            <h2 className="admin-tournament-view__title">Registered Players</h2>

            <p className="admin-tournament-view__detail">
              <span className="admin-tournament-view__label">
                Singles Players:{" "}
              </span>
              {usedSinglesSpots}/{totalSinglesSpots}
            </p>

            <p className="admin-tournament-view__detail">
              <span className="admin-tournament-view__label">
                Doubles Pairs:{" "}
              </span>
              {usedDoublesPairs}/{totalDoublesPairs}
            </p>

            <p className="admin-tournament-view__detail">
              <span className="admin-tournament-view__label">
                Players looking for partner:{" "}
              </span>
              {playersLookingForPartner.length}
            </p>

            <h3 style={{ marginTop: "1.5rem" }}>Singles</h3>

            {singlesPlayers.length === 0 ? (
              <p>No singles players registered yet.</p>
            ) : (
              singlesPlayers.map((player) => (
                <div
                  key={player.id}
                  style={{
                    padding: "0.85rem",
                    borderRadius: "12px",
                    background: "#f6f6f6",
                    marginTop: "0.75rem",
                  }}
                >
                  <p>
                    <strong>{player.playerUsername || "Unknown player"}</strong>
                  </p>
                  <p>Category: {player.playerCategory || "Not specified"}</p>
                  <p>Joined: {formatDate(player.joinedAt)}</p>
                </div>
              ))
            )}

            <h3 style={{ marginTop: "1.5rem" }}>Doubles Pairs</h3>

            {doublesPairs.length === 0 ? (
              <p>No doubles pairs registered yet.</p>
            ) : (
              doublesPairs.map((pair) => (
                <div
                  key={pair.id}
                  style={{
                    padding: "0.85rem",
                    borderRadius: "12px",
                    background: "#f6f6f6",
                    marginTop: "0.75rem",
                  }}
                >
                  <p>
                    <strong>{pair.playerUsername || "Unknown player"}</strong>
                    {pair.hasPartner && pair.partnerName
                      ? ` + ${pair.partnerName}`
                      : ""}
                  </p>
                  <p>Category: {pair.playerCategory || "Not specified"}</p>
                  <p>
                    Partner status:{" "}
                    {pair.needsPartner
                      ? "Needs partner"
                      : pair.hasPartner
                        ? "Has partner"
                        : "Not specified"}
                  </p>
                  <p>Joined: {formatDate(pair.joinedAt)}</p>
                </div>
              ))
            )}

            <h3 style={{ marginTop: "1.5rem" }}>Players Who Need a Partner</h3>

            {playersLookingForPartner.length === 0 ? (
              <p>No players are looking for a partner.</p>
            ) : (
              playersLookingForPartner.map((player) => (
                <div
                  key={player.id}
                  style={{
                    padding: "0.85rem",
                    borderRadius: "12px",
                    background: "#fff4df",
                    marginTop: "0.75rem",
                  }}
                >
                  <p>
                    <strong>{player.playerUsername || "Unknown player"}</strong>
                  </p>
                  <p>Category: {player.playerCategory || "Not specified"}</p>
                  <p>Joined: {formatDate(player.joinedAt)}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <AdBanners />
      </div>

      {showModal && (
        <div className="admin-tournament-view__modal-overlay">
          <div className="admin-tournament-view__modal">
            <button
              className="admin-tournament-view__modal-close"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h2 className="admin-tournament-view__modal-title">
              Edit Tournament
            </h2>

            <div className="admin-tournament-view__modal-section">
              <label className="admin-tournament-view__modal-label">
                Name:
              </label>
              <input
                type="text"
                className="admin-tournament-view__modal-input"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
              />

              <label className="admin-tournament-view__modal-label">
                Date:
              </label>
              <input
                type="date"
                className="admin-tournament-view__modal-input"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
              />

              <label className="admin-tournament-view__modal-label">
                Hour:
              </label>
              <input
                type="text"
                className="admin-tournament-view__modal-input"
                value={tempHour}
                onChange={(e) => setTempHour(e.target.value)}
              />

              <label className="admin-tournament-view__modal-label">
                Status:
              </label>
              <select
                className="admin-tournament-view__modal-input"
                value={tempStatus}
                onChange={(e) =>
                  setTempStatus(e.target.value as "Open" | "Full" | "Closed")
                }
              >
                <option value="Open">Open</option>
                <option value="Full">Full</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <button
              className="admin-tournament-view__modal-confirm"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTournamentViewPage;
