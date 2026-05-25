import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import TournamentCard from "../../components/player/TournamentCard";
import { logoutUser } from "../../firebase/services";
import { useAuth } from "../../context/useAuth";
import { useMatches, useProfile, useTournaments } from "../../context";
import type { Match } from "../../context/MatchesContext";
import type { Tournament } from "../../context/TournamentsContext";
import ConfirmModal from "../../components/common/ConfirmModal";
import "../../styles/player-profile.css";
import player1 from "../../assets/player-1.jpg";

const categoryOptions = [
  "First Category",
  "Second Category",
  "Third Category",
  "Fourth Category",
  "Fifth Category",
  "Beginner",
  "Junior",
  "Senior",
];

const getPlayerCategory = (level?: number | null, category?: string | null) => {
  if (category) return category;

  if (level === 1) return "First Category";
  if (level === 2) return "Second Category";
  if (level === 3) return "Third Category";
  if (level === 4) return "Fourth Category";
  if (level === 5) return "Fifth Category";

  return "Beginner";
};

const getCategoryBadge = (category?: string | null) => {
  if (!category) return "🎾";

  const normalizedCategory = category.trim();

  const badges: Record<string, string> = {
    "First Category": "1",
    "Second Category": "2",
    "Third Category": "3",
    "Fourth Category": "4",
    "Fifth Category": "5",
    Beginner: "B",
    Junior: "J",
    Senior: "S",
  };

  return badges[normalizedCategory] || normalizedCategory.charAt(0);
};

const getCategoryLevel = (category: string) => {
  if (category === "First Category") return 1;
  if (category === "Second Category") return 2;
  if (category === "Third Category") return 3;
  if (category === "Fourth Category") return 4;
  if (category === "Fifth Category") return 5;

  return null;
};

