import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { Icon } from "@iconify/react";
import { getAdminCourts, addCourt } from "../../firebase/services";
import "../../styles/admin-courts.css";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  useEffect(() => {
    const handler = () => setShowModal(true);
    window.addEventListener("admin:addCourt", handler);
    return () => window.removeEventListener("admin:addCourt", handler);
  }, []);

  const fetchCourts = async () => {
    try {
      const data = await getAdminCourts("admin1");
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
    if (!newName) return;
    try {
      await addCourt("admin1", {
        name: newName,
        contact: newContact,
        address: newAddress,
        image: newImage || court1,
      });
      await fetchCourts();
      handleClose();
    } catch (error) {
      console.error("Error adding court:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setNewName("");
    setNewContact("");
    setNewAddress("");
    setNewImage(null);
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
          ) : (
            <div className="admin-courts__courts-grid">
              {courts.map((court) => (
                <article key={court.id} className="admin-courts__court-card">
                  <img
                    src={court.image}
                    alt={court.name}
                    className="admin-courts__court-image"
                  />
                  <div className="admin-courts__court-overlay">
                    <span className="admin-courts__court-name">
                      {court.name}
                    </span>
                    <button
                      className="admin-courts__see-more-btn"
                      onClick={() => navigate(`/admin/courts/view/${court.id}`)}>
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
            <h2 className="admin-courts__modal-title">Add Court</h2>
            <div className="admin-courts__modal-section">
              <label className="admin-courts__modal-label">Name</label>
              <input
                type="text"
                className="admin-courts__modal-input"
                placeholder="Name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <label className="admin-courts__modal-label">
                Contact Phone:
              </label>
              <input
                type="text"
                className="admin-courts__modal-input"
                placeholder="Contact Phone..."
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
              />
              <label className="admin-courts__modal-label">Adress:</label>
              <input
                type="text"
                className="admin-courts__modal-input"
                placeholder="Adress..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
              <label className="admin-courts__modal-label">Photo:</label>
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
            <button className="admin-courts__modal-confirm" onClick={handleAdd}>
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCourtsPage;
