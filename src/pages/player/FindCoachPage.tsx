import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import PersonCard from "../../components/player/PersonCard";
import { Icon } from "@iconify/react";
import "../../styles/find-coach.css";
import coach1 from "../../assets/coach-1.jpg";
import coach2 from "../../assets/coach-2.jpg";
import coach3 from "../../assets/coach-3.jpg";

const coaches = [
  { id: 1, name: "Juan Ceballos", image: coach1 },
  { id: 2, name: "Sebas López", image: coach2 },
  { id: 3, name: "Santi Pérez", image: coach3 },
  { id: 4, name: "Leo Cruz", image: coach1 },
  { id: 5, name: "Nico Vega", image: coach2 },
  { id: 6, name: "Dani Ríos", image: coach3 },
  { id: 7, name: "Tomás León", image: coach1 },
  { id: 8, name: "Hugo Lara", image: coach2 },
  { id: 9, name: "Iván Soto", image: coach3 },
  { id: 10, name: "Gael Mora", image: coach1 },
  { id: 11, name: "Alan Ruiz", image: coach2 },
  { id: 12, name: "Marco Díaz", image: coach3 },
];

function FindCoachPage() {
  const navigate = useNavigate();

  return (
    <div className="find-coach">
      <div className="find-coach__grid">
        <section className="find-coach__main">
          <div className="find-coach__section-title-wrap">
            <span className="find-coach__icon-gradient-wrap">
              <Icon icon="mdi:arm-flex" className="find-coach__section-icon" />
            </span>
            <h2 className="find-coach__section-title">Coaches</h2>
          </div>

          <div className="find-coach__coaches-grid">
            {coaches.map((coach) => (
              <div
                key={coach.id}
                onClick={() => navigate("/player/coaches/view")}
              >
                <PersonCard name={coach.name} image={coach.image} />
              </div>
            ))}
          </div>
        </section>

        <AdBanners />
      </div>
    </div>
  );
}

export default FindCoachPage;
