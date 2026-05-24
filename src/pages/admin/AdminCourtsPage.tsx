import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { Icon } from "@iconify/react";
import { useCourts } from "../../context";
import { useAuth } from "../../context/useAuth";
import ConfirmModal from "../../components/common/ConfirmModal";
import "../../styles/admin-courts.css";
import "../../styles/create-match.css";
import court1 from "../../assets/court-1.jpg";

const courtTypeOptions = ["Grass", "Hard", "Clay"];

function AdminCourtsPage() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const {
    adminCourts,
    loading,
    error: courtsError,
    loadAdminCourts,
    createCourt,
    removeCourt,
    clearCourtError,
  } = useCourts();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isCreatingRef = useRef(false);

  const [showModal, setShowModal] = useState(false);
  const [courtToDelete, setCourtToDelete] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCourtType, setNewCourtType] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);

  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!userData?.uid) return;

    loadAdminCourts(userData.uid);
  }, [userData?.uid, loadAdminCourts]);

  useEffect(() => {
    const handler = () => setShowModal(true);

    window.addEventListener("admin:addCourt", handler);

    return () => window.removeEventListener("admin:addCourt", handler);
  }, []);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();

        image.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 800;
          const scale = maxWidth / image.width;

          canvas.width = maxWidth;
          canvas.height = image.height * scale;

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject("Canvas error");
            return;
          }

          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          const resizedImage = canvas.toDataURL("image/jpeg", 0.7);

          resolve(resizedImage);
        };

        image.onerror = reject;
        image.src = reader.result as string;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const resizedImage = await resizeImage(file);
      setNewImage(resizedImage);
    } catch (error) {
      console.error("Error resizing image:", error);
      setFormError("Error uploading image. Please try another one.");
    }
  };

  const handleAdd = async () => {
    if (isCreatingRef.current || creating) return;

    if (!userData?.uid) {
      setFormError("User not found.");
      return;
    }

    if (
      !newName.trim() ||
      !newContact.trim() ||
      !newAddress.trim() ||
      !newCourtType
    ) {
      setFormError("Please fill in all fields.");
      return;
    }

    isCreatingRef.current = true;
    setFormError("");
    clearCourtError();
    setCreating(true);

    try {
      await createCourt(userData.uid, {
        name: newName.trim(),
        contact: newContact.trim(),
        address: newAddress.trim(),
        courtType: newCourtType,
        image: newImage || court1,
        createdAt: new Date().toISOString(),
      });

      handleClose();
    } catch (error) {
      console.error("Error adding court:", error);
      setFormError("Error creating court. Please try again.");
    } finally {
      isCreatingRef.current = false;
      setCreating(false);
    }
  };

  const handleRequestDeleteCourt = (courtId: string) => {
    setCourtToDelete(courtId);
  };

  const handleCancelDeleteCourt = () => {
    setCourtToDelete(null);
  };

  const handleConfirmDeleteCourt = async () => {
    if (!courtToDelete) return;

    try {
      await removeCourt(courtToDelete);
      setCourtToDelete(null);
    } catch (error) {
      console.error("Error deleting court:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setNewName("");
    setNewContact("");
    setNewAddress("");
    setNewCourtType("");
    setNewImage(null);
    setFormError("");
    clearCourtError();
    isCreatingRef.current = false;
    setCreating(false);
  };

  return (
    <div className="admin-courts">
      <div className="admin-courts__grid">
        <section className="admin-courts__main">
          <div
            className="admin-courts__section-title-wrap"
            style={{
              justifyContent: "space-between",
              width: "100%",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="admin-courts__icon-gradient-wrap">
                <Icon
                  icon="mingcute:fire-fill"
                  className="admin-courts__section-icon"
                />
              </span>

              <h2 className="admin-courts__section-title">My Courts</h2>
            </div>

            <button
              type="button"
              className="create-match__btn"
              onClick={() => setShowModal(true)}
              style={{
                width: "auto",
                padding: "0 1.25rem",
                minHeight: "40px",
                fontSize: "0.85rem",
              }}
            >
              {adminCourts.length === 0
                ? "Create first court"
                : "Add more courts"}
            </button>
          </div>

          {loading ? (
            <p className="admin-courts__loading">Loading courts...</p>
          ) : courtsError ? (
            <p className="admin-courts__loading">{courtsError}</p>
          ) : adminCourts.length === 0 ? (
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "1.5rem",
                textAlign: "center",
                boxShadow: "0 8px 18px rgba(15, 14, 12, 0.06)",
              }}
            >
              <p className="admin-courts__loading">
                You have not created courts yet.
              </p>

              <button
                type="button"
                className="create-match__btn"
                onClick={() => setShowModal(true)}
                style={{
                  marginTop: "0.75rem",
                  width: "auto",
                  padding: "0 1.25rem",
                }}
              >
                Create first court
              </button>
            </div>
          ) : (
            <div className="admin-courts__courts-grid">
              {adminCourts.map((court) => (
                <article key={court.id} className="admin-courts__court-card">
                  <img
                    src={typeof court.image === "string" ? court.image : court1}
                    alt={court.name || "Tennis court"}
                    className="admin-courts__court-image"
                  />

                  <div className="admin-courts__court-overlay">
                    <span className="admin-courts__court-name">
                      {court.name}
                    </span>

                    {court.courtType && (
                      <span
                        style={{
                          backgroundColor: "rgba(255,255,255,0.9)",
                          color: "#111",
                          padding: "0.25rem 0.7rem",
                          borderRadius: "999px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          marginTop: "0.4rem",
                        }}
                      >
                        {String(court.courtType)}
                      </span>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginTop: "0.75rem",
                      }}
                    >
                      <button
                        type="button"
                        className="admin-courts__see-more-btn"
                        onClick={() =>
                          navigate(`/admin/courts/view/${court.id}`)
                        }
                      >
                        See more
                      </button>

                      <button
                        type="button"
                        className="admin-courts__see-more-btn"
                        onClick={() => handleRequestDeleteCourt(court.id)}
                        style={{ backgroundColor: "#e05252" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <AdBanners />
      </div>

      {showModal && (
        <div className="admin-courts__modal-overlay">
          <div className="admin-courts__modal">
            <button
              type="button"
              className="admin-courts__modal-close"
              onClick={handleClose}
            >
              ✕
            </button>

            <div className="create-match__card">
              <h2 className="create-match__title">Create a new court</h2>

              <div className="create-match__section">
                <h3 className="create-match__section-title">Court Info</h3>

                <label className="create-match__label">Name:</label>
                <div className="create-match__select-wrap">
                  <input
                    type="text"
                    className="create-match__select"
                    placeholder="Court name..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>

                <label className="create-match__label">Court Type:</label>
                <div className="create-match__select-wrap">
                  <select
                    className="create-match__select"
                    value={newCourtType}
                    onChange={(e) => setNewCourtType(e.target.value)}
                  >
                    <option value="">Select court type</option>

                    {courtTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="create-match__label">Contact Phone:</label>
                <div className="create-match__select-wrap">
                  <input
                    type="text"
                    className="create-match__select"
                    placeholder="Contact phone..."
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                  />
                </div>

                <label className="create-match__label">Address:</label>
                <div className="create-match__select-wrap">
                  <input
                    type="text"
                    className="create-match__select"
                    placeholder="Address..."
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="create-match__section">
                <h3 className="create-match__section-title">Photo</h3>

                <label className="create-match__label">Court Photo:</label>

                <div
                  className="admin-courts__modal-photo"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {newImage ? (
                    <img
                      src={newImage}
                      alt="preview"
                      className="admin-courts__modal-photo-preview"
                    />
                  ) : (
                    <span className="admin-courts__modal-photo-placeholder">
                      Click to upload photo...
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>

              {(formError || courtsError) && (
                <p className="create-match__error">
                  {formError || courtsError}
                </p>
              )}

              <button
                type="button"
                className="create-match__btn"
                onClick={handleAdd}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Court"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(courtToDelete)}
        title="Delete court?"
        message="Are you sure you want to delete this court? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onCancel={handleCancelDeleteCourt}
        onConfirm={handleConfirmDeleteCourt}
      />
    </div>
  );
}

export default AdminCourtsPage;
