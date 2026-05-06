import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { Icon } from "@iconify/react";
import { getAdminCourts, addCourt } from "../../firebase/services";
import { useAuth } from "../../context/AuthContext";
import "../../styles/admin-courts.css";
import "../../styles/create-match.css";
import court1 from "../../assets/court-1.jpg";

interface Court {
  id: string;
  name: string;
  image: string;
  contact?: string;
  address?: string;
}

function AdminCourtsPage() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCourts();
  }, [userData]);

  useEffect(() => {
    const handler = () => setShowModal(true);

    window.addEventListener("admin:addCourt", handler);

    return () => window.removeEventListener("admin:addCourt", handler);
  }, []);

  const fetchCourts = async () => {
    if (!userData?.uid) return;

    setLoading(true);

    try {
      const data = await getAdminCourts(userData.uid);
      setCourts(data as Court[]);
    } catch (error) {
      console.error("Error fetching courts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => setNewImage(reader.result as string);

    reader.readAsDataURL(file);
  };

  const handleAdd = async () => {
    if (!userData?.uid) return;

    if (!newName || !newContact || !newAddress) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setCreating(true);

    try {
      await addCourt(userData.uid, {
        name: newName,
        contact: newContact,
        address: newAddress,
        image: newImage || court1,
      });

      await fetchCourts();
      handleClose();
    } catch (error) {
      console.error("Error adding court:", error);
      setError("Error creating court. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setNewName("");
    setNewContact("");
    setNewAddress("");
    setNewImage(null);
    setError("");
  };

  return (
    <div className="admin-courts">
      <div className="admin-courts__grid">
        <section className="admin-courts__main">
          <div className="admin-courts__section-title-wrap">
            <span className="admin-courts__icon-gradient-wrap">
              <Icon
                icon="mingcute:fire-fill"
                className="admin-courts__section-icon"
              />
            </span>

            <h2 className="admin-courts__section-title">My Courts</h2>
          </div>

          {loading ? (
            <p className="admin-courts__loading">Loading courts...</p>
          ) : courts.length === 0 ? (
            <p className="admin-courts__loading">
              You have not created courts yet.
            </p>
          ) : (
            <div className="admin-courts__courts-grid">
              {courts.map((court) => (
                <article key={court.id} className="admin-courts__court-card">
                  <img
                    src={court.image || court1}
                    alt={court.name}
                    className="admin-courts__court-image"
                  />

                  <div className="admin-courts__court-overlay">
                    <span className="admin-courts__court-name">
                      {court.name}
                    </span>

                    <button
                      className="admin-courts__see-more-btn"
                      onClick={() => navigate(`/admin/courts/view/${court.id}`)}
                    >
                      See more
                    </button>
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
            <button className="admin-courts__modal-close" onClick={handleClose}>
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

              {error && <p className="create-match__error">{error}</p>}

              <button
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
    </div>
  );
}

export default AdminCourtsPage;