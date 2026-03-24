import { useState } from "react";
import AdBanners from "../../components/player/AdBanners";
import "../../styles/admin-court-view.css";
import court2 from "../../assets/court-2.jpg";

function AdminCourtViewPage() {
  const [contact, setContact] = useState("+57 3122588794");
  const [address, setAddress] = useState("Av. 4ta N # 6-80");
  const [showModal, setShowModal] = useState(false);
  const [tempContact, setTempContact] = useState(contact);
  const [tempAddress, setTempAddress] = useState(address);

  const handleSave = () => {
    setContact(tempContact);
    setAddress(tempAddress);
    setShowModal(false);
  };

  return (
    <div className="admin-court-view">
      <div className="admin-court-view__grid">
        <section className="admin-court-view__main">
          <div className="admin-court-view__card">
            <img
              src={court2}
              alt="Granada"
              className="admin-court-view__image"
            />
            <div className="admin-court-view__info">
              <h2 className="admin-court-view__name">Granada</h2>
              <p className="admin-court-view__detail">
                <span className="admin-court-view__label">Contact: </span>
                {contact}
              </p>
              <p className="admin-court-view__detail">
                <span className="admin-court-view__label">Adress: </span>
                {address}
              </p>
              <button
                className="admin-court-view__edit-btn"
                onClick={() => {
                  setTempContact(contact);
                  setTempAddress(address);
                  setShowModal(true);
                }}
              >
                Edit Info
              </button>
            </div>
          </div>
        </section>

        <AdBanners />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-court-view__modal-overlay">
          <div className="admin-court-view__modal">
            <button
              className="admin-court-view__modal-close"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="admin-court-view__modal-title">Edit Court Info</h2>
            <div className="admin-court-view__modal-section">
              <label className="admin-court-view__modal-label">Contact:</label>
              <input
                type="text"
                className="admin-court-view__modal-input"
                value={tempContact}
                onChange={(e) => setTempContact(e.target.value)}
              />
              <label className="admin-court-view__modal-label">Address:</label>
              <input
                type="text"
                className="admin-court-view__modal-input"
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
              />
            </div>
            <button
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
