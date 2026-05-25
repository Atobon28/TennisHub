import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import AdBanners from "../../components/player/AdBanners";
import { useMatches } from "../../context";
import { useAuth } from "../../context/useAuth";
import "../../styles/find-matches.css";

function MatchViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();

  const {
    selectedMatch,
    loading,
    error,
    loadMatchById,
    joinExistingMatch,
    leaveExistingMatch,
    removeMatch,
  } = useMatches();

  useEffect(() => {
    if (!id) return;

    loadMatchById(id);
  }, [id, loadMatchById]);

  const handleJoin = async () => {
    if (!userData?.uid || !userData?.username || !selectedMatch) return;

    try {
      await joinExistingMatch(
        selectedMatch.id,
        userData.uid,
        userData.username,
      );

      await loadMatchById(selectedMatch.id);
    } catch (error) {
      console.error("Error joining match:", error);
    }
  };

  const handleLeave = async () => {
    if (!userData?.uid || !userData?.username || !selectedMatch) return;

    try {
      if (selectedMatch.hostId === userData.uid) {
        await removeMatch(selectedMatch.id);
        navigate("/player/matches");
        return;
      }

      await leaveExistingMatch(
        selectedMatch.id,
        userData.uid,
        userData.username,
      );

      await loadMatchById(selectedMatch.id);
    } catch (error) {
      console.error("Error leaving match:", error);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not specified";

    const d = new Date(date + "T00:00:00");

    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <p style={{ padding: 20, color: "#555" }} role="status">
        Loading match...
      </p>
    );
  }

  if (error) {
    return (
      <p style={{ padding: 20, color: "#b42318" }} role="alert">
        {error}
      </p>
    );
  }

  if (!selectedMatch) {
    return (
      <p style={{ padding: 20, color: "#555" }} role="alert">
        Match not found.
      </p>
    );
  }

  const playersCount = selectedMatch.players?.length || 0;
  const maxPlayers =
    typeof selectedMatch.maxPlayers === "number" ? selectedMatch.maxPlayers : 0;

  const spotsLeft = Math.max(maxPlayers - playersCount, 0);
  const isFull = playersCount >= maxPlayers;
  const isInMatch = selectedMatch.playerIds?.includes(userData?.uid || "");
  const isHost = selectedMatch.hostId === userData?.uid;

  const matchType =
    selectedMatch.matchType || (maxPlayers === 2 ? "singles" : "doubles");

  const matchTypeLabel = matchType === "singles" ? "Singles" : "Doubles";
  const statusLabel = isFull ? "Full match" : "Open match";

  const courtName =
    typeof selectedMatch.court === "string"
      ? selectedMatch.court
      : "Not specified";

  const hostName =
    typeof selectedMatch.hostUsername === "string"
      ? selectedMatch.hostUsername
      : typeof selectedMatch.hostName === "string"
        ? selectedMatch.hostName
        : "Unknown host";

  return (
    <div className="find-matches">
      <div className="find-matches__grid">
        <section className="find-matches__main">
          <button
            type="button"
            className="find-matches__btn find-matches__btn--leave"
            aria-label="Go back to matches list"
            onClick={() => navigate("/player/matches")}
            style={{ marginBottom: "1rem" }}
          >
            ← Back to matches
          </button>

          <div className="find-matches__section-title-wrap">
            <span className="find-matches__icon-wrap" aria-hidden="true">
              <Icon
                icon="game-icons:tennis-racket"
                className="find-matches__icon"
              />
            </span>

            <h2 className="find-matches__title">Match Details</h2>
          </div>

          <div className="find-matches__card">
            <div className="find-matches__card-header">
              <div className="find-matches__card-info">
                <p className="find-matches__card-court">
                  <Icon icon="mdi:tennis-ball-outline" aria-hidden="true" />{" "}
                  {courtName}
                </p>

                <p className="find-matches__card-date">
                  {formatDate(selectedMatch.date)} —{" "}
                  {selectedMatch.time || "Not specified"}
                </p>

                <p className="find-matches__card-host">
                  Created by: <strong>{hostName}</strong>
                </p>
              </div>

              <div className="find-matches__card-spots">
                {isFull ? (
                  <span className="find-matches__tag find-matches__tag--full">
                    Full
                  </span>
                ) : (
                  <span className="find-matches__tag find-matches__tag--open">
                    {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                  </span>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1rem",
                marginTop: "1.5rem",
              }}
            >
              <div>
                <p className="find-matches__players-label">Match type</p>
                <p style={{ margin: 0, fontWeight: 700 }}>{matchTypeLabel}</p>
              </div>

              <div>
                <p className="find-matches__players-label">Players</p>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  {playersCount}/{maxPlayers}
                </p>
              </div>

              <div>
                <p className="find-matches__players-label">Status</p>
                <p style={{ margin: 0, fontWeight: 700 }}>{statusLabel}</p>
              </div>

              <div>
                <p className="find-matches__players-label">Available spots</p>
                <p style={{ margin: 0, fontWeight: 700 }}>{spotsLeft}</p>
              </div>
            </div>

            <div
              className="find-matches__players"
              style={{ marginTop: "2rem" }}
            >
              <p className="find-matches__players-label">
                Registered players:
              </p>

              <div className="find-matches__players-list">
                {selectedMatch.players?.map((player) => (
                  <button
                    key={player.uid}
                    type="button"
                    className="find-matches__player-chip"
                    aria-label={`Open ${player.username} profile`}
                    onClick={() =>
                      navigate(`/player/players/view/${player.uid}`)
                    }
                  >
                    {player.username}
                    {player.uid === selectedMatch.hostId && " 👑"}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: "2rem",
                padding: "1rem",
                borderRadius: "12px",
                backgroundColor: "#f6f6f6",
              }}
            >
              <p style={{ marginTop: 0, fontWeight: 700 }}>Match summary</p>

              <p style={{ marginBottom: 0 }}>
                This is a <strong>{matchTypeLabel.toLowerCase()}</strong> match
                at <strong>{courtName}</strong> on{" "}
                <strong>{formatDate(selectedMatch.date)}</strong> at{" "}
                <strong>{selectedMatch.time || "Not specified"}</strong>. There
                are <strong>{spotsLeft}</strong> spots available.
              </p>
            </div>

            <div
              className="find-matches__card-actions"
              style={{ marginTop: "2rem" }}
            >
              {isInMatch ? (
                <button
                  type="button"
                  className="find-matches__btn find-matches__btn--leave"
                  aria-label={
                    isHost ? `Cancel match at ${courtName}` : `Leave match at ${courtName}`
                  }
                  onClick={handleLeave}
                >
                  {isHost ? "Cancel Match" : "Leave Match"}
                </button>
              ) : !isFull ? (
                <button
                  type="button"
                  className="find-matches__btn find-matches__btn--join"
                  aria-label={`Join match at ${courtName}`}
                  onClick={handleJoin}
                >
                  Join Match
                </button>
              ) : (
                <p
                  role="status"
                  style={{
                    color: "#b42318",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  This match is full.
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

export default MatchViewPage;