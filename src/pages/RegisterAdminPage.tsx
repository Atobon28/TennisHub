import { Link, useNavigate } from "react-router-dom";
import "../styles/access-pages.css";
import registerImage from "../assets/register.jpg";

function RegisterAdminPage() {
  const navigate = useNavigate();

  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/login");
  };

  return (
    <div className="access-screen">
      <section className="access-screen__left">
        <div className="access-screen__content access-screen__content--form">
          <h1 className="access-screen__title">TennisHub</h1>
          <h2 className="access-screen__subtitle access-screen__subtitle--login">
            Register
          </h2>

          <form className="access-form" onSubmit={handleRegister}>
            <div className="access-form__group">
              <label className="access-form__label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="access-form__input"
                placeholder="Enter your email..."
              />
            </div>

            <div className="access-form__group">
              <label className="access-form__label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="access-form__input"
                placeholder="Enter your username..."
              />
            </div>

            <div className="access-form__group">
              <label className="access-form__label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="access-form__input"
                placeholder="Enter your password..."
              />
            </div>

            <button type="submit" className="access-form__button-primary">
              Register
            </button>

            <div className="access-form__footer">
              <span className="access-form__footer-line">
                <span className="access-form__back-icon">‹</span>
                <span>Already have an account?</span>
                <Link to="/login" className="access-form__link">
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </section>

      <section className="access-screen__right">
        <img
          src={registerImage}
          alt="TennisHub register admin"
          className="access-screen__image"
        />
      </section>
    </div>
  );
}

export default RegisterAdminPage;