function PlayerProfilePage() {
  const navigate = useNavigate();
  const { userData, refreshUserData } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { playerMatches, loadPlayerMatches, leaveExistingMatch, removeMatch } =
    useMatches();

  const { playerTournaments, loadPlayerTournaments, unregisterFromTournament } =
    useTournaments();

  const {
    uploadAvatar,
    editProfile,
    changePassword,
    loading: profileLoading,
    error: profileError,
    success: profileSuccess,
    clearProfileMessages,
  } = useProfile();

  const [activeTab, setActiveTab] = useState<"matches" | "tournaments">(
    "matches",
  );

  const [avatar, setAvatar] = useState<string>(userData?.photoURL || player1);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState("");

  const [playerCategory, setPlayerCategory] = useState(
    getPlayerCategory(userData?.level, userData?.category),
  );

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const [tempCategory, setTempCategory] = useState(playerCategory);
  const [leaveTournamentId, setLeaveTournamentId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const realCategory = getPlayerCategory(userData?.level, userData?.category);

    setPlayerCategory(realCategory);
    setTempCategory(realCategory);
    setAvatar(userData?.photoURL || player1);
  }, [userData]);

  useEffect(() => {
    if (!userData?.uid) return;

    loadPlayerTournaments(userData.uid);
    loadPlayerMatches(userData.uid);
  }, [userData?.uid, loadPlayerTournaments, loadPlayerMatches]);

  const matches = playerMatches
    .filter((match) => {
      if (!match.date || !match.time) return false;

      const matchDate = new Date(`${match.date}T${match.time}`);
      const now = new Date();

      return matchDate >= now;
    })
    .sort((a, b) => {
      const firstDate = new Date(`${a.date}T${a.time}`).getTime();
      const secondDate = new Date(`${b.date}T${b.time}`).getTime();

      return firstDate - secondDate;
    });

  const tournaments = playerTournaments as Tournament[];

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !userData?.id || !userData?.uid) return;

    setUploadingAvatar(true);
    setAvatarMsg("");
    clearProfileMessages();

    try {
      const downloadURL = await uploadAvatar(userData.id, userData.uid, file);

      setAvatar(downloadURL);
      await refreshUserData();

      setAvatarMsg("Avatar updated successfully.");
    } catch (error) {
      console.error("Error uploading avatar:", error);

      if (error instanceof Error) {
        setAvatarMsg(error.message);
      } else {
        setAvatarMsg("Error uploading avatar. Please try again.");
      }
    } finally {
      setUploadingAvatar(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleConfirmPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setPasswordMsg("Please fill in both fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match.");
      return;
    }

    clearProfileMessages();

    try {
      await changePassword(newPassword);

      setPasswordMsg("Password updated successfully.");
setNewPassword("");
setConfirmPassword("");

setTimeout(() => {
  setShowPasswordModal(false);
  setPasswordMsg("");
}, 1200);
    } catch (error) {
      console.error("Error changing password:", error);

      if (profileError) {
        setPasswordMsg(profileError);
      } else {
        setPasswordMsg("Error updating password. Please try again.");
      }
    }
  };

  const handleConfirmCategory = async () => {
    if (!tempCategory || !userData?.id) return;

    clearProfileMessages();

    try {
      const numericLevel = getCategoryLevel(tempCategory);

      await editProfile(userData.id, {
        category: tempCategory,
        level: numericLevel,
      });

      await refreshUserData();

      setPlayerCategory(tempCategory);
      setTempCategory(tempCategory);
      setShowCategoryModal(false);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleCancelMatch = async (match: Match) => {
    if (!userData?.uid || !userData?.username) return;

    try {
      if (match.hostId === userData.uid) {
        await removeMatch(match.id);
      } else {
        await leaveExistingMatch(match.id, userData.uid, userData.username);
      }

      await loadPlayerMatches(userData.uid);
    } catch (error) {
      console.error("Error cancelling match:", error);
    }
  };

  const handleLeaveTournament = (playerTournamentId: string) => {
    setLeaveTournamentId(playerTournamentId);
  };

  const handleCancelLeaveTournament = () => {
    setLeaveTournamentId(null);
  };

  const handleConfirmLeaveTournament = async () => {
    if (!userData?.uid || !leaveTournamentId) return;

    try {
      await unregisterFromTournament(leaveTournamentId);
      await loadPlayerTournaments(userData.uid);
    } catch (error) {
      console.error("Error leaving tournament:", error);
    } finally {
      setLeaveTournamentId(null);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
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

  const name = userData?.username || "Player";
  const username = userData?.username ? `@${userData.username}` : "@player";
  const visibleCategory = userData?.category || playerCategory;

  return (
    <div className="player-profile">
      <div className="player-profile__grid">
        <section className="player-profile__main">
          <div className="player-profile__header">
            <div className="player-profile__avatar-wrap">
              <img
                src={avatar || player1}
                alt={`${name} profile avatar`}
                className="player-profile__avatar"
              />

              <button
                type="button"
                className="player-profile__edit-btn"
                aria-label="Upload player avatar"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar || profileLoading}
              >
                {uploadingAvatar || profileLoading ? "..." : "✏️"}
              </button>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
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
                    Your Category:
                  </span>

                  <button
                    type="button"
                    className="player-profile__level-badge player-profile__level-badge--clickable"
                    aria-label="Change player category"
                    onClick={() => {
                      setTempCategory(visibleCategory);
                      setShowCategoryModal(true);
                    }}
                    style={{
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {getCategoryBadge(visibleCategory)}
                  </button>
                </div>
              </div>

              <p className="player-profile__username">{username}</p>

              <p
                style={{
                  margin: "0.35rem 0 0",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#555",
                }}
              >
                {visibleCategory}
              </p>

              {(avatarMsg || profileError || profileSuccess) && (
                <p
                  role="status"
                  style={{
                    margin: "0.35rem 0 0",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color:
                      avatarMsg.includes("successfully") || profileSuccess
                        ? "#1f7a3a"
                        : "#b42318",
                  }}
                >
                  {avatarMsg || profileError || profileSuccess}
                </p>
              )}

              <div className="player-profile__links">
                <button
                  type="button"
                  className="player-profile__link"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </button>

                <button
                  type="button"
                  className="player-profile__link player-profile__link--logout"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>

          <div className="player-profile__tabs">
            <button
              type="button"
              className={`player-profile__tab ${
                activeTab === "matches" ? "player-profile__tab--active" : ""
              }`}
              aria-label="Show my matches"
              onClick={() => setActiveTab("matches")}
            >
              My Matches
            </button>

            <button
              type="button"
              className={`player-profile__tab ${
                activeTab === "tournaments" ? "player-profile__tab--active" : ""
              }`}
              aria-label="Show my tournaments"
              onClick={() => setActiveTab("tournaments")}
            >
              My Tournaments
            </button>
          </div>

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
                          <strong>{match.court || "Not specified"}</strong>
                        </p>

                        <p>
                          {formatDate(match.date)} —{" "}
                          {match.time || "Not specified"}
                        </p>

                        <p>
                          Host:{" "}
                          {typeof match.hostUsername === "string"
                            ? match.hostUsername
                            : typeof match.hostName === "string"
                              ? match.hostName
                              : "Unknown host"}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6,
                            marginTop: 6,
                          }}
                        >
                          {match.players?.map((player) => (
                            <button
                              key={player.uid}
                              type="button"
                              aria-label={`Open ${player.username} profile`}
                              onClick={() =>
                                navigate(`/player/players/view/${player.uid}`)
                              }
                              style={{
                                background: "rgba(0,0,0,0.2)",
                                border: "none",
                                borderRadius: "999px",
                                padding: "2px 10px",
                                fontSize: "0.75rem",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontFamily: "inherit",
                              }}
                            >
                              {player.username}
                              {player.uid === match.hostId ? " 👑" : ""}
                            </button>
                          ))}
                        </div>

                        <p style={{ marginTop: 4, fontSize: "0.78rem" }}>
                          {match.players?.length || 0}/{match.maxPlayers || 0}{" "}
                          players
                        </p>
                      </div>

                      <div className="player-profile__match-right">
                        <span className="player-profile__brand">TennisHub</span>

                        <span className="player-profile__brand-sub">Match</span>

                        <button
                          type="button"
                          aria-label={
                            isHost ? "Cancel this match" : "Leave this match"
                          }
                          onClick={() => handleCancelMatch(match)}
                          style={{
                            marginTop: 8,
                            background: "#c92a2a",
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
              tournaments.map((tournament) => (
                <div key={tournament.id}>
                  <TournamentCard
                    categoryBadge={getCategoryBadge(
                      tournament.categories?.[0] || visibleCategory,
                    )}
                    name={tournament.name}
                    info={tournament.info}
                    buttonLabel="View"
                    onView={() =>
                      navigate(
                        tournament.tournamentId
                          ? `/player/tournaments/view/${tournament.tournamentId}`
                          : "/player/tournaments",
                      )
                    }
                  />

                  <button
                    type="button"
                    aria-label={`Leave ${tournament.name} tournament`}
                    onClick={() => handleLeaveTournament(tournament.id)}
                    style={{
                      marginTop: "0.75rem",
                      width: "100%",
                      border: "none",
                      borderRadius: "999px",
                      padding: "0.75rem 1rem",
                      background: "#c92a2a",
                      color: "white",
                      fontWeight: 800,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Leave tournament
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <AdBanners />
      </div>

      {showPasswordModal && (
        <div className="player-profile__modal-overlay">
          <div className="player-profile__modal">
            <button
              type="button"
              className="player-profile__modal-close"
              aria-label="Close change password modal"
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

              <label
                className="player-profile__modal-label"
                htmlFor="new-player-password"
              >
                New Password:
              </label>

              <input
                id="new-player-password"
                type="password"
                className="player-profile__modal-input"
                placeholder="New Password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <label
                className="player-profile__modal-label"
                htmlFor="confirm-player-password"
              >
                Confirm Password:
              </label>

              <input
                id="confirm-player-password"
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
              type="button"
              className="player-profile__modal-confirm"
              onClick={handleConfirmPassword}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="player-profile__modal-overlay">
          <div className="player-profile__modal">
            <button
              type="button"
              className="player-profile__modal-close"
              aria-label="Close change category modal"
              onClick={() => setShowCategoryModal(false)}
            >
              ✕
            </button>

            <h2 className="player-profile__modal-title">Change Category</h2>

            <div className="player-profile__modal-section">
              <label
                className="player-profile__modal-label"
                htmlFor="player-category"
              >
                Select your category:
              </label>

              <select
                id="player-category"
                className="player-profile__modal-input"
                value={tempCategory}
                onChange={(e) => setTempCategory(e.target.value)}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="player-profile__modal-confirm"
              onClick={handleConfirmCategory}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(leaveTournamentId)}
        title="Leave tournament?"
        message="Are you sure you want to leave this tournament? Your registration will be removed."
        confirmLabel="Leave Tournament"
        cancelLabel="Cancel"
        danger
        onCancel={handleCancelLeaveTournament}
        onConfirm={handleConfirmLeaveTournament}
      />
    </div>
  );
}

export default PlayerProfilePage;