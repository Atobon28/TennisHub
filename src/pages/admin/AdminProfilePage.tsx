import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import TournamentCard from "../../components/player/TournamentCard";
import { logoutUser } from "../../firebase/services";
import { useAuth } from "../../context/useAuth";
import { useCourts, useProfile, useTournaments } from "../../context";
import "../../styles/admin-profile.css";
import court1 from "../../assets/court-1.jpg";
import { useToast } from "../../context/ToastContext";

function AdminProfilePage() {
  const navigate = useNavigate();
  const { userData, refreshUserData } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    adminCourts,
    loading: courtsLoading,
    error: courtsError,
    loadAdminCourts,
  } = useCourts();

  const {
    adminTournaments,
    loading: tournamentsLoading,
    error: tournamentsError,
    loadAdminTournaments,
  } = useTournaments();

  const {
    uploadAvatar,
    changePassword,
    loading: profileLoading,
    error: profileError,
    success: profileSuccess,
    clearProfileMessages,
  } = useProfile();

  const [activeTab, setActiveTab] = useState<"courts" | "tournaments">(
    "courts",
  );

  const [avatar, setAvatar] = useState<string>(userData?.photoURL || court1);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const loading = courtsLoading || tournamentsLoading;
  const pageError = courtsError || tournamentsError;

  useEffect(() => {
    setAvatar(userData?.photoURL || court1);

    if (!userData?.uid) return;

    loadAdminCourts(userData.uid);
    loadAdminTournaments(userData.uid);
  }, [userData, loadAdminCourts, loadAdminTournaments]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !userData?.id || !userData?.uid) return;

    setUploadingAvatar(true);
    setAvatarMsg("");
    clearProfileMessages();

    try {
      const imageUrl = await uploadAvatar(userData.id, userData.uid, file);

      setAvatar(imageUrl);
      await refreshUserData();

      setAvatarMsg("Avatar updated successfully.");
      showToast("Avatar uploaded successfully.", "success");
    } catch (error) {
      console.error("Error uploading avatar:", error);

      if (error instanceof Error) {
        setAvatarMsg(error.message);
        showToast("Error uploading image.", "error");
      } else {
        setAvatarMsg("Error uploading avatar. Please try again.");
        showToast("Error uploading image.", "error");
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

      setPasswordMsg("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordModal(false);

      showToast("Password updated successfully.", "success");
    } catch (error) {
      console.error("Error changing password:", error);

      if (profileError) {
        setPasswordMsg(profileError);
      } else {
        setPasswordMsg("Error updating password. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const name = userData?.username || "Admin";
  const username = userData?.username ? `@${userData.username}` : "@admin";

  return (
    <div className="admin-profile">
      <div className="admin-profile__grid">
        <section className="admin-profile__main">
          <div className="admin-profile__header">
            <div className="admin-profile__avatar-wrap">
              <img
                src={avatar || court1}
                alt={name}
                className="admin-profile__avatar"
              />

              <button
                type="button"
                className="admin-profile__edit-btn"
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

            <div className="admin-profile__user-info">
              <h2 className="admin-profile__name">{name}</h2>
              <p className="admin-profile__username">{username}</p>

              {(avatarMsg || profileError || profileSuccess) && (
                <p
                  style={{
                    margin: "0.35rem 0 0",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color:
                      avatarMsg.includes("successfully") || profileSuccess
                        ? "#2f9e44"
                        : "#e05252",
                  }}
                >
                  {avatarMsg || profileError || profileSuccess}
                </p>
              )}

              <div className="admin-profile__links">
                <button
                  type="button"
                  className="admin-profile__link"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </button>

                <button
                  type="button"
                  className="admin-profile__link admin-profile__link--logout"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>

          <div className="admin-profile__tabs">
            <button
              type="button"
              className={`admin-profile__tab ${
                activeTab === "courts" ? "admin-profile__tab--active" : ""
              }`}
              onClick={() => setActiveTab("courts")}
            >
              My Courts
            </button>

            <button
              type="button"
              className={`admin-profile__tab ${
                activeTab === "tournaments" ? "admin-profile__tab--active" : ""
              }`}
              onClick={() => setActiveTab("tournaments")}
            >
              My Tournaments
            </button>
          </div>

          <div className="admin-profile__list">
            {loading ? (
              <p className="admin-profile__empty">Loading profile data...</p>
            ) : pageError ? (
              <p className="admin-profile__empty">{pageError}</p>
            ) : activeTab === "courts" ? (
              adminCourts.length === 0 ? (
                <p className="admin-profile__empty">No courts yet.</p>
              ) : (
                adminCourts.map((court) => (
                  <div key={court.id} className="admin-profile__court-card">
                    <img
                      src={
                        typeof court.image === "string" ? court.image : court1
                      }
                      alt={court.name || "Court"}
                      className="admin-profile__court-image"
                    />

                    <div className="admin-profile__court-overlay">
                      <span className="admin-profile__court-name">
                        {court.name || "Unnamed court"}
                      </span>

                      {court.courtType && (
                        <span
                          style={{
                            backgroundColor: "rgba(255,255,255,0.9)",
                            color: "#111",
                            padding: "0.25rem 0.7rem",
                            borderRadius: "999px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            marginTop: "0.4rem",
                          }}
                        >
                          {String(court.courtType)}
                        </span>
                      )}

                      <button
                        type="button"
                        className="admin-profile__link"
                        onClick={() =>
                          navigate(`/admin/courts/view/${court.id}`)
                        }
                        style={{
                          backgroundColor: "white",
                          borderRadius: "999px",
                          padding: "0.4rem 0.9rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        See more
                      </button>
                    </div>
                  </div>
                ))
              )
            ) : adminTournaments.length === 0 ? (
              <p className="admin-profile__empty">No tournaments yet.</p>
            ) : (
              adminTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  level={
                    typeof tournament.level === "number"
                      ? tournament.level
                      : undefined
                  }
                  name={tournament.name}
                  info={tournament.info}
                  buttonLabel="View"
                  onView={() =>
                    navigate(`/admin/tournaments/view/${tournament.id}`)
                  }
                />
              ))
            )}
          </div>
        </section>

        <AdBanners />
      </div>

      {showPasswordModal && (
        <div className="admin-profile__modal-overlay">
          <div className="admin-profile__modal">
            <button
              type="button"
              className="admin-profile__modal-close"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordMsg("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              ✕
            </button>

            <h2 className="admin-profile__modal-title">Change Password</h2>

            <div className="admin-profile__modal-section">
              <h3 className="admin-profile__modal-subtitle">Password</h3>

              <label className="admin-profile__modal-label">
                New Password:
              </label>

              <input
                type="password"
                className="admin-profile__modal-input"
                placeholder="New Password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <label className="admin-profile__modal-label">
                Confirm Password:
              </label>

              <input
                type="password"
                className="admin-profile__modal-input"
                placeholder="Confirm Password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {passwordMsg && (
                <p className="admin-profile__modal-error">{passwordMsg}</p>
              )}
            </div>

            <button
              type="button"
              className="admin-profile__modal-confirm"
              onClick={handleConfirmPassword}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProfilePage;
