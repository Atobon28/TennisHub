import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { useCourts } from "../../context";
import "../../styles/court-view.css";
import court1 from "../../assets/court-1.jpg";

const buildWhatsAppLink = (phone: string, courtName: string) => {
  const cleanPhone = phone.replace(/\D/g, "");

  if (!cleanPhone) return "";

  const message = `Hi! I found ${courtName} on TennisHub and I would like more information about booking a court.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

function CourtViewPage() {
  const { id } = useParams();

  const { selectedCourt, loading, error, loadCourtById } = useCourts();
  const hasLoadedCourt = useRef(false);

  useEffect(() => {
    if (!id || hasLoadedCourt.current) return;

    hasLoadedCourt.current = true;
    loadCourtById(id);
  }, [id, loadCourtById]);

  if (loading) {
    return <p style={{ padding: 20, color: "#888" }}>Loading court...</p>;
  }

  if (error) {
    return <p style={{ padding: 20, color: "#888" }}>{error}</p>;
  }

  if (!selectedCourt) {
    return <p style={{ padding: 20, color: "#888" }}>Court not found.</p>;
  }

  const whatsappLink =
    typeof selectedCourt.contact === "string"
      ? buildWhatsAppLink(
          selectedCourt.contact,
          selectedCourt.name || "this court",
        )
      : "";

  return (
    <div className="court-view">
      <div className="court-view__grid">
        <section className="court-view__main">
          <div className="court-view__card">
            <img
              src={
                typeof selectedCourt.image === "string"
                  ? selectedCourt.image
                  : court1
              }
              alt={selectedCourt.name || "Tennis court"}
              className="court-view__image"
            />

            <div className="court-view__info">
              <h2 className="court-view__name">{selectedCourt.name}</h2>

              <p className="court-view__detail">
                <span className="court-view__label">Surface: </span>
                {typeof selectedCourt.courtType === "string"
                  ? selectedCourt.courtType
                  : "Not specified"}
              </p>

              <p className="court-view__detail">
                <span className="court-view__label">Contact: </span>
                {typeof selectedCourt.contact === "string"
                  ? selectedCourt.contact
                  : "Not specified"}
              </p>

              <p className="court-view__detail">
                <span className="court-view__label">Address: </span>
                {typeof selectedCourt.address === "string"
                  ? selectedCourt.address
                  : "Not specified"}
              </p>

              {whatsappLink ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="court-view__whatsapp-btn"
                >
                  Contact by WhatsApp
                </a>
              ) : (
                <p className="court-view__whatsapp-message">
                  No WhatsApp phone number available for this court.
                </p>
              )}
            </div>
          </div>
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default CourtViewPage;