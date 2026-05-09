import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { getCourts } from "../../firebase/services";
import "../../styles/court-view.css";
import court1 from "../../assets/court-1.jpg";

interface Court {
  id: string;
  name: string;
  contact?: string;
  address?: string;
  image?: string;
  courtType?: string;
}

function CourtViewPage() {
  const { id } = useParams();

  const [court, setCourt] = useState<Court | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchCourt();
  }, [id]);

  if (loading) {
    return <p style={{ padding: 20, color: "#888" }}>Loading court...</p>;
  }

  if (!court) {
    return <p style={{ padding: 20, color: "#888" }}>Court not found.</p>;
  }

  return (
    <div className="court-view">
      <div className="court-view__grid">
        <section className="court-view__main">
          <div className="court-view__card">
            <img
              src={court.image || court1}
              alt={court.name}
              className="court-view__image"
            />

            <div className="court-view__info">
              <h2 className="court-view__name">{court.name}</h2>

              <p className="court-view__detail">
                <span className="court-view__label">Surface: </span>
                {court.courtType || "Not specified"}
              </p>

              <p className="court-view__detail">
                <span className="court-view__label">Contact: </span>
                {court.contact || "Not specified"}
              </p>

              <p className="court-view__detail">
                <span className="court-view__label">Address: </span>
                {court.address || "Not specified"}
              </p>

              <button
                type="button"
                className="court-view__whatsapp-btn"
                disabled={!court.contact}
                onClick={() => {
                  if (!court.contact) return;

                  window.open(
                    `https://wa.me/${court.contact.replace(/\D/g, "")}`,
                    "_blank"
                  );
                }}
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