import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import TournamentCard from "../../components/player/TournamentCard";
import { Icon } from "@iconify/react";
import { getAdminTournaments, addTournament } from "../../firebase/services";
import { useAuth } from "../../context/AuthContext";
import "../../styles/admin-tournaments.css";
import "../../styles/create-match.css";

const timeOptions = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

interface Tournament {
  id: string;
  level: number;
  name: string;
  info: string;
  date: string;
  hour: string;
  court: string;
}

function AdminTournamentsPage() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newHour, setNewHour] = useState("");
  const [newCourt, setNewCourt] = useState("");
  const [newLevel, setNewLevel] = useState("");

  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, [userData]);

  useEffect(() => {
    const handler = () => setShowModal(true);

    window.addEventListener("admin:addTournament", handler);

    return () => window.removeEventListener("admin:addTournament", handler);
  }, []);

  const fetchTournaments = async () => {
    if (!userData?.uid) return;

    setLoading(true);

    try {
      const data = await getAdminTournaments(userData.uid);
      setTournaments(data as Tournament[]);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!userData?.uid) return;

    if (!newName || !newDate || !newHour || !newCourt || !newLevel) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setCreating(true);

    const info = `${newDate} - ${newHour} - Court: ${newCourt}`;

    const newTournament = {
      level: parseInt(newLevel),
      name: newName,
      info,
      date: newDate,
      hour: newHour,
      court: newCourt,
    };

    try {
      await addTournament(userData.uid, newTournament);

      await fetchTournaments();
      handleClose();
    } catch (error) {
      console.error("Error adding tournament:", error);
      setError("Error creating tournament. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setNewName("");
    setNewDate("");
    setNewHour("");
    setNewCourt("");
    setNewLevel("");
    setError("");
  };

  return (
    <div className="admin-tournaments">
      <div className="admin-tournaments__grid">
        <section className="admin-tournaments__main">
          <div className="admin-tournaments__section-title-wrap">
            <span className="admin-tournaments__icon-gradient-wrap">
              <Icon
                icon="game-icons:tennis-racket"
                className="admin-tournaments__section-icon"
              />
            </span>

            <h2 className="admin-tournaments__section-title">
              My Upcoming Tournaments
            </h2>
          </div>

          {loading ? (
            <p className="admin-tournaments__loading">Loading tournaments...</p>
          ) : tournaments.length === 0 ? (
            <p className="admin-tournaments__loading">
              You have not created tournaments yet.
            </p>
          ) : (
            <div className="admin-tournaments__cards-grid">
              {tournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  level={tournament.level}
                  name={tournament.name}
                  info={tournament.info}
                  buttonLabel="View"
                  onView={() =>
                    navigate(`/admin/tournaments/view/${tournament.id}`)
                  }
                />
              ))}
            </div>
          )}
        </section>

        <AdBanners />
      </div>

      {showModal && (
        <div className="admin-tournaments__modal-overlay">
          <div className="admin-tournaments__modal">
            <button
              className="admin-tournaments__modal-close"
              onClick={handleClose}
            >
              ✕
            </button>

            <div className="create-match__card">
              <h2 className="create-match__title">Create a new tournament</h2>

              <div className="create-match__section">
                <h3 className="create-match__section-title">
                  Tournament Info
                </h3>

                <label className="create-match__label">Name:</label>
                <div className="create-match__select-wrap">
                  <input
                    type="text"
                    className="create-match__select"
                    placeholder="Tournament name..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>

                <label className="create-match__label">Minimum Level:</label>
                <div className="create-match__select-wrap">
                  <select
                    className="create-match__select"
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                  >
                    <option value="">Select level</option>
                    <option value="1">Level 1</option>
                    <option value="2">Level 2</option>
                    <option value="3">Level 3</option>
                    <option value="4">Level 4</option>
                    <option value="5">Level 5</option>
                  </select>
                </div>
              </div>

              <div className="create-match__section">
                <h3 className="create-match__section-title">Date and Hour</h3>

                <label className="create-match__label">Date:</label>
                <div className="create-match__select-wrap">
                  <input
                    type="date"
                    className="create-match__select create-match__date-input"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>

                <label className="create-match__label">Hour:</label>
                <div className="create-match__select-wrap">
                  <select
                    className="create-match__select"
                    value={newHour}
                    onChange={(e) => setNewHour(e.target.value)}
                  >
                    <option value="">00:00</option>

                    {timeOptions.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="create-match__section">
                <h3 className="create-match__section-title">Place</h3>

                <label className="create-match__label">Court:</label>
                <div className="create-match__select-wrap">
                  <input
                    type="text"
                    className="create-match__select"
                    placeholder="Court name..."
                    value={newCourt}
                    onChange={(e) => setNewCourt(e.target.value)}
                  />
                </div>
              </div>

              {error && <p className="create-match__error">{error}</p>}

              <button
                className="create-match__btn"
                onClick={handleAdd}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Tournament"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTournamentsPage;