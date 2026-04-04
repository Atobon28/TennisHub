import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import TournamentCard from "../../components/player/TournamentCard";
import {
  getPlayerTournaments,
  getPlayerMatches,
  leaveMatch,
  deleteMatch,
  logoutUser,
  updateUser,
} from "../../firebase/services";
import { useAuth } from "../../context/AuthContext";
import "../../styles/player-profile.css";
import player1 from "../../assets/player-1.jpg";

interface Tournament {
  id: string;
  level: number;
  name: string;
  info: string;
}

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

function PlayerProfilePage() {
  const navigate = useNavigate();
  const { userData, refreshUserData } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<"matches" | "tournaments">(
    "matches",
  );
  const [avatar, setAvatar] = useState<string>(() => {
    return localStorage.getItem("playerAvatar") || player1;
  });
  const [level, setLevel] = useState<number>(userData?.level || 1);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [tempLevel, setTempLevel] = useState(String(userData?.level || 1));

  useEffect(() => {
    if (userData?.level) setLevel(userData.level);
  }, [userData]);

  useEffect(() => {
    if (!userData?.uid) return;

    const fetchTournaments = async () => {
      try {
        const data = await getPlayerTournaments(userData.uid);
        setTournaments(data as Tournament[]);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    };

    const fetchMatches = async () => {
      try {
        const data = await getPlayerMatches(userData.uid);
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
      }
    };

    fetchTournaments();
    fetchMatches();
  }, [userData]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      localStorage.setItem("playerAvatar", result);
      setAvatar(result);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmPassword = () => {
    if (!newPassword || !confirmPassword) {
      setPasswordMsg("Please fill in both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match.");
      return;
    }
    setPasswordMsg("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordModal(false);
  };

  const handleConfirmLevel = async () => {
    const val = parseInt(tempLevel);
    if (!val || val < 1 || val > 5) return;
    try {
      if (userData?.id) {
        await updateUser(userData.id, { level: val });
        await refreshUserData();
      }
      setLevel(val);
      setShowLevelModal(false);
    } catch (error) {
      console.error("Error updating level:", error);
    }
  };

  const handleCancelMatch = async (match: Match) => {
    if (!userData?.uid || !userData?.username) return;
    try {
      if (match.hostId === userData.uid) {
        await deleteMatch(match.id);
      } else {
        await leaveMatch(match.id, userData.uid, userData.username);
      }
      setMatches((prev) => prev.filter((m) => m.id !== match.id));
    } catch (error) {
      console.error("Error cancelling match:", error);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const formatDate = (date: string) => {
    const d = new Date(date + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const name = userData?.username || "Juan Castro";
  const username = userData?.username
    ? `@${userData.username}`
    : "@Juancastrog10";

  return (
    <div className="player-profile">
      <div className="player-profile__grid">
        <section className="player-profile__main">
          {/* Header */}
          <div className="player-profile__header">
            <div className="player-profile__avatar-wrap">
              <img src={avatar} alt={name} className="player-profile__avatar" />
              <button
                className="player-profile__edit-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                ✏️
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
            </div>
            <div className="player-profile__user-info">
              <div className="player-profile__name-row">
                <h2 className="player-profile__name">{name}</h2>
                <div className="player-profile__level-wrap">
                  <span className="player-profile__level-text">
                    Your Level:
                  </span>
                  <span
                    className="player-profile__level-badge player-profile__level-badge--clickable"
                    onClick={() => {
                      setTempLevel(String(level));
                      setShowLevelModal(true);
                    }}
                  >
                    {level}
                  </span>
                </div>
              </div>
              <p className="player-profile__username">{username}</p>
              <div className="player-profile__links">
                <button
                  className="player-profile__link"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </button>
                <button
                  className="player-profile__link player-profile__link--logout"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="player-profile__tabs">
            <button
              className={`player-profile__tab ${activeTab === "matches" ? "player-profile__tab--active" : ""}`}
              onClick={() => setActiveTab("matches")}
            >
              My Matches
            </button>
            <button
              className={`player-profile__tab ${activeTab === "tournaments" ? "player-profile__tab--active" : ""}`}
              onClick={() => setActiveTab("tournaments")}
            >
              My Tournaments
            </button>
          </div>

          {/* Lista */}
          <div className="player-profile__list">
            {activeTab === "matches" ? (
              matches.length === 0 ? (
                <p className="player-profile__empty">
                  You haven't joined any matches yet.
                </p>
              ) : (
                matches.map((match) => {
                  const isHost = match.hostId === userData?.uid;
                  return (
                    <div key={match.id} className="player-profile__match-card">
                      <div className="player-profile__match-left">
                        <p>
                          <strong>{match.court}</strong>
                        </p>
                        <p>
                          {formatDate(match.date)} — {match.time}
                        </p>
                        <p>Host: {match.hostUsername}</p>
                        {/* Players clickeables */}
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6,
                            marginTop: 6,
                          }}
                        >
                          {match.players?.map((player) => (
                            <span
                              key={player.uid}
                              onClick={() =>
                                navigate(`/player/players/view/${player.uid}`)
                              }
                              style={{
                                background: "rgba(0,0,0,0.2)",
                                borderRadius: "999px",
                                padding: "2px 10px",
                                fontSize: "0.75rem",
                                cursor: "pointer",
                                fontWeight: 600,
                              }}
                            >
                              {player.username}
                              {player.uid === match.hostId ? " 👑" : ""}
                            </span>
                          ))}
                        </div>
                        <p style={{ marginTop: 4, fontSize: "0.78rem" }}>
                          {match.players?.length || 0}/{match.maxPlayers}{" "}
                          players
                        </p>
                      </div>
                      <div className="player-profile__match-right">
                        <span className="player-profile__brand">TennisHub</span>
                        <span className="player-profile__brand-sub">Match</span>
                        <button
                          onClick={() => handleCancelMatch(match)}
                          style={{
                            marginTop: 8,
                            background: "#e05252",
                            color: "white",
                            border: "none",
                            borderRadius: "999px",
                            padding: "6px 14px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          {isHost ? "Cancel" : "Leave"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )
            ) : tournaments.length === 0 ? (
              <p className="player-profile__empty">
                You haven't joined any tournaments yet.
              </p>
            ) : (
              tournaments.map((t) => (
                <TournamentCard
                  key={t.id}
                  level={t.level}
                  name={t.name}
                  info={t.info}
                />
              ))
            )}
          </div>
        </section>
        <AdBanners />
      </div>

      {/* Modal Change Password */}
      {showPasswordModal && (
        <div className="player-profile__modal-overlay">
          <div className="player-profile__modal">
            <button
              className="player-profile__modal-close"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordMsg("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              ✕
            </button>
            <h2 className="player-profile__modal-title">Change Password</h2>
            <div className="player-profile__modal-section">
              <h3 className="player-profile__modal-subtitle">Password</h3>
              <label className="player-profile__modal-label">
                New Password:
              </label>
              <input
                type="password"
                className="player-profile__modal-input"
                placeholder="New Password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label className="player-profile__modal-label">
                Confirm Password:
              </label>
              <input
                type="password"
                className="player-profile__modal-input"
                placeholder="Confirm Password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {passwordMsg && (
                <p className="player-profile__modal-error">{passwordMsg}</p>
              )}
            </div>
            <button
              className="player-profile__modal-confirm"
              onClick={handleConfirmPassword}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Modal Change Level */}
      {showLevelModal && (
        <div className="player-profile__modal-overlay">
          <div className="player-profile__modal">
            <button
              className="player-profile__modal-close"
              onClick={() => setShowLevelModal(false)}
            >
              ✕
            </button>
            <h2 className="player-profile__modal-title">Change Level</h2>
            <div className="player-profile__modal-section">
              <label className="player-profile__modal-label">
                New Level (1-5):
              </label>
              <input
                type="number"
                min="1"
                max="5"
                className="player-profile__modal-input"
                placeholder="Level..."
                value={tempLevel}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 1 && val <= 5) setTempLevel(e.target.value);
                  if (e.target.value === "") setTempLevel("");
                }}
              />
            </div>
            <button
              className="player-profile__modal-confirm"
              onClick={handleConfirmLevel}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerProfilePage;
