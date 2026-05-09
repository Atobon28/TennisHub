import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { getCourts, updateCourt } from "../../firebase/services";
import "../../styles/admin-court-view.css";
import court1 from "../../assets/court-1.jpg";

interface Court {
  id: string;
  name: string;
  contact?: string;
  address?: string;
  image?: string;
  courtType?: string;
}

function AdminCourtViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [court, setCourt] = useState<Court | null>(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [tempContact, setTempContact] = useState("");
  const [tempAddress, setTempAddress] = useState("");
  const [tempCourtType, setTempCourtType] = useState("");

  useEffect(() => {
    fetchCourt();
  }, [id]);

  const fetchCourt = async () => {
    try {
      const data = await getCourts();
      const found = (data as Court[]).find((item) => item.id === id);
      setCourt(found || null);
    } catch (error) {
      console.error("Error fetching court:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    if (!court) return;

    setTempContact(court.contact || "");
    setTempAddress(court.address || "");
    setTempCourtType(court.courtType || "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!court?.id) return;

    try {
      await updateCourt(court.id, {
        contact: tempContact,
        address: tempAddress,
        courtType: tempCourtType,
      });

      setCourt({
        ...court,
        contact: tempContact,
        address: tempAddress,
        courtType: tempCourtType,
      });

      setShowModal(false);
    } catch (error) {
      console.error("Error updating court:", error);
    }
  };

  if (loading) {
    return <p style={{ padding: 20, color: "#888" }}>Loading court...</p>;
  }

  if (!court) {
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

          <div className="admin-court-view__card">
            <img
              src={court.image || court1}
              alt={court.name}
              className="admin-court-view__image"
            />

            <div className="admin-court-view__info">
              <h2 className="admin-court-view__name">{court.name}</h2>

              <p className="admin-court-view__detail">
                <span className="admin-court-view__label">Type: </span>
                {court.courtType || "Not specified"}
              </p>

              <p className="admin-court-view__detail">
                <span className="admin-court-view__label">Contact: </span>
                {court.contact || "Not specified"}
              </p>

              <p className="admin-court-view__detail">
                <span className="admin-court-view__label">Address: </span>
                {court.address || "Not specified"}
              </p>

              <button
                type="button"
                className="admin-court-view__edit-btn"
                onClick={handleOpenModal}
              >
                Edit Info
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
            >
              ✕
            </button>

            <h2 className="admin-court-view__modal-title">Edit Court Info</h2>

            <div className="admin-court-view__modal-section">
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

              <label className="admin-court-view__modal-label">
                Contact:
              </label>

              <input
                type="text"
                className="admin-court-view__modal-input"
                value={tempContact}
                onChange={(e) => setTempContact(e.target.value)}
              />

              <label className="admin-court-view__modal-label">
                Address:
              </label>

              <input
                type="text"
                className="admin-court-view__modal-input"
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="admin-court-view__modal-confirm"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCourtViewPage;