import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import TournamentCard from "../../components/player/TournamentCard";
import "../../styles/admin-profile.css";
import court1 from "../../assets/court-1.jpg";
import court2 from "../../assets/court-2.jpg";

const courts = [
  { id: 1, name: "Granada", image: court2 },
  { id: 2, name: "Ciudad Jardín", image: court1 },
];

const tournaments = [
  {
    id: 1,
    level: 5,
    name: "Tournament of champions",
    info: "28/02/26 - 08:00 AM - Court: Ciudad Jardín",
  },
  {
    id: 2,
    level: 2,
    name: "Beginners Tournament",
    info: "07/03/26 - 08:00 AM - Court: Granada",
  },
];

function AdminProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"courts" | "tournaments">(
    "courts",
  );
  const [avatar, setAvatar] = useState<string>(() => {
    return localStorage.getItem("adminAvatar") || court1;
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

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

  return (
    <div className="admin-profile">
      <div className="admin-profile__grid">
        <section className="admin-profile__main">
          {/* Header */}
          <div className="admin-profile__header">
            <div className="admin-profile__avatar-wrap">
              <img
                src={avatar}
                alt="Admin 1"
                className="admin-profile__avatar"
              />
              <button
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
              <h2 className="admin-profile__name">Admin 1</h2>
              <p className="admin-profile__username">@Admin1</p>
              <div className="admin-profile__links">
                <button
                  className="admin-profile__link"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </button>
                <button
                  className="admin-profile__link admin-profile__link--logout"
                  onClick={() => navigate("/")}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="admin-profile__tabs">
            <button
              className={`admin-profile__tab ${activeTab === "courts" ? "admin-profile__tab--active" : ""}`}
              onClick={() => setActiveTab("courts")}
            >
              My Courts
            </button>
            <button
              className={`admin-profile__tab ${activeTab === "tournaments" ? "admin-profile__tab--active" : ""}`}
              onClick={() => setActiveTab("tournaments")}
            >
              My Tournaments
            </button>
          </div>

          {/* Content */}
          <div className="admin-profile__list">
            {activeTab === "courts"
              ? courts.map((court) => (
                  <div key={court.id} className="admin-profile__court-card">
                    <img
                      src={court.image}
                      alt={court.name}
                      className="admin-profile__court-image"
                    />
                    <div className="admin-profile__court-overlay">
                      <span className="admin-profile__court-name">
                        {court.name}
                      </span>
                    </div>
                  </div>
                ))
              : tournaments.map((t) => (
                  <TournamentCard
                    key={t.id}
                    level={t.level}
                    name={t.name}
                    info={t.info}
                    buttonLabel="Admin"
                    onView={() => navigate("/admin/tournaments/view")}
                  />
                ))}
          </div>
        </section>

        <AdBanners />
      </div>

      {/* Modal Change Password */}
      {showPasswordModal && (
        <div className="admin-profile__modal-overlay">
          <div className="admin-profile__modal">
            <button
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
