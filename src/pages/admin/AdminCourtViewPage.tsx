import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { useCourts } from "../../context";
import "../../styles/admin-court-view.css";
import court1 from "../../assets/court-1.jpg";

function AdminCourtViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [message, setMessage] = useState("");
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
    setMessage("");
    setFormError("");
    clearCourtError();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setImageFile(null);
    setTempImage("");
    setFormError("");
    clearCourtError();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

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
    setMessage("");
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
        image: imageUrl || court1,
      });

      await loadCourtById(selectedCourt.id);

      setMessage("Court updated successfully.");
      setShowModal(false);
    } catch (error) {
      console.error("Error updating court:", error);

      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Error updating court. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p style={{ padding: 20, color: "#555" }} role="status">
        Loading court...
      </p>
    );
  }

  if (!selectedCourt) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: "#555" }} role="alert">
          Court not found.
        </p>

        <button
          type="button"
          aria-label="Back to admin profile"
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
  const courtName = selectedCourt.name || "Tennis court";
  const courtImage =
    typeof selectedCourt.image === "string" ? selectedCourt.image : court1;

  return (
    <div className="admin-court-view">
      <div className="admin-court-view__grid">
        <section className="admin-court-view__main">
          <button
            type="button"
            aria-label="Back to admin profile"
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

          {message && (
            <p className="admin-court-view__success-message" role="status">
              ✓ {message}
            </p>
          )}

          {visibleError && (
            <p className="admin-court-view__error-message" role="alert">
              {visibleError}
            </p>
          )}

          <div className="admin-court-view__card">
            <img
              src={courtImage || court1}
              alt={`${courtName} court`}
              className="admin-court-view__image"
              onError={(event) => {
                event.currentTarget.src = court1;
              }}
            />

            <div className="admin-court-view__info">
              <h2 className="admin-court-view__name">{courtName}</h2>

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
                aria-label={`Edit ${courtName}`}
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
              aria-label="Close edit court modal"
              onClick={handleCloseModal}
              disabled={saving}
            >
              ✕
            </button>

            <h2 className="admin-court-view__modal-title">Edit Court</h2>

            <div className="admin-court-view__modal-section">
              <label
                className="admin-court-view__modal-label"
                htmlFor="edit-court-name"
              >
                Name:
              </label>

              <input
                id="edit-court-name"
                type="text"
                className="admin-court-view__modal-input"
                value={tempName}
                required
                onChange={(event) => setTempName(event.target.value)}
              />

              <label
                className="admin-court-view__modal-label"
                htmlFor="edit-court-type"
              >
                Court Type:
              </label>

              <select
                id="edit-court-type"
                className="admin-court-view__modal-input"
                value={tempCourtType}
                required
                onChange={(event) => setTempCourtType(event.target.value)}
              >
                <option value="">Select court type</option>
                <option value="Grass">Grass</option>
                <option value="Hard">Hard</option>
                <option value="Clay">Clay</option>
              </select>

              <label
                className="admin-court-view__modal-label"
                htmlFor="edit-court-contact"
              >
                Contact:
              </label>

              <input
                id="edit-court-contact"
                type="tel"
                inputMode="numeric"
                className="admin-court-view__modal-input"
                value={tempContact}
                required
                onChange={(event) => setTempContact(event.target.value)}
                placeholder="Example: 3001234567"
              />

              <label
                className="admin-court-view__modal-label"
                htmlFor="edit-court-address"
              >
                Address:
              </label>

              <input
                id="edit-court-address"
                type="text"
                className="admin-court-view__modal-input"
                value={tempAddress}
                required
                onChange={(event) => setTempAddress(event.target.value)}
              />

              <label
                className="admin-court-view__modal-label"
                htmlFor="edit-court-image"
              >
                Court Image:
              </label>

              <input
                id="edit-court-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="admin-court-view__modal-input"
                onChange={handleImageChange}
              />

              {tempImage && (
                <img
                  src={tempImage || court1}
                  alt={`${tempName || courtName} preview`}
                  className="admin-court-view__preview-image"
                  onError={(event) => {
                    event.currentTarget.src = court1;
                  }}
                />
              )}

              {visibleError && (
                <p className="admin-court-view__error-message" role="alert">
                  {visibleError}
                </p>
              )}
            </div>

            <button
              type="button"
              className="admin-court-view__modal-confirm"
              aria-label={`Save changes for ${courtName}`}
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