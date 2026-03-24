import { useNavigate } from "react-router-dom";
import "../styles/access-pages.css";
import selectRoleImage from "../assets/select-role.jpg";

function SelectRolePage() {
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    localStorage.setItem("role", role);
    navigate("/login");
  };

  return (
    <div className="access-screen">
      <section className="access-screen__left">
        <div className="access-screen__content">
          <h1 className="access-screen__title">TennisHub</h1>
          <h2 className="access-screen__subtitle">Select Your Role</h2>

          <div className="access-screen__buttons">
            <button
              className="access-screen__button-dark"
              onClick={() => handleRoleSelect("player")}
            >
              Player
            </button>

            <button
              className="access-screen__button-dark"
              onClick={() => handleRoleSelect("admin")}
            >
              Admin
            </button>

            <button
              className="access-screen__button-dark"
              onClick={() => handleRoleSelect("coach")}
            >
              Coach
            </button>
          </div>
        </div>
      </section>

      <section className="access-screen__right">
        <img
          src={selectRoleImage}
          alt="TennisHub select role"
          className="access-screen__image"
        />
      </section>
    </div>
  );
}

export default SelectRolePage;
