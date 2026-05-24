import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { useAuth } from "../../context/useAuth";
import { useProfile } from "../../context";
import { logoutUser } from "../../firebase/services";
import "../../styles/coach-profile.css";
import coach1 from "../../assets/coach-1.jpg";
import { useToast } from "../../context/ToastContext";

const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const hourOptions = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

interface ScheduleDay {
  enabled: boolean;
  start: string;
  end: string;
}

type Schedule = Record<string, ScheduleDay>;

const createEmptySchedule = () => {
  const schedule: Schedule = {};

  allDays.forEach((day) => {
    schedule[day] = {
      enabled: false,
      start: "",
      end: "",
    };
  });

  return schedule;
};

function CoachProfilePage() {
  const navigate = useNavigate();
  const { userData, refreshUserData } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    uploadAvatar,
    editProfile,
    changePassword,
    loading: profileLoading,
    error: profileError,
    success: profileSuccess,
    clearProfileMessages,
  } = useProfile();

  const [avatar, setAvatar] = useState<string>(userData?.photoURL || coach1);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState("");

  const [schedule, setSchedule] = useState<Schedule>(createEmptySchedule());
  const [price, setPrice] = useState<string>("Not configured");
  const [saved, setSaved] = useState(false);
  const [scheduleError, setScheduleError] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const [newPrice, setNewPrice] = useState("");
  const [priceMsg, setPriceMsg] = useState("");

  const formatCurrency = (value: string | number) => {
    const onlyNumbers = String(value).replace(/\D/g, "");

    if (!onlyNumbers) return "Not configured";

    const numberValue = Number(onlyNumbers);

    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(numberValue);
  };

  useEffect(() => {
    setAvatar(userData?.photoURL || coach1);

    if (userData?.pricePerHour) {
      setPrice(formatCurrency(userData.pricePerHour));
    } else {
      setPrice("Not configured");
    }

    const baseSchedule = createEmptySchedule();

    if (userData?.availableSchedule) {
      allDays.forEach((day) => {
        baseSchedule[day] = {
          enabled: Boolean(userData.availableSchedule?.[day]?.enabled),
          start: userData.availableSchedule?.[day]?.start || "",
          end: userData.availableSchedule?.[day]?.end || "",
        };
      });

      setSchedule(baseSchedule);
      return;
    }

    if (Array.isArray(userData?.availableDays)) {
      userData.availableDays.forEach((day) => {
        if (baseSchedule[day]) {
          baseSchedule[day] = {
            enabled: true,
            start: "",
            end: "",
          };
        }
      });
    }

    setSchedule(baseSchedule);
  }, [userData]);

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
      showToast("Error uploading image.", "error");

      if (error instanceof Error) {
        setAvatarMsg(error.message);
      } else {
        setAvatarMsg("Error uploading avatar.");
      }
    } finally {
      setUploadingAvatar(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const toggleDay = (day: string) => {
    setSaved(false);
    setScheduleError("");

    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const handleHourChange = (
    day: string,
    field: "start" | "end",
    value: string,
  ) => {
    setSaved(false);
    setScheduleError("");

    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const validateSchedule = () => {
    for (const day of allDays) {
      const currentDay = schedule[day];

      if (currentDay.enabled && (!currentDay.start || !currentDay.end)) {
        setScheduleError(`Please select start and end time for ${day}.`);
        return false;
      }

      if (
        currentDay.enabled &&
        currentDay.start &&
        currentDay.end &&
        currentDay.start >= currentDay.end
      ) {
        setScheduleError(`End time must be later than start time for ${day}.`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateSchedule()) return;

    try {
      if (userData?.id) {
        const availableDays = allDays.filter((day) => schedule[day].enabled);

        await editProfile(userData.id, {
          availableDays,
          availableSchedule: schedule,
        });

        await refreshUserData();
      }

      setSaved(true);
      setScheduleError("");
      showToast("Profile saved successfully.", "success");
    } catch (error) {
      console.error("Error saving schedule:", error);
      setScheduleError("Error saving schedule. Please try again.");
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

      alert("Password updated successfully.");
    } catch (error) {
      console.error("Error changing password:", error);

      if (profileError) {
        setPasswordMsg(profileError);
      } else {
        setPasswordMsg("Error updating password. Please try again.");
      }
    }
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
        await editProfile(userData.id, {
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

            <div className="coach-profile__user-info">
              <h2 className="coach-profile__name">{name}</h2>
              <p className="coach-profile__username">{username}</p>

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
              const currentDay = schedule[day];
              const isSelected = currentDay.enabled;

              return (
                <div
                  key={day}
                  className="coach-profile__day-row"
                  style={{
                    alignItems: "flex-start",
                    gap: "0.75rem",
                  }}
                >
                  <img
                    src={avatar}
                    alt=""
                    className="coach-profile__day-icon"
                  />

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                      }}
                    >
                      <span className="coach-profile__day-name">{day}</span>

                      <button
                        type="button"
                        className={`coach-profile__check-circle ${
                          isSelected
                            ? "coach-profile__check-circle--active"
                            : ""
                        }`}
                        onClick={() => toggleDay(day)}
                      >
                        {isSelected ? "✓" : ""}
                      </button>
                    </div>

                    {isSelected && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(120px, 1fr))",
                          gap: "0.75rem",
                          marginTop: "0.75rem",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "0.78rem",
                              fontWeight: 800,
                              marginBottom: "0.35rem",
                              color: "#555",
                            }}
                          >
                            Start
                          </label>

                          <select
                            value={currentDay.start}
                            onChange={(e) =>
                              handleHourChange(day, "start", e.target.value)
                            }
                            className="coach-profile__modal-input"
                          >
                            <option value="">Start time</option>

                            {hourOptions.map((hour) => (
                              <option key={hour} value={hour}>
                                {hour}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "0.78rem",
                              fontWeight: 800,
                              marginBottom: "0.35rem",
                              color: "#555",
                            }}
                          >
                            End
                          </label>

                          <select
                            value={currentDay.end}
                            onChange={(e) =>
                              handleHourChange(day, "end", e.target.value)
                            }
                            className="coach-profile__modal-input"
                          >
                            <option value="">End time</option>

                            {hourOptions.map((hour) => (
                              <option key={hour} value={hour}>
                                {hour}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {scheduleError && (
            <p
              style={{
                color: "#e05252",
                fontWeight: 800,
                marginTop: "0.75rem",
              }}
            >
              {scheduleError}
            </p>
          )}

          <div className="coach-profile__save-wrap">
            {saved && (
              <span className="coach-profile__saved-msg">✓ Profile saved!</span>
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
