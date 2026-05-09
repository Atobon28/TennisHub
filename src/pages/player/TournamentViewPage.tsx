import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import {
  getPlayerTournamentById,
  getTournaments,
  joinTournament,
  leaveTournament,
} from "../../firebase/services";
import { useAuth } from "../../context/useAuth";
import "../../styles/tournament-view.css";
import court1 from "../../assets/court-1.jpg";

interface Tournament {
  id: string;
  name: string;
  info: string;
  categories?: string[];
  courts?: string[];
  image?: string;
  tournamentType?: string;
}

interface PlayerTournament {
  id: string;
}

const getPlayerCategory = (
  level?: number | null,
  category?: string | null
) => {
  if (category) return category;

  if (level === 1) return "First Category";
  if (level === 2) return "Second Category";
  if (level === 3) return "Third Category";
  if (level === 4) return "Fourth Category";
  if (level === 5) return "Fifth Category";

  return "Beginner";
};

const normalizeTournamentType = (type?: string) => {
  const value = type?.toLowerCase().trim();

  if (value === "doubles" || value === "double") return "doubles";

  if (
    value === "both" ||
    value === "singles and doubles" ||
    value === "single and double" ||
    value === "singles/doubles" ||
    value === "singles & doubles"
  ) {
    return "both";
  }

  return "singles";
};

const getTournamentTypeLabel = (type?: string) => {
  const normalizedType = normalizeTournamentType(type);

  if (normalizedType === "doubles") return "Doubles";
  if (normalizedType === "both") return "Singles and Doubles";

  return "Singles";
};

function TournamentViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [joined, setJoined] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  const [entryType, setEntryType] = useState<"singles" | "doubles">("singles");
  const [hasPartner, setHasPartner] = useState("");
  const [partnerName, setPartnerName] = useState("");

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState("");

  const playerCategory = getPlayerCategory(userData?.level, userData?.category);

  const tournamentType = normalizeTournamentType(tournament?.tournamentType);

  const canApply =
    !tournament?.categories?.length ||
    tournament.categories.includes(playerCategory);

  const shouldAskEntryType = tournamentType === "both";

  const shouldAskPartner =
    tournamentType === "doubles" ||
    (tournamentType === "both" && entryType === "doubles");

  useEffect(() => {
    const fetchTournament = async () => {
      if (!id) return;

      setLoading(true);
      setError("");

      try {
        const tournamentsData = (await getTournaments()) as Tournament[];

        const selectedTournament = tournamentsData.find(
          (item) => item.id === id
        );

        if (!selectedTournament) {
          setError("Tournament not found.");
          return;
        }

        setTournament(selectedTournament);

        const selectedType = normalizeTournamentType(
          selectedTournament.tournamentType
        );

        if (selectedType === "doubles") {
          setEntryType("doubles");
        } else {
          setEntryType("singles");
        }

        if (userData?.uid) {
          const existingTournament = (await getPlayerTournamentById(
            userData.uid,
            id
          )) as PlayerTournament | null;

          if (existingTournament) {
            setJoined(true);
            setRegistrationId(existingTournament.id);
          } else {
            setJoined(false);
            setRegistrationId(null);
          }
        }
      } catch (err) {
        console.error("Error loading tournament:", err);
        setError("Error loading tournament.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id, userData?.uid]);

  const handleJoin = async () => {
    if (!tournament || !userData?.uid || !userData?.username) return;

    if (!canApply) {
      setError("You are not eligible for this tournament.");
      return;
    }

    if (shouldAskPartner && !hasPartner) {
      setError("Please select if you have a partner or not.");
      return;
    }

    if (shouldAskPartner && hasPartner === "yes" && !partnerName.trim()) {
      setError("Please enter your partner name.");
      return;
    }

    setJoining(true);
    setError("");

    try {
      await joinTournament(
        userData.uid,
        userData.username,
        {
          ...tournament,
          tournamentType,
        },
        {
          entryType,
          hasPartner: shouldAskPartner && hasPartner === "yes",
          partnerName:
            shouldAskPartner && hasPartner === "yes"
              ? partnerName.trim()
              : "",
          needsPartner: shouldAskPartner && hasPartner === "no",
        }
      );

      const existingTournament = (await getPlayerTournamentById(
        userData.uid,
        tournament.id
      )) as PlayerTournament | null;

      setJoined(true);
      setRegistrationId(existingTournament?.id || null);
    } catch (err) {
      console.error("Error joining tournament:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error joining tournament.");
      }
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!registrationId) return;

    const confirmLeave = window.confirm(
      "Are you sure you want to leave this tournament?"
    );

    if (!confirmLeave) return;

    setLeaving(true);
    setError("");

    try {
      await leaveTournament(registrationId);

      setJoined(false);
      setRegistrationId(null);
      setHasPartner("");
      setPartnerName("");
      setEntryType(tournamentType === "doubles" ? "doubles" : "singles");
    } catch (err) {
      console.error("Error leaving tournament:", err);
      setError("Error leaving tournament.");
    } finally {
      setLeaving(false);
    }
  };

  if (loading) {
    return (
      <div className="tournament-view">
        <div className="tournament-view__grid">
          <section className="tournament-view__main">
            <p>Loading tournament...</p>
          </section>

          <AdBanners />
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="tournament-view">
        <div className="tournament-view__grid">
          <section className="tournament-view__main">
            <div className="tournament-view__card">
              <h2 className="tournament-view__title">Tournament not found</h2>

              <button
                type="button"
                className="tournament-view__join-btn"
                onClick={() => navigate("/player/tournaments")}
              >
                Back to tournaments
              </button>
            </div>
          </section>

          <AdBanners />
        </div>
      </div>
    );
  }

  return (
    <div className="tournament-view">
      <div className="tournament-view__grid">
        <section className="tournament-view__main">
          <div className="tournament-view__card">
            <h2 className="tournament-view__title">{tournament.name}</h2>

            <div className="tournament-view__body">
              <img
                src={tournament.image || court1}
                alt={tournament.name}
                className="tournament-view__image"
              />

              <div className="tournament-view__info">
                <p className="tournament-view__detail">
                  <span className="tournament-view__label">Info: </span>
                  {tournament.info}
                </p>

                <p className="tournament-view__detail">
                  <span className="tournament-view__label">Type: </span>
                  {getTournamentTypeLabel(tournament.tournamentType)}
                </p>

                <p className="tournament-view__detail">
                  <span className="tournament-view__label">
                    Your category:{" "}
                  </span>
                  {playerCategory}
                </p>

                <p className="tournament-view__detail">
                  <span className="tournament-view__label">
                    Allowed categories:{" "}
                  </span>
                  {tournament.categories?.length
                    ? tournament.categories.join(", ")
                    : "Not specified"}
                </p>

                <p className="tournament-view__detail">
                  <span className="tournament-view__label">Courts: </span>
                  {tournament.courts?.length
                    ? tournament.courts.join(", ")
                    : "Not specified"}
                </p>
              </div>
            </div>

            {!joined && canApply && (
              <div
                style={{
                  marginTop: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {shouldAskEntryType && (
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontWeight: 800,
                        marginBottom: "0.5rem",
                      }}
                    >
                      Select modality
                    </label>

                    <select
                      value={entryType}
                      onChange={(e) => {
                        setEntryType(e.target.value as "singles" | "doubles");
                        setHasPartner("");
                        setPartnerName("");
                      }}
                      style={{
                        width: "100%",
                        padding: "0.8rem",
                        borderRadius: "12px",
                        border: "1px solid #ddd",
                        fontFamily: "inherit",
                        fontWeight: 700,
                      }}
                    >
                      <option value="singles">Singles</option>
                      <option value="doubles">Doubles</option>
                    </select>
                  </div>
                )}

                {shouldAskPartner && (
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontWeight: 800,
                        marginBottom: "0.5rem",
                      }}
                    >
                      Do you have a doubles partner?
                    </label>

                    <select
                      value={hasPartner}
                      onChange={(e) => {
                        setHasPartner(e.target.value);
                        setPartnerName("");
                      }}
                      style={{
                        width: "100%",
                        padding: "0.8rem",
                        borderRadius: "12px",
                        border: "1px solid #ddd",
                        fontFamily: "inherit",
                        fontWeight: 700,
                      }}
                    >
                      <option value="">Select an option</option>
                      <option value="yes">Yes, I have a partner</option>
                      <option value="no">No, assign me a partner</option>
                    </select>
                  </div>
                )}

                {shouldAskPartner && hasPartner === "yes" && (
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontWeight: 800,
                        marginBottom: "0.5rem",
                      }}
                    >
                      Partner name
                    </label>

                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="Enter your partner name..."
                      style={{
                        width: "100%",
                        padding: "0.8rem",
                        borderRadius: "12px",
                        border: "1px solid #ddd",
                        fontFamily: "inherit",
                        fontWeight: 700,
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {error && (
              <p
                style={{
                  color: "#e05252",
                  fontWeight: 800,
                  marginTop: "1rem",
                }}
              >
                {error}
              </p>
            )}

            {joined ? (
              <div style={{ marginTop: "1rem" }}>
                <p className="tournament-view__joined-msg">
                  ✓ You have joined this tournament!
                </p>

                <button
                  type="button"
                  className="tournament-view__join-btn"
                  onClick={handleLeave}
                  disabled={leaving}
                  style={{
                    background: "#e05252",
                    marginTop: "0.75rem",
                  }}
                >
                  {leaving ? "Leaving..." : "Leave tournament"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="tournament-view__join-btn"
                onClick={handleJoin}
                disabled={joining || !canApply}
                style={{
                  opacity: !canApply ? 0.5 : 1,
                  cursor: !canApply ? "not-allowed" : "pointer",
                  marginTop: "1.5rem",
                }}
              >
                {joining
                  ? "Joining..."
                  : canApply
                    ? `Join as ${entryType === "doubles" ? "Doubles" : "Singles"}`
                    : "Not eligible"}
              </button>
            )}
          </div>
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default TournamentViewPage;