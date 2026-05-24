import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { useCourts } from "../../context";
import { useToast } from "../../context/ToastContext";
import "../../styles/admin-court-view.css";
import court1 from "../../assets/court-1.jpg";

function AdminCourtViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    selectedCourt,
    loading,
    error: courtError,
    loadCourtById,
    editCourt,
    uploadCourtPhoto,
    clearCourtError,
  } = useCourts();

  const [showModal, setShowModal] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempContact, setTempContact] = useState("");
  const [tempAddress, setTempAddress] = useState("");
  const [tempCourtType, setTempCourtType] = useState("");
  const [tempImage, setTempImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!id) return;

    loadCourtById(id);
  }, [id, loadCourtById]);

  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length >= 7 && cleanPhone.length <= 15;
  };

  const handleOpenModal = () => {
    if (!selectedCourt) return;

    setTempName(selectedCourt.name || "");
    setTempContact(
      typeof selectedCourt.contact === "string" ? selectedCourt.contact : "",
    );
    setTempAddress(
      typeof selectedCourt.address === "string" ? selectedCourt.address : "",
    );
    setTempCourtType(
      typeof selectedCourt.courtType === "string"
        ? selectedCourt.courtType
        : "",
    );
    setTempImage(
      typeof selectedCourt.image === "string" ? selectedCourt.image : "",
    );
    setImageFile(null);
    setFormError("");
    clearCourtError();
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setTempImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!selectedCourt?.id) return;

    if (
      !tempName.trim() ||
      !tempContact.trim() ||
      !tempAddress.trim() ||
      !tempCourtType
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (!validatePhone(tempContact)) {
      setFormError("Please enter a valid phone number.");
      return;
    }

    setSaving(true);
    setFormError("");
    clearCourtError();

    try {
      let imageUrl =
        typeof selectedCourt.image === "string" ? selectedCourt.image : "";

      if (imageFile) {
        imageUrl = await uploadCourtPhoto(selectedCourt.id, imageFile);
      }

      await editCourt(selectedCourt.id, {
        name: tempName.trim(),
        contact: tempContact.trim(),
        address: tempAddress.trim(),
        courtType: tempCourtType,
        image: imageUrl,
      });

      await loadCourtById(selectedCourt.id);

      showToast("Court updated successfully.", "success");
      setShowModal(false);
    } catch (error) {
      console.error("Error updating court:", error);

      if (error instanceof Error) {
        setFormError(error.message);
        showToast(error.message, "error");
      } else {
        setFormError("Error updating court. Please try again.");
        showToast("Error updating court. Please try again.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ padding: 20, color: "#888" }}>Loading court...</p>;
  }

  if (!selectedCourt) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: "#888" }}>Court not found.</p>

        <button
          type="button"
          onClick={() => navigate("/admin/profile")}
          style={{
            border: "none",
            borderRadius: "999px",
            padding: "0.7rem 1rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Back to profile
        </button>
      </div>
    );
  }

  const visibleError = formError || courtError;

  return (
    <div className="admin-court-view">
      <div className="admin-court-view__grid">
        <section className="admin-court-view__main">
          <button
            type="button"
            onClick={() => navigate("/admin/profile")}
            style={{
              border: "none",
              borderRadius: "999px",
              padding: "0.7rem 1rem",
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            ← Back to profile
          </button>

          {visibleError && (
            <p className="admin-court-view__error-message">{visibleError}</p>
          )}

          <div className="admin-court-view__card">
            <img
              src={
                typeof selectedCourt.image === "string"
                  ? selectedCourt.image
                  : court1
              }
              alt={selectedCourt.name || "Tennis court"}
              className="admin-court-view__image"
            />

            <div className="admin-court-view__info">
              <h2 className="admin-court-view__name">{selectedCourt.name}</h2>

              <p className="admin-court-view__detail">
                <span className="admin-court-view__label">Type: </span>
                {typeof selectedCourt.courtType === "string"
                  ? selectedCourt.courtType
                  : "Not specified"}
              </p>

              <p className="admin-court-view__detail">
                <span className="admin-court-view__label">Contact: </span>
                {typeof selectedCourt.contact === "string"
                  ? selectedCourt.contact
                  : "Not specified"}
              </p>

              <p className="admin-court-view__detail">
                <span className="admin-court-view__label">Address: </span>
                {typeof selectedCourt.address === "string"
                  ? selectedCourt.address
                  : "Not specified"}
              </p>

              <button
                type="button"
                className="admin-court-view__edit-btn"
                onClick={handleOpenModal}
              >
                Edit Court
              </button>
            </div>
          </div>
        </section>

        <AdBanners />
      </div>

      {showModal && (
        <div className="admin-court-view__modal-overlay">
          <div className="admin-court-view__modal">
            <button
              type="button"
              className="admin-court-view__modal-close"
              onClick={() => setShowModal(false)}
              disabled={saving}
            >
              ✕
            </button>

            <h2 className="admin-court-view__modal-title">Edit Court</h2>

            <div className="admin-court-view__modal-section">
              <label className="admin-court-view__modal-label">Name:</label>
              <input
                type="text"
                className="admin-court-view__modal-input"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
              />

              <label className="admin-court-view__modal-label">
                Court Type:
              </label>
              <select
                className="admin-court-view__modal-input"
                value={tempCourtType}
                onChange={(e) => setTempCourtType(e.target.value)}
              >
                <option value="">Select court type</option>
                <option value="Grass">Grass</option>
                <option value="Hard">Hard</option>
                <option value="Clay">Clay</option>
              </select>

              <label className="admin-court-view__modal-label">Contact:</label>
              <input
                type="text"
                className="admin-court-view__modal-input"
                value={tempContact}
                onChange={(e) => setTempContact(e.target.value)}
                placeholder="Example: 3001234567"
              />

              <label className="admin-court-view__modal-label">Address:</label>
              <input
                type="text"
                className="admin-court-view__modal-input"
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
              />

              <label className="admin-court-view__modal-label">
                Court Image:
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="admin-court-view__modal-input"
                onChange={handleImageChange}
              />

              {tempImage && (
                <img
                  src={tempImage}
                  alt="Court preview"
                  className="admin-court-view__preview-image"
                />
              )}

              {visibleError && (
                <p className="admin-court-view__error-message">
                  {visibleError}
                </p>
              )}
            </div>

            <button
              type="button"
              className="admin-court-view__modal-confirm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCourtViewPage;
