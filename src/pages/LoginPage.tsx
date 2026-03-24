import { Link, useNavigate } from "react-router-dom";
import "../styles/access-pages.css";
import loginImage from "../assets/login.jpg";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const role = localStorage.getItem("role");

    if (role === "coach") {
      navigate("/coach/home");
    } else if (role === "admin") {
      navigate("/admin/home");
    } else {
      navigate("/player/home");
    }
  };

  return (
    <div className="access-screen">
      <section className="access-screen__left">
        <div className="access-screen__content access-screen__content--form">
          <h1 className="access-screen__title">TennisHub</h1>
          <h2 className="access-screen__subtitle access-screen__subtitle--login">
            Log in
          </h2>

          <form className="access-form" onSubmit={handleLogin}>
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
              Login
            </button>

            <div className="access-form__footer">
              <span className="access-form__footer-line">
                <span className="access-form__back-icon">‹</span>
                <span>No account yet?</span>
                <Link to="/register" className="access-form__footer-link">
                  Sign up
                </Link>
              </span>
            </div>
          </form>
        </div>
      </section>

      <section className="access-screen__right">
        <img
          src={loginImage}
          alt="TennisHub login"
          className="access-screen__image"
        />
      </section>
    </div>
  );
}

export default LoginPage;
