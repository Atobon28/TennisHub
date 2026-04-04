import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { Icon } from "@iconify/react";
import {
  getUserByUid,
  joinMatch,
  leaveMatch,
  deleteMatch,
} from "../../firebase/services";
import { useAuth } from "../../context/AuthContext";
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
}

// Importamos getMatches para buscar por id
import { getMatches } from "../../firebase/services";

function MatchViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      const data = await getMatches();
      const found = (data as Match[]).find((m) => m.id === id);
      setMatch(found || null);
    } catch (error) {
      console.error("Error fetching match:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!userData?.uid || !userData?.username || !match) return;
    try {
      await joinMatch(match.id, userData.uid, userData.username);
      await fetchMatch();
    } catch (error) {
      console.error("Error joining match:", error);
    }
  };

  const handleLeave = async () => {
    if (!userData?.uid || !userData?.username || !match) return;
    try {
      if (match.hostId === userData.uid) {
        await deleteMatch(match.id);
        navigate("/player/matches");
      } else {
        await leaveMatch(match.id, userData.uid, userData.username);
        await fetchMatch();
      }
    } catch (error) {
      console.error("Error leaving match:", error);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) return <p style={{ padding: 20, color: "#888" }}>Loading...</p>;
  if (!match)
    return <p style={{ padding: 20, color: "#888" }}>Match not found.</p>;

  const isInMatch = match.playerIds?.includes(userData?.uid || "");
  const isFull = match.players?.length >= match.maxPlayers;
  const isHost = match.hostId === userData?.uid;
  const spotsLeft = match.maxPlayers - (match.players?.length || 0);

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
            <h2 className="find-matches__title">Match Details</h2>
          </div>

          <div className="find-matches__card">
            {/* Header info */}
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

            {/* Players */}
            <div className="find-matches__players">
              <p className="find-matches__players-label">
                Players ({match.players?.length || 0}/{match.maxPlayers}):
              </p>
              <div className="find-matches__players-list">
                {match.players?.map((player) => (
                  <span
                    key={player.uid}
                    className="find-matches__player-chip"
                    onClick={() =>
                      navigate(`/player/players/view/${player.uid}`)
                    }
                  >
                    {player.username}
                    {player.uid === match.hostId && " 👑"}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="find-matches__card-actions">
              {isInMatch ? (
                <button
                  className="find-matches__btn find-matches__btn--leave"
                  onClick={handleLeave}
                >
                  {isHost ? "Cancel Match" : "Leave Match"}
                </button>
              ) : !isFull ? (
                <button
                  className="find-matches__btn find-matches__btn--join"
                  onClick={handleJoin}
                >
                  Join Match
                </button>
              ) : (
                <p
                  style={{
                    color: "#e05252",
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
