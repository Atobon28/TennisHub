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

const categoryOptions = [
  "Open",
  "First Category",
  "Second Category",
  "Third Category",
  "Fourth Category",
  "Fifth Category",
  "Beginner",
  "Junior",
  "Senior",
];

interface Tournament {
  id: string;
  name: string;
  info: string;
  date: string;
  hour: string;
  court: string;
  categories?: string[];
  level?: number;
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
  const [newCategories, setNewCategories] = useState<string[]>([]);

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

  const handleCategoryChange = (category: string) => {
    if (newCategories.includes(category)) {
      setNewCategories(newCategories.filter((item) => item !== category));
    } else {
      setNewCategories([...newCategories, category]);
    }
  };

  const handleAdd = async () => {
    if (!userData?.uid) return;

    if (!newName || !newDate || !newHour || !newCourt || newCategories.length === 0) {
      setError("Please fill in all fields and select at least one category.");
      return;
    }

    setError("");
    setCreating(true);

    const categoriesText = newCategories.join(", ");
    const info = `${newDate} - ${newHour} - Court: ${newCourt} - Categories: ${categoriesText}`;

    const newTournament = {
      name: newName,
      info,
      date: newDate,
      hour: newHour,
      court: newCourt,
      categories: newCategories,
      createdAt: new Date().toISOString(),
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
    setNewCategories([]);
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
                  level={tournament.level || 0}
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
              </div>

              <div className="create-match__section">
                <h3 className="create-match__section-title">
                  Allowed Categories
                </h3>

                <label className="create-match__label">
                  Select one or more categories:
                </label>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "0.75rem",
                    marginTop: "0.75rem",
                  }}
                >
                  {categoryOptions.map((category) => (
                    <label
                      key={category}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        backgroundColor: "#f6f6f6",
                        padding: "0.75rem",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={newCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                      {category}
                    </label>
                  ))}
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