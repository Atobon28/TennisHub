import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import TournamentCard from "../../components/player/TournamentCard";
import { Icon } from "@iconify/react";
import "../../styles/admin-tournaments.css";

interface Tournament {
  id: number;
  level: number;
  name: string;
  info: string;
}

function AdminTournamentsPage() {
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 1,
      level: 5,
      name: "Tournament of champions",
      info: "28/02/26 - 08:00 AM - Court: Ciudad Jardín",
    },
    {
      id: 2,
      level: 2,
      name: "Beginners Tournament",
      info: "07/03/26 - 08:00 AM - Court: Granada",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newHour, setNewHour] = useState("");
  const [newCourt, setNewCourt] = useState("");
  const [newLevel, setNewLevel] = useState("");

  useEffect(() => {
    const handler = () => setShowModal(true);
    window.addEventListener("admin:addTournament", handler);
    return () => window.removeEventListener("admin:addTournament", handler);
  }, []);

  const handleAdd = () => {
    if (!newName) return;
    const newTournament: Tournament = {
      id: Date.now(),
      level: parseInt(newLevel) || 1,
      name: newName,
      info: `${newDate} - ${newHour} - Court: ${newCourt}`,
    };
    setTournaments((prev) => [...prev, newTournament]);
    handleClose();
  };

  const handleClose = () => {
    setShowModal(false);
    setNewName("");
    setNewDate("");
    setNewHour("");
    setNewCourt("");
    setNewLevel("");
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

          <div className="admin-tournaments__cards-grid">
            {tournaments.map((t) => (
              <TournamentCard
                key={t.id}
                level={t.level}
                name={t.name}
                info={t.info}
                buttonLabel="Admin"
                onView={() => navigate("/admin/tournaments/view")}
              />
            ))}
          </div>
        </section>

        <AdBanners />
      </div>

      {/* Modal Create Tournament */}
      {showModal && (
        <div className="admin-tournaments__modal-overlay">
          <div className="admin-tournaments__modal">
            <button
              className="admin-tournaments__modal-close"
              onClick={handleClose}
            >
              ✕
            </button>
            <h2 className="admin-tournaments__modal-title">
              Create Tournament
            </h2>
            <div className="admin-tournaments__modal-section">
              <label className="admin-tournaments__modal-label">Name</label>
              <input
                type="text"
                className="admin-tournaments__modal-input"
                placeholder="Tournament name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <label className="admin-tournaments__modal-label">Date:</label>
              <input
                type="text"
                className="admin-tournaments__modal-input"
                placeholder="DD/MM/YY..."
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
              <label className="admin-tournaments__modal-label">Hour:</label>
              <input
                type="text"
                className="admin-tournaments__modal-input"
                placeholder="00:00 AM..."
                value={newHour}
                onChange={(e) => setNewHour(e.target.value)}
              />
              <label className="admin-tournaments__modal-label">Court:</label>
              <input
                type="text"
                className="admin-tournaments__modal-input"
                placeholder="Court name..."
                value={newCourt}
                onChange={(e) => setNewCourt(e.target.value)}
              />
              <label className="admin-tournaments__modal-label">
                Minimum Level:
              </label>
              <input
                type="number"
                min="1"
                max="5"
                className="admin-tournaments__modal-input"
                placeholder="Level..."
                value={newLevel}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 1 && val <= 5) setNewLevel(e.target.value);
                  if (e.target.value === "") setNewLevel("");
                }}
              />
            </div>
            <button
              className="admin-tournaments__modal-confirm"
              onClick={handleAdd}
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTournamentsPage;
