import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import "../../styles/court-view.css";
import court2 from "../../assets/court-2.jpg";

const court = {
  name: "Granada",
  contact: "+57 3122588794",
  address: "Av. 4ta N # 6-80",
  whatsapp: "573122588794",
  image: court2,
};

function CourtViewPage() {
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${court.whatsapp}`, "_blank");
  };

  return (
    <div className="court-view">
      <div className="court-view__grid">
        <section className="court-view__main">
          <div className="court-view__card">
            <img
              src={court.image}
              alt={court.name}
              className="court-view__image"
            />
            <div className="court-view__info">
              <h2 className="court-view__name">{court.name}</h2>
              <p className="court-view__detail">
                <span className="court-view__label">Contact: </span>
                {court.contact}
              </p>
              <p className="court-view__detail">
                <span className="court-view__label">Address: </span>
                {court.address}
              </p>
              <button
                className="court-view__whatsapp-btn"
                onClick={handleWhatsApp}
              >
                Contact via WhatsApp
              </button>
            </div>
          </div>
        </section>
        <AdBanners />
      </div>
    </div>
  );
}

export default CourtViewPage;
