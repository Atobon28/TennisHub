import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { useAuth } from "../../context/useAuth";
import { logoutUser, updateUser } from "../../firebase/services";
import "../../styles/coach-profile.css";
import coach1 from "../../assets/coach-1.jpg";

const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function CoachProfilePage() {
  const navigate = useNavigate();
  const { userData, refreshUserData } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<string>(() => {
    return localStorage.getItem("coachAvatar") || coach1;
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [price, setPrice] = useState<string>("$150.000 COP");
  const [saved, setSaved] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const [newPrice, setNewPrice] = useState("");
  const [priceMsg, setPriceMsg] = useState("");

  const formatCurrency = (value: string | number) => {
    const onlyNumbers = String(value).replace(/\D/g, "");

    if (!onlyNumbers) return "$0 COP";

    const numberValue = Number(onlyNumbers);

    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(numberValue);
  };

  useEffect(() => {
    if (userData?.pricePerHour) {
      setPrice(formatCurrency(userData.pricePerHour));
    }

    if (Array.isArray(userData?.availableDays)) {
      setSelectedDays(userData.availableDays);
    } else {
      setSelectedDays([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ]);
    }
  }, [userData]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      localStorage.setItem("coachAvatar", result);
      setAvatar(result);
    };

    reader.readAsDataURL(file);
  };

  const toggleDay = (day: string) => {
    setSaved(false);

    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    try {
      if (userData?.id) {
        await updateUser(userData.id, {
          availableDays: selectedDays,
        });

        await refreshUserData();
      }

      setSaved(true);
    } catch (error) {
      console.error("Error saving days:", error);
    }
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

  const handlePriceChange = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");

    setNewPrice(onlyNumbers);
    setPriceMsg("");
  };

  const handleConfirmPrice = async () => {
    if (!newPrice) {
      setPriceMsg("Please enter a valid price.");
      return;
    }

    const numericPrice = Number(newPrice);

    if (numericPrice <= 0) {
      setPriceMsg("The price must be greater than 0.");
      return;
    }

    const formatted = formatCurrency(numericPrice);

    try {
      if (userData?.id) {
        await updateUser(userData.id, {
          pricePerHour: String(numericPrice),
        });

        await refreshUserData();
      }

      setPrice(formatted);
      setNewPrice("");
      setPriceMsg("");
      setShowPriceModal(false);
    } catch (error) {
      console.error("Error updating price:", error);
      setPriceMsg("Error updating price. Please try again.");
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const name = userData?.username || "Coach";
  const username = userData?.username ? `@${userData.username}` : "@coach";

  return (
    <div className="coach-profile">
      <div className="coach-profile__grid">
        <section className="coach-profile__main">
          <div className="coach-profile__header">
            <div className="coach-profile__avatar-wrap">
              <img src={avatar} alt={name} className="coach-profile__avatar" />

              <button
                type="button"
                className="coach-profile__edit-btn"
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

            <div className="coach-profile__user-info">
              <h2 className="coach-profile__name">{name}</h2>
              <p className="coach-profile__username">{username}</p>

              <div className="coach-profile__links">
                <button
                  type="button"
                  className="coach-profile__link"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </button>

                <button
                  type="button"
                  className="coach-profile__link coach-profile__link--logout"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>

          <div className="coach-profile__details">
            <p>
              <span className="coach-profile__detail-label">Contact:</span>{" "}
              {userData?.phone || "Not specified"}
            </p>

            <p>
              <span className="coach-profile__detail-label">
                Price per hour:
              </span>{" "}
              {price}
            </p>

            <button
              type="button"
              className="coach-profile__change-price"
              onClick={() => {
                setNewPrice("");
                setPriceMsg("");
                setShowPriceModal(true);
              }}
            >
              Change Price
            </button>
          </div>

          <p className="coach-profile__availability-label">
            <strong>Edit availability:</strong>
          </p>

          <div className="coach-profile__schedule">
            {allDays.map((day) => {
              const isSelected = selectedDays.includes(day);

              return (
                <div key={day} className="coach-profile__day-row">
                  <img
                    src={avatar}
                    alt=""
                    className="coach-profile__day-icon"
                  />

                  <span className="coach-profile__day-name">{day}</span>

                  <button
                    type="button"
                    className={`coach-profile__check-circle ${
                      isSelected ? "coach-profile__check-circle--active" : ""
                    }`}
                    onClick={() => toggleDay(day)}
                  >
                    {isSelected ? "✓" : ""}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="coach-profile__save-wrap">
            {saved && (
              <span className="coach-profile__saved-msg">
                ✓ Profile saved!
              </span>
            )}

            <button
              type="button"
              className="coach-profile__save-btn"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </section>

        <AdBanners />
      </div>

      {showPasswordModal && (
        <div className="coach-profile__modal-overlay">
          <div className="coach-profile__modal">
            <button
              type="button"
              className="coach-profile__modal-close"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordMsg("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              ✕
            </button>

            <h2 className="coach-profile__modal-title">Change Password</h2>

            <div className="coach-profile__modal-section">
              <h3 className="coach-profile__modal-subtitle">Password</h3>

              <label className="coach-profile__modal-label">
                New Password:
              </label>

              <input
                type="password"
                className="coach-profile__modal-input"
                placeholder="New Password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <label className="coach-profile__modal-label">
                Confirm Password:
              </label>

              <input
                type="password"
                className="coach-profile__modal-input"
                placeholder="Confirm Password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {passwordMsg && (
                <p className="coach-profile__modal-error">{passwordMsg}</p>
              )}
            </div>

            <button
              type="button"
              className="coach-profile__modal-confirm"
              onClick={handleConfirmPassword}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {showPriceModal && (
        <div className="coach-profile__modal-overlay">
          <div className="coach-profile__modal">
            <button
              type="button"
              className="coach-profile__modal-close"
              onClick={() => {
                setShowPriceModal(false);
                setNewPrice("");
                setPriceMsg("");
              }}
            >
              ✕
            </button>

            <h2 className="coach-profile__modal-title">Change Price</h2>

            <div className="coach-profile__modal-section">
              <h3 className="coach-profile__modal-subtitle">Price per hour</h3>

              <label className="coach-profile__modal-label">
                New Price COP:
              </label>

              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="coach-profile__modal-input"
                placeholder="Example: 150000"
                value={newPrice}
                onChange={(e) => handlePriceChange(e.target.value)}
              />

              {newPrice && (
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontWeight: 700,
                    color: "#333",
                  }}
                >
                  Preview: {formatCurrency(newPrice)}
                </p>
              )}

              {priceMsg && (
                <p className="coach-profile__modal-error">{priceMsg}</p>
              )}
            </div>

            <button
              type="button"
              className="coach-profile__modal-confirm"
              onClick={handleConfirmPrice}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoachProfilePage;