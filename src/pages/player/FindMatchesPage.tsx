import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import AdBanners from "../../components/player/AdBanners";
import { useAuth } from "../../context/useAuth";
import {
  getMatches,
  joinMatch,
  leaveMatch,
  deleteMatch,
} from "../../firebase/services";
import "../../styles/find-matches.css";

interface MatchPlayer {
  uid: string;
  username: string;
}

interface Match {
  id: string;
  court: string;
  date: string;
  time: string;
  hostId: string;
  hostUsername: string;
  players: MatchPlayer[];
  playerIds: string[];
  maxPlayers: number;
  createdAt: string;
}

function FindMatchesPage() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await getMatches();
      const now = new Date();
      const filtered = (data as Match[]).filter((m) => {
        const matchDate = new Date(`${m.date}T${m.time}`);
        return matchDate >= now;
      });
      filtered.sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}`).getTime() -
          new Date(`${b.date}T${b.time}`).getTime(),
      );
      setMatches(filtered);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.MouseEvent, match: Match) => {
    e.stopPropagation();
    if (!userData?.uid || !userData?.username) return;
    try {
      await joinMatch(match.id, userData.uid, userData.username);
      await fetchMatches();
    } catch (error) {
      console.error("Error joining match:", error);
    }
  };

  const handleLeave = async (e: React.MouseEvent, match: Match) => {
    e.stopPropagation();
    if (!userData?.uid || !userData?.username) return;
    try {
      if (match.hostId === userData.uid) {
        await deleteMatch(match.id);
      } else {
        await leaveMatch(match.id, userData.uid, userData.username);
      }
      await fetchMatches();
    } catch (error) {
      console.error("Error leaving match:", error);
    }
  };

  const isInMatch = (match: Match) =>
    match.playerIds?.includes(userData?.uid || "");

  const isFull = (match: Match) => match.players?.length >= match.maxPlayers;

  const formatDate = (date: string) => {
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
            <span className="find-matches__icon-wrap">
              <Icon
                icon="game-icons:tennis-racket"
                className="find-matches__icon"
              />
            </span>
            <h2 className="find-matches__title">Available Matches</h2>
          </div>

          {loading ? (
            <p className="find-matches__empty">Loading matches...</p>
          ) : matches.length === 0 ? (
            <p className="find-matches__empty">No matches available yet.</p>
          ) : (
            <div className="find-matches__list">
              {matches.map((match) => {
                const full = isFull(match);
                const inMatch = isInMatch(match);
                const isHost = match.hostId === userData?.uid;
                const spotsLeft =
                  match.maxPlayers - (match.players?.length || 0);

                return (
                  <div
                    key={match.id}
                    className={`find-matches__card ${full ? "find-matches__card--full" : ""}`}
                    onClick={() => navigate(`/player/matches/view/${match.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Header */}
                    <div className="find-matches__card-header">
                      <div className="find-matches__card-info">
                        <p className="find-matches__card-court">
                          <Icon icon="mdi:tennis-ball-outline" /> {match.court}
                        </p>
                        <p className="find-matches__card-date">
                          {formatDate(match.date)} — {match.time}
                        </p>
                        <p className="find-matches__card-host">
                          Host: <strong>{match.hostUsername}</strong>
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

                    {/* Players */}
                    <div className="find-matches__players">
                      <p className="find-matches__players-label">
                        Players ({match.players?.length || 0}/{match.maxPlayers}
                        ):
                      </p>
                      <div className="find-matches__players-list">
                        {match.players?.map((player) => (
                          <span
                            key={player.uid}
                            className="find-matches__player-chip"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/player/players/view/${player.uid}`);
                            }}
                          >
                            {player.username}
                            {player.uid === match.hostId && " 👑"}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="find-matches__card-actions">
                      {inMatch ? (
                        <button
                          className="find-matches__btn find-matches__btn--leave"
                          onClick={(e) => handleLeave(e, match)}
                        >
                          {isHost ? "Cancel Match" : "Leave Match"}
                        </button>
                      ) : !full ? (
                        <button
                          className="find-matches__btn find-matches__btn--join"
                          onClick={(e) => handleJoin(e, match)}
                        >
                          Join
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        <AdBanners />
      </div>
    </div>
  );
}

export default FindMatchesPage;
