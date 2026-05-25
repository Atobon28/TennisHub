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
  const [matchType, setMatchType] = useState<MatchType>("singles");

  const [created, setCreated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourts();
  }, [loadCourts]);

  const handleCreate = async () => {
    if (!court || !date || !time) {
      setError("Please fill in all fields before creating a match.");
      return;
    }

    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (selectedDateTime < now) {
      setError("Please select a future date and time for the match.");
      return;
    }

    if (!userData?.uid || !userData?.username) {
      setError("User not found. Please log in again.");
      return;
    }

    setError("");

    try {
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

              <label className="create-match__label" htmlFor="match-court">
                Court:
              </label>

              <div className="create-match__select-wrap">
                <select
                  id="match-court"
                  className="create-match__select"
                  value={court}
                  required
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

              <label className="create-match__label" htmlFor="match-type">
                Type:
              </label>

              <div className="create-match__select-wrap">
                <select
                  id="match-type"
                  className="create-match__select"
                  value={matchType}
                  required
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
                  <label className="create-match__label" htmlFor="match-date">
                    Date:
                  </label>

                  <div className="create-match__select-wrap">
                    <input
                      id="match-date"
                      type="date"
                      className="create-match__select create-match__date-input"
                      value={date}
                      required
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="create-match__field">
                  <label className="create-match__label" htmlFor="match-time">
                    Time:
                  </label>

                  <div className="create-match__select-wrap">
                    <select
                      id="match-time"
                      className="create-match__select"
                      value={time}
                      required
                      onChange={(e) => setTime(e.target.value)}
                    >
                      <option value="">Select time</option>

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
                  aria-label="Create a new tennis match"
                  onClick={handleCreate}
                  disabled={matchLoading}
                >
                  {matchLoading ? "Creating..." : "Create Match"}
                </button>
              </div>

              {created && (
                <p className="create-match__success" role="status">
                  ✓ Match created successfully. Redirecting...
                </p>
              )}

              {(error || matchError) && (
                <p className="create-match__error" role="alert">
                  {error || matchError}
                </p>
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
