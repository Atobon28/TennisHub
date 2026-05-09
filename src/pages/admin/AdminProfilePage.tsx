import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import TournamentCard from "../../components/player/TournamentCard";
import {
  getAdminTournaments,
  getAdminCourts,
  logoutUser,
  changeCurrentUserPassword,
} from "../../firebase/services";
import { useAuth } from "../../context/useAuth";
import "../../styles/admin-profile.css";
import court1 from "../../assets/court-1.jpg";

interface Tournament {
  id: string;
  name: string;
  info: string;
  date?: string;
  hour?: string;
  courts?: string[];
  categories?: string[];
  level?: number;
}

interface Court {
  id: string;
  name: string;
  image: string;
  contact?: string;
  address?: string;
  courtType?: string;
}

function AdminProfilePage() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"courts" | "tournaments">(
    "courts"
  );

  const [avatar, setAvatar] = useState<string>(() => {
    return localStorage.getItem("adminAvatar") || court1;
  });

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    fetchAdminProfileData();
  }, [userData]);

  const fetchAdminProfileData = async () => {
    if (!userData?.uid) return;

    setLoading(true);

    try {
      const tournamentsData = await getAdminTournaments(userData.uid);
      setTournaments(tournamentsData as Tournament[]);

      const courtsData = await getAdminCourts(userData.uid);
      setCourts(courtsData as Court[]);
    } catch (error) {
      console.error("Error fetching admin profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      localStorage.setItem("adminAvatar", result);
      setAvatar(result);
    };

    reader.readAsDataURL(file);
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

    try {
      await changeCurrentUserPassword(newPassword);

      setPasswordMsg("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordModal(false);

      alert("Password updated successfully.");
    } catch (error: any) {
      console.error("Error changing password:", error);

      if (error.code === "auth/requires-recent-login") {
        setPasswordMsg("Please log out and log in again before changing password.");
        return;
      }

      setPasswordMsg("Error updating password. Please try again.");
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
              <img src={avatar} alt={name} className="admin-profile__avatar" />

              <button
                type="button"
                className="admin-profile__edit-btn"
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

            <div className="admin-profile__user-info">
              <h2 className="admin-profile__name">{name}</h2>
              <p className="admin-profile__username">{username}</p>

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
                activeTab === "tournaments"
                  ? "admin-profile__tab--active"
                  : ""
              }`}
              onClick={() => setActiveTab("tournaments")}
            >
              My Tournaments
            </button>
          </div>

          <div className="admin-profile__list">
            {loading ? (
              <p className="admin-profile__empty">Loading profile data...</p>
            ) : activeTab === "courts" ? (
              courts.length === 0 ? (
                <p className="admin-profile__empty">No courts yet.</p>
              ) : (
                courts.map((court) => (
                  <div key={court.id} className="admin-profile__court-card">
                    <img
                      src={court.image || court1}
                      alt={court.name}
                      className="admin-profile__court-image"
                    />

                    <div className="admin-profile__court-overlay">
                      <span className="admin-profile__court-name">
                        {court.name}
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
                          {court.courtType}
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
            ) : tournaments.length === 0 ? (
              <p className="admin-profile__empty">No tournaments yet.</p>
            ) : (
              tournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  level={tournament.level}
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