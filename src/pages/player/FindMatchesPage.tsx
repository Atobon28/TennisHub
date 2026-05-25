import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import AdBanners from "../../components/player/AdBanners";
import ConfirmModal from "../../components/common/ConfirmModal";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import PrimaryButton from "../../components/common/PrimaryButton";
import DangerButton from "../../components/common/DangerButton";
import { useAuth } from "../../context/useAuth";
import { useMatches } from "../../context";
import { useToast } from "../../context/ToastContext";
import type { Match } from "../../context/MatchesContext";
import "../../styles/find-matches.css";

function FindMatchesPage() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { showToast } = useToast();

  const {
    matches,
    loading,
    error,
    loadMatches,
    joinExistingMatch,
    leaveExistingMatch,
    removeMatch,
  } = useMatches();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [matchToLeave, setMatchToLeave] = useState<Match | null>(null);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const upcomingMatches = useMemo(() => {
    return matches
      .filter((match) => {
        if (!match.date || !match.time) return false;

        const matchDate = new Date(`${match.date}T${match.time}`);
        const now = new Date();

        return matchDate >= now;
      })
      .filter((match) => {
        if (!selectedDate) return true;

        return match.date === selectedDate;
      })
      .filter((match) => {
        if (selectedType === "All") return true;

        const type = String(match.matchType || match.type || "").toLowerCase();

        if (selectedType === "Singles") return type.includes("single");
        if (selectedType === "Doubles") return type.includes("double");

        return true;
      })
      .sort((a, b) => {
        const firstDate = new Date(`${a.date}T${a.time}`).getTime();
        const secondDate = new Date(`${b.date}T${b.time}`).getTime();

        return firstDate - secondDate;
      });
  }, [matches, selectedDate, selectedType]);

  const handleJoin = async (
    event: React.MouseEvent<HTMLButtonElement>,
    match: Match,
  ) => {
    event.stopPropagation();

    if (!userData?.uid || !userData?.username) return;

    try {
      await joinExistingMatch(match.id, userData.uid, userData.username);
      await loadMatches();
      showToast("Match joined successfully.", "success");
    } catch (error) {
      console.error("Error joining match:", error);
      showToast("Error joining match.", "error");
    }
  };

  const handleLeave = (
    event: React.MouseEvent<HTMLButtonElement>,
    match: Match,
  ) => {
    event.stopPropagation();
    setMatchToLeave(match);
  };

  const handleCancelLeave = () => {
    setMatchToLeave(null);
  };

  const handleConfirmLeave = async () => {
    if (!matchToLeave || !userData?.uid || !userData?.username) return;

    try {
      if (matchToLeave.hostId === userData.uid) {
        await removeMatch(matchToLeave.id);
      } else {
        await leaveExistingMatch(
          matchToLeave.id,
          userData.uid,
          userData.username,
        );
      }

      await loadMatches();

      showToast(
        matchToLeave.hostId === userData.uid
          ? "Match cancelled successfully."
          : "Match left successfully.",
        "success",
      );

      setMatchToLeave(null);
    } catch (error) {
      console.error("Error leaving match:", error);

      showToast(
        matchToLeave.hostId === userData.uid
          ? "Error cancelling match."
          : "Error leaving match.",
        "error",
      );
    }
  };

  const isInMatch = (match: Match) =>
    match.playerIds?.includes(userData?.uid || "");

  const isFull = (match: Match) => {
    const playersCount = match.players?.length || 0;
    const maxPlayers =
      typeof match.maxPlayers === "number" ? match.maxPlayers : 0;

    return playersCount >= maxPlayers;
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not specified";

    const d = new Date(date + "T00:00:00");

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="find-matches">
      <div className="find-matches__grid">
        <section className="find-matches__main">
          <div className="find-matches__section-title-wrap">
            <span className="find-matches__icon-wrap" aria-hidden="true">
              <Icon
                icon="game-icons:tennis-racket"
                className="find-matches__icon"
              />
            </span>

            <h2 className="find-matches__title">Available Matches</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <input
              type="date"
              aria-label="Filter matches by date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                border: "none",
                borderRadius: "999px",
                padding: "0.8rem 1rem",
                fontWeight: 700,
                fontFamily: "inherit",
                background: "white",
                color: "#111",
                boxShadow: "0 4px 12px rgba(15, 14, 12, 0.08)",
              }}
            />

            <select
              aria-label="Filter matches by type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                border: "none",
                borderRadius: "999px",
                padding: "0.8rem 1rem",
                fontWeight: 800,
                fontFamily: "inherit",
                background: "white",
                color: "#111",
                boxShadow: "0 4px 12px rgba(15, 14, 12, 0.08)",
              }}
            >
              <option value="All">All Types</option>
              <option value="Singles">Singles</option>
              <option value="Doubles">Doubles</option>
            </select>
          </div>

          {loading ? (
            <LoadingState message="Loading matches..." />
          ) : error ? (
            <p className="find-matches__empty" role="alert">
              {error}
            </p>
          ) : upcomingMatches.length === 0 ? (
            <EmptyState message="No matches match your filters." />
          ) : (
            <div className="find-matches__list">
              {upcomingMatches.map((match) => {
                const full = isFull(match);
                const inMatch = isInMatch(match);
                const isHost = match.hostId === userData?.uid;

                const playersCount = match.players?.length || 0;
                const maxPlayers =
                  typeof match.maxPlayers === "number" ? match.maxPlayers : 0;
                const spotsLeft = Math.max(maxPlayers - playersCount, 0);

                const courtName =
                  typeof match.court === "string"
                    ? match.court
                    : "Not specified";

                const hostName =
                  typeof match.hostUsername === "string"
                    ? match.hostUsername
                    : typeof match.hostName === "string"
                      ? match.hostName
                      : "Unknown host";

                return (
                  <article
                    key={match.id}
                    className={`find-matches__card ${
                      full ? "find-matches__card--full" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="find-matches__card-click"
                      aria-label={`View match at ${courtName} on ${formatDate(
                        match.date,
                      )} at ${match.time || "not specified"}`}
                      onClick={() =>
                        navigate(`/player/matches/view/${match.id}`)
                      }
                    >
                      <div className="find-matches__card-header">
                        <div className="find-matches__card-info">
                          <p className="find-matches__card-court">
                            <Icon
                              icon="mdi:tennis-ball-outline"
                              aria-hidden="true"
                            />{" "}
                            {courtName}
                          </p>

                          <p className="find-matches__card-date">
                            {formatDate(match.date)} —{" "}
                            {match.time || "Not specified"}
                          </p>

                          <p className="find-matches__card-host">
                            Host: <strong>{hostName}</strong>
                          </p>
                        </div>

                        <div className="find-matches__card-spots">
                          {full ? (
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
                    </button>

                    <div className="find-matches__players">
                      <p className="find-matches__players-label">
                        Players ({playersCount}/{maxPlayers}):
                      </p>

                      <div className="find-matches__players-list">
                        {match.players?.map((player) => (
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
                            {player.uid === match.hostId && " 👑"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="find-matches__card-actions">
                      {inMatch ? (
                        <DangerButton
                          className="find-matches__btn find-matches__btn--leave"
                          aria-label={
                            isHost
                              ? `Cancel match at ${courtName}`
                              : `Leave match at ${courtName}`
                          }
                          onClick={(event) => handleLeave(event, match)}
                        >
                          {isHost ? "Cancel Match" : "Leave Match"}
                        </DangerButton>
                      ) : !full ? (
                        <PrimaryButton
                          className="find-matches__btn find-matches__btn--join"
                          aria-label={`Join match at ${courtName}`}
                          onClick={(event) => handleJoin(event, match)}
                        >
                          Join
                        </PrimaryButton>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <AdBanners />
      </div>

      <ConfirmModal
        isOpen={Boolean(matchToLeave)}
        title={
          matchToLeave?.hostId === userData?.uid
            ? "Cancel match?"
            : "Leave match?"
        }
        message={
          matchToLeave?.hostId === userData?.uid
            ? "Are you sure you want to cancel this match? This will remove it for all players."
            : "Are you sure you want to leave this match?"
        }
        confirmLabel={
          matchToLeave?.hostId === userData?.uid
            ? "Cancel Match"
            : "Leave Match"
        }
        cancelLabel="Cancel"
        danger
        onCancel={handleCancelLeave}
        onConfirm={handleConfirmLeave}
      />
    </div>
  );
}

export default FindMatchesPage;
