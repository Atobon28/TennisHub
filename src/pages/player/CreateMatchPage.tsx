import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { useAuth } from "../../context/useAuth";
import { useCourts, useMatches } from "../../context";
import "../../styles/create-match.css";
import { useToast } from "../../context/ToastContext";

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

type MatchType = "singles" | "doubles";

function CreateMatchPage() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { showToast } = useToast();

  const { courts, loadCourts } = useCourts();
  const {
    addNewMatch,
    loading: matchLoading,
    error: matchError,
  } = useMatches();

  const [court, setCourt] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Esta variable guarda si el partido es sencillo o dobles
  const [matchType, setMatchType] = useState<MatchType>("singles");

  const [created, setCreated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourts();
  }, [loadCourts]);

  const handleCreate = async () => {
    if (!court || !date || !time) {
      setError("Please fill in all fields.");
      return;
    }

    if (!userData?.uid || !userData?.username) {
      setError("User not found.");
      return;
    }

    setError("");

    try {
      // Si el partido es sencillo, máximo son 2 jugadores.
      // Si es dobles, máximo son 4 jugadores.
      const maxPlayers = matchType === "singles" ? 2 : 4;

      await addNewMatch({
        court,
        date,
        time,
        matchType,
        hostId: userData.uid,
        hostUsername: userData.username,
        players: [{ uid: userData.uid, username: userData.username }],
        playerIds: [userData.uid],
        maxPlayers,
        createdAt: new Date().toISOString(),
      });

      setCreated(true);
      setCourt("");
      setDate("");
      setTime("");
      setMatchType("singles");
      showToast("Match created successfully.", "success");

      setTimeout(() => {
        setCreated(false);
        navigate("/player/matches");
      }, 2000);
    } catch (err) {
      console.error("Error creating match:", err);
      setError("Error creating match. Please try again.");
      showToast("Error creating match. Please try again.", "error");
    }
  };

  return (
    <div className="create-match">
      <div className="create-match__grid">
        <section className="create-match__main">
          <div className="create-match__card">
            <h2 className="create-match__title">Create a new match</h2>

            <div className="create-match__section">
              <h3 className="create-match__section-title">Place</h3>

              <label className="create-match__label">Court:</label>

              <div className="create-match__select-wrap">
                <select
                  className="create-match__select"
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                >
                  <option value="">Select the court</option>

                  {courts.map((c) => (
                    <option key={c.id} value={c.name || ""}>
                      {c.name || "Unnamed court"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="create-match__section">
              <h3 className="create-match__section-title">Match Type</h3>

              <label className="create-match__label">Type:</label>

              <div className="create-match__select-wrap">
                <select
                  className="create-match__select"
                  value={matchType}
                  onChange={(e) => setMatchType(e.target.value as MatchType)}
                >
                  <option value="singles">Singles - 2 players</option>
                  <option value="doubles">Doubles - 4 players</option>
                </select>
              </div>
            </div>

            <div className="create-match__section">
              <h3 className="create-match__section-title">Date and Hour</h3>

              <div className="create-match__date-row">
                <div className="create-match__field">
                  <label className="create-match__label">Date:</label>

                  <div className="create-match__select-wrap">
                    <input
                      type="date"
                      className="create-match__select create-match__date-input"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="create-match__field">
                  <label className="create-match__label">Time:</label>

                  <div className="create-match__select-wrap">
                    <select
                      className="create-match__select"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    >
                      <option value="">00:00</option>

                      {timeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  className="create-match__btn"
                  onClick={handleCreate}
                  disabled={matchLoading}
                >
                  {matchLoading ? "Creating..." : "Create Match"}
                </button>
              </div>

              {created && (
                <p className="create-match__success">
                  ✓ Match created! Redirecting...
                </p>
              )}

              {(error || matchError) && (
                <p className="create-match__error">{error || matchError}</p>
              )}
            </div>
          </div>
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default CreateMatchPage;
